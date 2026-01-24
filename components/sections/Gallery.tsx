import { useState, useEffect, useCallback } from 'react'
import { Upload, Image as ImageIcon, X, Heart, Trash2, Download, Lock, User, CheckSquare, Square } from 'lucide-react'
import Image from 'next/image'
import { useGallery } from '@/hooks/useGallery'
import { Button } from '@/components/ui/Button'
import { useNotification } from '@/hooks/useNotification' 
import { useAdminCheck } from '@/hooks/useAuth'
import { AdminLogin } from '@/components/ui/AdminLogin'
import { MultiSelectActions } from '@/components/ui/MultiSelectActions'
import { GalleryItem } from '@/lib/types'

export const Gallery = () => {
  // Hooks
	const { 
		loading, 
		uploading, 
		gallery, 
		uploadPhotos, 
		fetchGallery,
		deletePhoto,
		deleteMultiplePhotos,
		getTotalPhotos,
		getPhotosByCategory
	} = useGallery()

	const { showNotification } = useNotification()
	const { isAdmin, loginAsAdmin, logoutAdmin } = useAdminCheck()

	// Estados locais
	const [activeFilter, setActiveFilter] = useState<GalleryItem['category'] | 'all'>('all')
	const [dragActive, setDragActive] = useState(false)
	const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
	const [selectedCategory, setSelectedCategory] = useState<GalleryItem['category']>('other')
	const [uploaderName, setUploaderName] = useState('')
	const [showAdminLogin, setShowAdminLogin] = useState(false)
	
	// Novos estados para seleção múltipla
	const [selectedItems, setSelectedItems] = useState<GalleryItem[]>([])
	const [selectionMode, setSelectionMode] = useState(false)

	const filters = [
		{ key: 'all' as const, label: 'Todas', icon: '📸' },
		{ key: 'ceremony' as const, label: 'Cerimônia', icon: '💒' },
		{ key: 'reception' as const, label: 'Recepção', icon: '🥂' },
		{ key: 'party' as const, label: 'Festa', icon: '🎉' },
		{ key: 'other' as const, label: 'Outras', icon: '❤️' }
	]

	useEffect(() => {
		const categoryToFetch = activeFilter === 'all' ? undefined : activeFilter
		fetchGallery(categoryToFetch)
	}, [fetchGallery, activeFilter])

	// Limpar seleção quando mudar filtro
	useEffect(() => {
		setSelectedItems([])
		setSelectionMode(false)
	}, [activeFilter])

	const validateName = (name: string): { isValid: boolean; message?: string} => {
		const trimmedName = name.trim()
		
		if (!trimmedName) {
		return { isValid: false }
		}
		
		if (trimmedName.length < 3) {
		return { isValid: false }
		}
		
		if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName)) {
			return { isValid: false, message: '⚠️ O nome deve conter somente letras' }
		}
		
		return { isValid: true }
	}

	const nameValidation = validateName(uploaderName)

	// Funções de seleção múltipla
	const toggleItemSelection = (item: GalleryItem) => {
		setSelectedItems(prev => {
		const isSelected = prev.find(selected => selected.id === item.id)
		if (isSelected) {
			return prev.filter(selected => selected.id !== item.id)
		} else {
			return [...prev, item]
		}
		})
	}

	const selectAllVisible = () => {
		setSelectedItems(filteredGallery)
	}

	const clearSelection = () => {
		setSelectedItems([])
		setSelectionMode(false)
	}

	const isItemSelected = (item: GalleryItem) => {
		return selectedItems.find(selected => selected.id === item.id) !== undefined
	}

	const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		
		console.log('🖱️ Drag event:', e.type) // Debug
		
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true)
		} else if (e.type === 'dragleave') {
			// Verificar se realmente saiu da área
			const rect = e.currentTarget.getBoundingClientRect()
			const x = e.clientX
			const y = e.clientY
			
			if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
			setDragActive(false)
			}
		}
	}, [])

	const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)
		
		console.log('📁 Drop event triggered') // Debug
		console.log('📁 Files dropped:', e.dataTransfer.files.length) // Debug
		
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const validation = validateName(uploaderName)
			if (!validation.isValid) {
			showNotification(validation.message || 'Nome inválido', 'error')
			return
			}
			
			console.log('📁 Starting upload...') // Debug
			await uploadPhotos(e.dataTransfer.files, selectedCategory, uploaderName.trim())
		} else {
			console.log('❌ No files found in drop event') // Debug
		}
	}, [uploadPhotos, selectedCategory, uploaderName, showNotification, validateName])

	const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
		const validation = validateName(uploaderName)
		if (!validation.isValid) {
			showNotification(validation.message? validation.message : '', 'error')
			return
		}
		await uploadPhotos(e.target.files, selectedCategory, uploaderName.trim())
		e.target.value = ''
		}
	}, [uploadPhotos, selectedCategory, uploaderName, showNotification])

	const handleDeletePhoto = useCallback(async (item: GalleryItem) => {
		if (!isAdmin) {
		setShowAdminLogin(true)
		return
		}

		const adminSession = localStorage.getItem('wedding_admin_session')
		if (!adminSession) {
			showNotification('Sessão admin expirada. Faça login novamente.', 'error')
			setShowAdminLogin(true)
			return
		}

		if (window.confirm('Tem certeza que deseja deletar esta foto permanentemente?')) {
		await deletePhoto(item)
		setSelectedImage(null)
		}
	}, [deletePhoto, isAdmin])

	const handleUploadClick = () => {
		const validation = validateName(uploaderName)
		if (!validation.isValid) {
		showNotification(validation.message? validation.message : '', 'error')
		return
		}
		document.getElementById('photo-upload')?.click()
	}

	const handleImageClick = (item: GalleryItem, e: React.MouseEvent) => {
		if (selectionMode) {
		e.preventDefault()
		toggleItemSelection(item)
		} else {
		setSelectedImage(item)
		}
	}

	const filteredGallery = activeFilter === 'all' 
		? gallery 
		: gallery.filter(item => item.category === activeFilter)

	const photoStats = getPhotosByCategory()

	return (
		<section id="gallery" className="section-padding bg-gradient-to-b from-white to-gray-50">
		<div className="container-custom">
			<div className="text-center mb-16">
			<h2 className="font-script text-4xl md:text-5xl font-bold text-gradient mb-4">
				Galeria de Momentos
			</h2>
			<p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
				Compartilhe suas fotos com a gente e ajude a eternizar esses momentos
			</p>

			{/* Admin Status */}
			{isAdmin && (
				<div className="mt-4 inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
				<Lock className="w-4 h-4 mr-1" />
				Modo Administrador
				<button
					onClick={logoutAdmin}
					className="ml-2 text-red-600 hover:text-red-800 underline"
				>
					Sair
				</button>
				</div>
			)}
			</div>

			{/* Upload Area */}
			<div className="mb-12">
			<div
				className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
				dragActive 
					? 'border-primary-500 bg-primary-50 scale-105' 
					: 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
				} ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
				onDragStart={(e) => e.preventDefault()}
				onDragEnd={(e) => {
					e.preventDefault()
					setDragActive(false)
				}}
			>
				{/* Nome do Usuário */}
				<div className="mb-6">
				<label className="block text-sm font-medium text-gray-700 mb-2 flex justify-center pr-2">
					<User className="w-4 h-4 inline mr-1" />
					Seu nome:
				</label>
				<input
					type="text"
					value={uploaderName}
					onChange={(e) => setUploaderName(e.target.value)}
					placeholder="Digite seu nome"
					className={`mx-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent max-w-xs transition-colors ${
					uploaderName && !nameValidation.isValid 
						? 'border-red-300 bg-red-50' 
						: uploaderName && nameValidation.isValid
						? 'border-green-300 bg-green-50'
						: 'border-gray-300'
					}`}
					disabled={uploading}
					maxLength={50}
					onDragOver={(e) => e.stopPropagation()}
					onDrop={(e) => e.stopPropagation()}
				/>
				
				{/* Indicador visual do nome */}
				{uploaderName && (
					<div className="mt-2 text-sm">
					{nameValidation.isValid ? (
						<p className="text-green-600 flex items-center justify-center"/>
					) : (
						<p className="text-red-500 flex items-center justify-center"/>
					)}
					</div>
				)}
				</div>

				{/* Category Selection */}
				<div className="mb-6">
				<label className="block text-sm font-medium text-gray-700 mb-2">
					Categoria das fotos:
				</label>
				<select
					value={selectedCategory}
					onChange={(e) => setSelectedCategory(e.target.value as GalleryItem['category'])}
					className="mx-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					disabled={uploading}
					onDragOver={(e) => e.stopPropagation()}
					onDrop={(e) => e.stopPropagation()}
				>
					<option value="ceremony">💒 Cerimônia</option>
					<option value="reception">🥂 Recepção</option>
					<option value="party">🎉 Festa</option>
					<option value="other">❤️ Outras</option>
				</select>
				</div>

				{/* Input File Oculto */}
				<input
				type="file"
				multiple
				accept="image/*"
				onChange={handleFileInput}
				className="hidden"
				id="photo-upload"
				disabled={uploading}
				/>

				{/* Área de Upload */}
				<div className="cursor-pointer">
				<div className="relative">
					<Upload className={`w-12 h-12 text-primary-500 mx-auto mb-4 ${uploading ? 'animate-bounce' : ''}`} />
					{uploading && (
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
					</div>
					)}
				</div>
				<h3 className="text-xl font-semibold mb-2 text-gray-900">
					{uploading ? 'Enviando suas fotos...' : 'Compartilhe suas fotos! 📸'}
				</h3>
				<p className="text-gray-600 mb-6">
					{uploading 
					? 'Aguarde enquanto processamos suas fotos...' 
					: 'Clique no botão abaixo ou arraste suas fotos para fazer upload'
					}
				</p>
				
				<button
					type="button"
					onClick={handleUploadClick}
					disabled={uploading || !nameValidation.isValid}
					className={`inline-flex items-center px-6 py-3 border border-primary-500 rounded-lg text-primary-600 bg-white hover:bg-primary-50 transition-colors duration-200 ${
					uploading || !nameValidation.isValid ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
					}`}
				>
					<Upload className="w-4 h-4 mr-2" />
					{uploading ? 'Enviando...' : 'Selecionar Fotos'}
				</button>

				{!nameValidation.isValid && uploaderName && (
					<p className="text-red-500 flex items-center justify-center"/>
				)}

				{!uploaderName.trim() && (
					<p className="text-gray-500 text-sm mt-2">
					💡 Digite seu nome para começar
					</p>
				)}
				</div>
			</div>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap justify-center gap-4 mb-8">
			{filters.map((filter) => {
				const count = filter.key === 'all' ? getTotalPhotos() : photoStats[filter.key as keyof typeof photoStats] || 0
				return (
				<button
					key={filter.key}
					onClick={() => setActiveFilter(filter.key)}
					className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center space-x-2 ${
					activeFilter === filter.key
						? 'bg-primary-500 text-white shadow-lg transform scale-105'
						: 'bg-white text-primary-600 border-2 border-primary-500 hover:bg-primary-50 hover:scale-105'
					}`}
				>
					<span>{filter.icon}</span>
					<span className="font-medium">{filter.label}</span>
					<span className={`text-xs px-2 py-1 rounded-full ${
					activeFilter === filter.key ? 'bg-white/20' : 'bg-primary-100'
					}`}>
					{count}
					</span>
				</button>
				)
			})}
			</div>

			{/* Controles de seleção múltipla */}
			{filteredGallery.length > 0 && (
			<div className="flex justify-center items-center space-x-4 mb-6">
				<Button
				onClick={() => setSelectionMode(!selectionMode)}
				variant={selectionMode ? "primary" : "outline"}
				size="sm"
				>
				{selectionMode ? (
					<>
					<CheckSquare className="w-4 h-4 mr-2" />
					Sair da Seleção
					</>
				) : (
					<>
					<Square className="w-4 h-4 mr-2" />
					Selecionar Fotos
					</>
				)}
				</Button>

				{selectionMode && (
				<>
					<Button
					onClick={selectAllVisible}
					variant="outline"
					size="sm"
					>
					Selecionar Todas ({filteredGallery.length})
					</Button>
					
					{selectedItems.length > 0 && (
					<Button
						onClick={clearSelection}
						variant="outline"
						size="sm"
					>
						Limpar ({selectedItems.length})
					</Button>
					)}
				</>
				)}
			</div>
			)}

			{/* Gallery Grid */}
			{loading ? (
			<div className="text-center py-12">
				<div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p className="text-gray-600 text-lg">Carregando momentos especiais...</p>
			</div>
			) : filteredGallery.length > 0 ? (
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{filteredGallery.map((item, index) => (
				<div
					key={item.id}
					className={`group relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer animate-fade-in-up ${
					selectionMode ? 'hover:scale-105' : ''
					} ${
					isItemSelected(item) ? 'ring-4 ring-primary-500 scale-105' : ''
					}`}
					style={{ animationDelay: `${index * 100}ms` }}
					onClick={(e) => handleImageClick(item, e)}
				>
					{/* Checkbox de seleção */}
					{selectionMode && (
					<div className="absolute top-2 left-2 z-10">
						<div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
						isItemSelected(item) 
							? 'bg-primary-500 border-primary-500' 
							: 'bg-white/80 border-gray-300'
						}`}>
						{isItemSelected(item) && (
							<CheckSquare className="w-4 h-4 text-white" />
						)}
						</div>
					</div>
					)}

					{/* Imagem */}
					{item.publicUrl ? (
					<Image
						src={item.publicUrl}
						alt={item.fileName || 'Foto do casamento'}
						fill
						className="object-cover group-hover:scale-110 transition-transform duration-500"
						sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
					/>
					) : (
					<div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gradient-to-br from-primary-100 to-secondary-100">
						<ImageIcon className="w-12 h-12 mb-2" />
						<p className="text-sm text-center px-2">{item.fileName}</p>
					</div>
					)}

					{/* Overlay */}
					{!selectionMode && (
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
						<Heart className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
					</div>
					)}

					{/* Category Badge */}
					<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<span className="bg-white/90 text-primary-600 px-2 py-1 rounded-full text-xs font-medium">
						{filters.find(f => f.key === item.category)?.label || 'Outras'}
					</span>
					</div>

					{/* Info */}
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<p className="text-white text-sm font-medium truncate">{item.fileName}</p>
					<p className="text-white/80 text-xs">{item.uploadedBy || 'Anônimo'}</p>
					</div>
				</div>
				))}
			</div>
			) : (
			<div className="text-center py-16">
				<div className="relative">
				<ImageIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
				</div>
				<h3 className="text-2xl font-semibold mb-4 text-gray-600">
				{activeFilter === 'all' ? 'Ainda não há fotos aqui! 📸' : `Nenhuma foto de ${filters.find(f => f.key === activeFilter)?.label.toLowerCase()}`}
				</h3>
				<p className="text-gray-500 text-lg mb-6">
				Seja o primeiro a compartilhar um momento especial!
				</p>
			</div>
			)}

			{/* Image Modal - CORRIGIDO POSICIONAMENTO */}
			{selectedImage && !selectionMode && (
			<div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
				<div className="relative max-w-4xl max-h-[90vh] w-full h-full flex flex-col">
				{/* Header com botões - FIXO NO TOPO */}
				<div className="flex justify-between items-center mb-4 px-2">
					{/* Action Buttons */}
					<div className="flex space-x-4">
					{selectedImage.publicUrl && (
						<a
						href={selectedImage.publicUrl}
						download={selectedImage.fileName}
						className="text-white hover:text-gray-300 transition-colors"
						title="Baixar foto"
						>
						<Download className="w-6 h-6" />
						</a>
					)}
					{isAdmin && (
						<button
						onClick={() => handleDeletePhoto(selectedImage)}
						className="text-red-400 hover:text-red-300 transition-colors"
						title="Deletar foto (Admin)"
						>
						<Trash2 className="w-6 h-6" />
						</button>
					)}
					{!isAdmin && (
						<button
						onClick={() => setShowAdminLogin(true)}
						className="text-gray-400 hover:text-gray-300 transition-colors"
						title="Login Admin para deletar"
						>
						<Lock className="w-6 h-6" />
						</button>
					)}
					</div>

					{/* Close Button */}
					<button
					onClick={() => setSelectedImage(null)}
					className="text-white hover:text-gray-300 transition-colors"
					>
					<X className="w-8 h-8" />
					</button>
				</div>

				{/* Imagem - RESPONSIVA */}
				<div className="flex-1 flex items-center justify-center min-h-0">
					{selectedImage.publicUrl ? (
					<Image
						src={selectedImage.publicUrl}
						alt={selectedImage.fileName || 'Foto do casamento'}
						width={800}
						height={600}
						className="max-w-full max-h-full object-contain rounded-lg"
					/>
					) : (
					<div className="bg-white rounded-lg p-8 text-center">
						<ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<p className="text-gray-600">{selectedImage.fileName}</p>
					</div>
					)}
				</div>

				{/* Footer com informações */}
				<div className="mt-4 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-lg">
					<h3 className="text-white text-lg font-semibold mb-2">{selectedImage.fileName}</h3>
					<div className="flex justify-between items-center text-white/80 text-sm">
					<span>📸 Por: {selectedImage.uploadedBy || 'Anônimo'}</span>
					<span>📅 {new Date(selectedImage.createdAt).toLocaleDateString('pt-BR')}</span>
					</div>
					<div className="flex justify-between items-center text-white/60 text-xs mt-1">
					<span>{filters.find(f => f.key === selectedImage.category)?.label}</span>
					<span>💾 {(selectedImage.fileSize / 1024 / 1024).toFixed(2)} MB</span>
					</div>
				</div>
				</div>
			</div>
			)}

			{/* Multi Select Actions */}
			<MultiSelectActions
			selectedItems={selectedItems}
			onClearSelection={clearSelection}
			onDeleteSelected={deleteMultiplePhotos}
			isAdmin={isAdmin}
			/>

			{/* Admin Login Modal */}
			{showAdminLogin && (
			<AdminLogin 
				onClose={() => setShowAdminLogin(false)}
				onSuccess={() => {
				console.log('Admin logado com sucesso!')
				}}
			/>
			)}
		</div>
		</section>
	)
}