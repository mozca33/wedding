import { useAdminCheck } from '@/hooks/useAuth';
import { useState, useCallback } from 'react'
import { supabase, uploadFile, getPublicUrl, deleteFile, STORAGE_BUCKETS } from '@/lib/supabase'
import { GalleryItem, GalleryRow } from '@/lib/types'
import { useNotification } from './useNotification'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { generateUniqueFileName } from '@/lib/utils'

interface UploadResult {
	path: string
	id?: string
	fullPath?: string
}

export const useGallery = () => {
	const [loading, setLoading] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [gallery, setGallery] = useState<GalleryItem[]>([])
	const { showNotification } = useNotification()
	const { isAdmin } = useAdminCheck()

	const fetchGallery = useCallback(async (category?: GalleryItem['category']) => {
		setLoading(true)
		try {

		let query = supabase
			.from('gallery')
			.select('*')
			.order('created_at', { ascending: false })

		if (category) {
			query = query.eq('category', category)
		}

		const { data, error } = await query

		if (error) throw error

		const galleryItems: GalleryItem[] = (data as GalleryRow[]).map(item => ({
			id: item.id,
			filePath: item.file_path,
			fileName: item.file_name,
			fileSize: item.file_size,
			category: item.category,
			uploadedBy: item.uploaded_by || undefined,
			approved: item.approved,
			createdAt: item.created_at,
			publicUrl: getPublicUrl(STORAGE_BUCKETS.GALLERY, item.file_path)
		}))

			setGallery(galleryItems)
		} catch (error) {
			showNotification('Erro ao carregar galeria.', 'error')
		} finally {
			setLoading(false)
		}
	}, [showNotification])

	const uploadPhotos = useCallback(async (
		files: FileList,
		category: GalleryItem['category'] = 'other',
		uploadedBy: string = 'Convidado'
	) => {
		setUploading(true)
		const uploadPromises: Promise<UploadResult>[] = []
		let successCount = 0
		let errorCount = 0

		try {
		for (let i = 0; i < files.length; i++) {
			const file = files[i]
			
			if (!file.type.startsWith('image/')) {
			showNotification(`${file.name} não é uma imagem válida.`, 'error')
			errorCount++
			continue
			}

			if (file.size > 10 * 1024 * 1024) {
			showNotification(`${file.name} é muito grande. Máximo 10MB.`, 'error')
			errorCount++
			continue
			}

			const fileName = generateUniqueFileName(file.name)
			const filePath = `${category}/${fileName}`

			const uploadPromise = uploadFile(STORAGE_BUCKETS.GALLERY, filePath, file)
			.then(async (uploadData): Promise<UploadResult> => {
				const { error: dbError } = await supabase
				.from('gallery')
				.insert({
					file_path: filePath,
					file_name: file.name,
					file_size: file.size,
					category: category,
					uploaded_by: uploadedBy,
					approved: true 
				})

				if (dbError) throw dbError
				
				successCount++
				
				return {
				path: uploadData.path,
				id: uploadData.id,
				fullPath: uploadData.fullPath
				}
			})
			.catch((error) => {
				console.error(`Erro no upload de ${file.name}:`, error)
				errorCount++
				throw error
			})

			uploadPromises.push(uploadPromise)
		}

		const results = await Promise.allSettled(uploadPromises)
		
		if (successCount > 0) {
			showNotification(
			`${successCount} foto${successCount > 1 ? 's' : ''} enviada${successCount > 1 ? 's' : ''} com sucesso! 📸`,
			'success'
			)
		}
		
		if (errorCount > 0) {
			showNotification(
			`${errorCount} arquivo${errorCount > 1 ? 's' : ''} não puderam ser enviados`,
			'error'
			)
		}
		
		await fetchGallery()
		
		} catch (error) {
		console.error('Error uploading photos:', error)
		showNotification('Erro inesperado ao enviar fotos. Tente novamente.', 'error')
		} finally {
		setUploading(false)
		}
	}, [showNotification, fetchGallery])

	const deletePhoto = useCallback(async (item: GalleryItem) => {
	try {


		const client = isAdmin ? supabaseAdmin : supabase

		const { data: existingData, error: checkError } = await supabase
			.from('gallery')
			.select('id, file_name')
			.eq('id', item.id)

		if (checkError) {
			throw checkError
		}

		if (!existingData || existingData.length === 0) {
			showNotification('Registro não encontrado no banco de dados', 'error')
			return { success: false }
		}

		const { error: dbError, data: deleteData } = await supabase
			.from('gallery')
			.delete()
			.eq('id', item.id)
			.select('id	')

		console.log('📊 Resultado do DELETE:')
		console.log('- Delete Error:', dbError)
		console.log('- Delete Data:', deleteData)

		if (dbError) {
			throw dbError
		}

		const { data: verifyData, error: verifyError } = await supabase
			.from('gallery')
			.select('id')
			.eq('id', item.id)

		try {
			await deleteFile(STORAGE_BUCKETS.GALLERY, item.filePath)
		} catch (storageError) {
			console.warn('⚠️ Erro ao deletar do storage:', storageError)
		}

		setGallery(prev => {
			const newGallery = prev.filter(photo => photo.id !== item.id)
			return newGallery
		})

		showNotification('Foto deletada permanentemente! 🗑️', 'success')
		
		return { success: true }
	} catch (error) {
		console.error('❌ Erro ao deletar foto:', error)
		showNotification(`Erro ao deletar foto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, 'error')
		return { success: false }
	}
	}, [showNotification])

	const deleteMultiplePhotos = useCallback(async (items: GalleryItem[]) => {
		let successCount = 0
		let errorCount = 0
		const deletedIds: string[] = []

		try {
		console.log(`🗑️ Deletando ${items.length} fotos...`)

		// Processar cada foto individualmente
		for (const item of items) {
			try {
			console.log(`🗑️ Deletando foto ID: ${item.id}`)

			// 1. Deletar do banco PRIMEIRO
			const { error: dbError } = await supabase
				.from('gallery')
				.delete()
				.eq('id', item.id)

			if (dbError) {
				console.error(`❌ Erro DB para ${item.fileName}:`, dbError)
				throw dbError
			}

			console.log(`✅ ${item.fileName} deletado do banco`)

			// 2. Deletar do storage DEPOIS
			try {
				await deleteFile(STORAGE_BUCKETS.GALLERY, item.filePath)
				console.log(`✅ ${item.fileName} deletado do storage`)
			} catch (storageError) {
				console.warn(`⚠️ Erro storage para ${item.fileName}:`, storageError)
				// Não falhar se o storage der erro
			}

			// Adicionar à lista de sucessos
			deletedIds.push(item.id)
			successCount++

			} catch (error) {
			console.error(`❌ Erro ao deletar ${item.fileName}:`, error)
			errorCount++
			}
		}

		// 3. Atualizar galeria local com todos os IDs deletados com sucesso
		if (deletedIds.length > 0) {
			setGallery(prev => prev.filter(photo => !deletedIds.includes(photo.id)))
			console.log(`✅ Removidos ${deletedIds.length} itens da galeria local`)
		}

		// 4. Mostrar resultado
		if (successCount > 0) {
			showNotification(
			`${successCount} foto${successCount > 1 ? 's' : ''} deletada${successCount > 1 ? 's' : ''} permanentemente! 🗑️`, 
			'success'
			)
		}

		if (errorCount > 0) {
			showNotification(
			`${errorCount} foto${errorCount > 1 ? 's' : ''} não puderam ser deletadas`, 
			'error'
			)
		}

		return { success: successCount > 0, successCount, errorCount }

		} catch (error) {
		console.error('❌ Erro geral ao deletar fotos:', error)
		showNotification('Erro inesperado ao deletar fotos', 'error')
		return { success: false, successCount: 0, errorCount: items.length }
		}
	}, [showNotification])

	// Função para obter total de fotos
	const getTotalPhotos = useCallback(() => {
		return gallery.length
	}, [gallery])

	// Função para obter estatísticas por categoria
	const getPhotosByCategory = useCallback(() => {
		return {
		ceremony: gallery.filter(item => item.category === 'ceremony').length,
		reception: gallery.filter(item => item.category === 'reception').length,
		party: gallery.filter(item => item.category === 'party').length,
		other: gallery.filter(item => item.category === 'other').length,
		}
	}, [gallery])

	return {
		loading,
		uploading,
		gallery,
		uploadPhotos,
		fetchGallery,
		deletePhoto,
		deleteMultiplePhotos,
		getTotalPhotos,
		getPhotosByCategory
	}
}