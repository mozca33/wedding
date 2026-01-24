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
    <div className="flex justify-center space-x-4 md:space-x-8 mb-8">
      {[
        { label: 'Dias', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Minutos', value: timeLeft.minutes },
        { label: 'Segundos', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
          <div className="text-2xl md:text-4xl font-bold">
            {item.value.toString().padStart(2, '0')}
          </div>
          <div className="text-sm md:text-base font-medium">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  )
}