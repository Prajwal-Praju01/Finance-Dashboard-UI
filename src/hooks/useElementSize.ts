import { useEffect, useRef, useState } from 'react'

interface ElementSize {
  width: number
  height: number
}

export const useElementSize = <T extends HTMLElement>() => {
  const elementRef = useRef<T | null>(null)
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

  useEffect(() => {
    const element = elementRef.current

    if (!element) {
      return
    }

    const updateSize = () => {
      const rect = element.getBoundingClientRect()
      setSize({
        width: Math.max(0, Math.floor(rect.width)),
        height: Math.max(0, Math.floor(rect.height)),
      })
    }

    updateSize()

    const resizeObserver = new ResizeObserver(() => {
      updateSize()
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return {
    elementRef,
    width: size.width,
    height: size.height,
  }
}
