import { Heart, Instagram, Facebook, MessageSquare } from 'lucide-react'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      icon: Instagram,
      href: 'https://instagram.com/rafaelf.c',
      label: 'Instagram'
    },
    {
      icon: MessageSquare,
      href: 'https://wa.me/5562994776888',
      label: 'WhatsApp'
    }
  ]

  const quickLinks = [
    { name: 'Início', href: '#home' },
    { name: 'RSVP', href: '#rsvp' },
    { name: 'Presentes', href: '#gifts' },
    { name: 'Galeria', href: '#gallery' },
    { name: 'Contato', href: '#contact' }
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <Heart className="w-6 h-6 text-red-500 mr-2" />
              <span className="font-script text-3xl">Julia & Rafael</span>
              <Heart className="w-6 h-6 text-red-500 ml-2" />
            </div>
            <p className="text-gray-400 leading-relaxed">
              Celebrando nosso amor e compartilhando nossa alegria com vocês. 
              Obrigado por fazer parte da nossa história!
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact and Social */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4">Nos Acompanhe</h3>
            <div className="flex justify-center md:justify-end space-x-4 mb-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-600 transition-all duration-300 transform hover:scale-110"
                    title={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
            <div className="text-gray-400 text-sm">
              <p>rafaelfelipe501@gmail.com</p>
              <p>(62) 99477-6888</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Julia & Rafael. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm">
              Feito com 💕 para nosso dia especial
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"></div>
    </footer>
  )
}