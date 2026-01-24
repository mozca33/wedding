import dynamic from 'next/dynamic'

// Importar o countdown dinamicamente sem SSR
const CountdownTimer = dynamic(() => import('../CountDownTimer').then(mod => ({ default: mod.CountdownTimer })), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center space-x-4 md:space-x-8 mb-8">
      {[
        { label: 'Dias', value: '--' },
        { label: 'Horas', value: '--' },
        { label: 'Minutos', value: '--' },
        { label: 'Segundos', value: '--' },
      ].map((item) => (
        <div key={item.label} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
          <div className="text-2xl md:text-4xl font-bold">
            {item.value}
          </div>
          <div className="text-sm md:text-base font-medium">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
})

export const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-600" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center text-white px-4">
        <div className="animate-fade-in-up">
          <h1 className="font-script text-6xl md:text-8xl font-bold mb-4">
            {process.env.NEXT_PUBLIC_COUPLE_NAMES || 'Julia & Rafael'}
          </h1>
          <p className="text-xl md:text-2xl mb-2 font-light">
            25 de Julho de 2026
          </p>
          <p className="text-lg md:text-xl mb-8 font-light">
            {process.env.NEXT_PUBLIC_WEDDING_LOCATION || 'São Paulo, SP'}
          </p>
        </div>

        <div className="animate-fade-in-up animation-delay-400">
          <CountdownTimer />
        </div>

        <div className="animate-fade-in-up animation-delay-600">
          <button
            onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary text-lg px-8 py-4"
          >
            Confirmar Presença
          </button>
        </div>
      </div>
    </section>
  )
}