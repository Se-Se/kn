import React, { useEffect, useState } from 'react'
import { Dashboard } from 'components/Dashboard'

export const Page: React.FC = () => {
  const [i, setI] = useState(100)
  useEffect(() => {
    const id = setInterval(() => {
      setI(oi => oi >= 100 ? 0 : (oi + 1))
    }, 10)
    return () => clearInterval(id)
  }, [])
  return <>
    <div style={{ width: 200 + i }}>
      <Dashboard title='高风险' value={i}>{i}</Dashboard>
    </div>
  </>
}
