import { useEffect, useRef } from 'react'

export const useInterval = (
  callback: () => void,
  delay: number | null
): void => {
  const savedCallback = useRef<() => void>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const tick = () => {
      savedCallback.current!()
    }
    if (delay !== null) {
      const id: NodeJS.Timeout = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
