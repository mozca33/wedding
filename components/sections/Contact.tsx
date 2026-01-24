// components/sections/Contact.tsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Phone, MapPin, Instagram, MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useNotification } from '@/hooks/useNotification'

interface ContactForm {
  name: string
  email: string
  message: string
}

export const Contact = () => {
  const [loading, setLoading] = useState(false)
  const { showNotification } = useNotification()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactForm>()

  const onSubmit = async (data: ContactForm) => {
    setLoading(true)
    
    try {
      const message = `Nova mensagem do site de casamento:\n\nNome: ${data.name}\nE-mail: ${data.email}\nMensagem: ${data.message}`
      const whatsappUrl = `https://wa.me/5562994776888?text=${encodeURIComponent(message)}`
      
      window.open(whatsappUrl, '_blank')
      
      showNotification('Redirecionando para WhatsApp...', 'success')
      reset()
    } catch (error) {
      showNotification('Erro ao enviar mensagem. Tente novamente.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'E-mail',
      value: 'rafaelfelipe501@gmail.com',
      href: 'mailto:rafaelfelipe501@gmail.com'
    },
    {
      icon: Phone,
      label: 'Telefone',
      value: '(62) 99477-6888',
      href: 'tel:+5562994776888'
    },
    {
      icon: MapPin,
      label: 'Local da Cerimônia',
      value: 'Recanto dos buritis, Goiânia - GO',
      href: 'https://maps.app.goo.gl/DYJuZdPYVZN15X978'
    }
  ]

  const socialLinks = [
    {
      icon: Instagram,
      label: 'Instagram',
      href: 'https://instagram.com/rafaelf.c',
      color: 'hover:text-pink-600'
    },
    {
      icon: MessageSquare,
      label: 'WhatsApp',
      href: 'https://wa.me/5562994776888',
      color: 'hover:text-green-600'
    }
  ]

  return (
    <section id="contact" className="section-padding gradient-bg">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-script text-4xl md:text-5xl font-bold text-gradient mb-4">
            Entre em Contato
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tem alguma dúvida sobre o casamento? Entre em contato conosco! Ficaremos felizes em ajudar.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="card">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                Informações de Contato
              </h3>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <div
                      key={info.label}
                      className="flex items-center space-x-4 animate-fade-in-up"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{info.label}</p>
                        <a
                          href={info.href}
                          
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {info.value}
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Social Links */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">
                Redes Sociais
              </h3>
              
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 transition-all duration-300 hover:scale-110 ${social.color} animate-fade-in-up`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      title={social.label}
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Wedding Info Card */}
            <div className="card bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                💕 Lembrete Importante
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Para confirmar sua presença, não esqueça de preencher o formulário. 
                Isso nos ajuda muito no planejamento do dia!
              </p>
              <Button
                onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline"
                className="mt-4"
              >
                Confirmar Presença
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card">
            <div className="text-center mb-6">
              <Send className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900">
                Envie uma Mensagem
              </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Seu Nome *"
                {...register('name', { required: 'Nome é obrigatório' })}
                error={errors.name?.message}
                placeholder="Digite seu nome"
              />

              <Input
                label="Seu E-mail *"
                type="email"
                {...register('email', { 
                  required: 'E-mail é obrigatório',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'E-mail inválido'
                  }
                })}
                error={errors.email?.message}
                placeholder="seu@email.com"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sua Mensagem *
                </label>
                <textarea
                  {...register('message', { required: 'Mensagem é obrigatória' })}
                  className="textarea-field"
                  rows={5}
                  placeholder="Escreva sua mensagem, dúvida ou sugestão..."
                />
                {errors.message && (
                  <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                <Send size={16} className="mr-2" />
                Enviar via WhatsApp
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}