import { useEffect, useRef, useState } from 'react'

const useClampedIsInViewport = (options = {}) => {
  const [isInViewport, setIsInViewport] = useState(false)
  const [wasInViewportAtleastOnce, setWasInViewportAtleastOnce] = useState(false)
  const targetRef = useRef(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting)
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || '0px',
      }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [options.threshold, options.rootMargin])

  useEffect(() => {
    if (isInViewport && !wasInViewportAtleastOnce) {
      setWasInViewportAtleastOnce(true)
    }
  }, [isInViewport, wasInViewportAtleastOnce])

  return [wasInViewportAtleastOnce, targetRef]
}

export default useClampedIsInViewport
