// components/ui/MultiSelectActions.tsx
import { useState } from 'react'
import { Download, Trash2, X, CheckSquare, Square } from 'lucide-react'
import { Button } from './Button'
import { GalleryItem } from '@/lib/types'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface MultiSelectActionsProps {
  selectedItems: GalleryItem[]
  onClearSelection: () => void
  onDeleteSelected: (items: GalleryItem[]) => Promise<{ success: boolean; successCount: number; errorCount: number; }> // Tipagem correta
  isAdmin: boolean
}

export const MultiSelectActions = ({ 
  selectedItems, 
  onClearSelection, 
  onDeleteSelected, 
  isAdmin 
}: MultiSelectActionsProps) => {
  const [downloading, setDownloading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDownloadSelected = async () => {
    if (selectedItems.length === 0) return

    setDownloading(true)
    try {
      if (selectedItems.length === 1) {
        // Download único
        const item = selectedItems[0]
        if (item.publicUrl) {
          const link = document.createElement('a')
          link.href = item.publicUrl
          link.download = item.fileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        // Download múltiplo como ZIP
        const zip = new JSZip()
        
        for (let i = 0; i < selectedItems.length; i++) {
          const item = selectedItems[i]
          if (item.publicUrl) {
            try {
              const response = await fetch(item.publicUrl)
              const blob = await response.blob()
              zip.file(item.fileName, blob)
            } catch (error) {
              console.error(`Erro ao baixar ${item.fileName}:`, error)
            }
          }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })
        saveAs(zipBlob, `fotos-casamento-${new Date().toISOString().split('T')[0]}.zip`)
      }

      onClearSelection()
    } catch (error) {
      console.error('Erro ao fazer download:', error)
    } finally {
      setDownloading(false)
    }
  }

  const handleDeleteSelected = async () => {
    if (!isAdmin || selectedItems.length === 0) return

    const confirmed = window.confirm(
      `Tem certeza que deseja deletar ${selectedItems.length} foto${selectedItems.length > 1 ? 's' : ''} permanentemente?`
    )

    if (!confirmed) return

    setDeleting(true)
    try {
      const result = await onDeleteSelected(selectedItems)
      if (result.success) {
        onClearSelection()
      }
    } catch (error) {
      console.error('Erro ao deletar fotos:', error)
    } finally {
      setDeleting(false)
    }
  }

  if (selectedItems.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 flex items-center space-x-4 min-w-max">
        {/* Contador */}
        <div className="flex items-center space-x-2">
          <CheckSquare className="w-5 h-5 text-primary-500" />
          <span className="font-medium text-gray-700">
            {selectedItems.length} selecionada{selectedItems.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Ações */}
        <div className="flex items-center space-x-2">
          {/* Download */}
          <Button
            onClick={handleDownloadSelected}
            loading={downloading}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Download className="w-4 h-4 mr-1" />
            {downloading ? 'Baixando...' : 'Baixar'}
          </Button>

          {/* Delete (apenas admin) */}
          {isAdmin && (
            <Button
              onClick={handleDeleteSelected}
              loading={deleting}
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {deleting ? 'Deletando...' : 'Deletar'}
            </Button>
          )}

          {/* Limpar seleção */}
          <Button
            onClick={onClearSelection}
            size="sm"
            variant="outline"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}