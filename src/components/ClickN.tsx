import React, { useState, useCallback, useEffect } from 'react'

export const ClickN: React.FC<{
  count?: number
  onClick?: () => void
}> = ({ count, onClick, children }) => {
  const [n, setN] = useState(0)
  const handleClick = useCallback(() => {
    setN((n) => n + 1)
  }, [])
  const cnt = count === undefined ? Infinity : count

  useEffect(() => {
    if (n >= cnt && onClick) {
      onClick()
      setN(0)
      return
    }
    if (n > 0) {
      const id = setTimeout(() => setN(0), 500)
      return () => clearTimeout(id)
    }
  }, [n, cnt, onClick])

  return <div onClick={handleClick}>{children}</div>
}
