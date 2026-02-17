import { useState, useEffect } from 'react'
import { getTimeUntilWedding } from '@/lib/utils'

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilWedding())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilWedding())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex justify-center space-x-4 md:space-x-8 mb-10">
      {[
        { label: 'Dias', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Minutos', value: timeLeft.minutes },
        { label: 'Segundos', value: timeLeft.seconds },
      ].map((item, index) => (
        <div key={item.label} className="text-center">
          <div className="border border-white/30 p-4 md:p-6 min-w-[70px] md:min-w-[90px]">
            <div className="text-2xl md:text-4xl font-light tracking-wider">
              {item.value.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="text-xs tracking-[0.2em] uppercase mt-3 font-light">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}