import { useState, useEffect } from 'react'

const isBrowser = typeof window !== 'undefined'

export const useMousePos = (): { x: number; y: number } => {
  const [mousePos, setMousePos] = useState({
    x: isBrowser ? window.innerWidth : 1e3,
    y: isBrowser ? window.innerHeight : 1e3,
  })

  useEffect(() => {
    if (isBrowser) {
      const handleResize = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY })
      }
      window.addEventListener('mousemove', (e) => handleResize(e))
      return () => {
        window.removeEventListener('mousemove', (e) => handleResize(e))
      }
    }
  }, [])

  return mousePos
}
