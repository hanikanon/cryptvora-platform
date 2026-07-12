import { useEffect, useRef, useState } from "react"

/**
 * Instagram-style hide-on-scroll:
 * hides when the user scrolls down, reveals immediately when scrolling up.
 */
export function useHideOnScroll(threshold = 8) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    lastY.current = window.scrollY
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const dy = y - lastY.current
        if (Math.abs(dy) > threshold) {
          if (dy > 0 && y > 80) setHidden(true)
          else if (dy < 0) setHidden(false)
          lastY.current = y
        }
        ticking.current = false
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return hidden
}