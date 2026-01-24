// components/ui/AdminLogin.tsx
import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from './Button'
import { useAdminCheck } from '@/hooks/useAuth'
import { useNotification } from '@/hooks/useNotification'

interface AdminLoginProps {
  onClose: () => void
  onSuccess?: () => void 
}

export const AdminLogin = ({ onClose, onSuccess }: AdminLoginProps) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { loginAsAdmin } = useAdminCheck()
  const { showNotification } = useNotification()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      const success = loginAsAdmin(password)
      if (success) {
        showNotification('Login de admin realizado com sucesso! 🔐', 'success')
        
        if (onSuccess) {
          onSuccess()
        }
        
        onClose()
        
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        showNotification('Senha incorreta. Tente novamente.', 'error')
        setPassword('')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <Lock className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Acesso Administrativo</h2>
          <p className="text-gray-600 text-sm mt-2">
            Digite a senha para acessar funcionalidades de admin
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha de administrador"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-12"
              required
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1"
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </Button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            💡 <strong>Dica:</strong> A senha padrão é "admin123"
          </p>
        </div>
      </div>
    </div>
  )
}