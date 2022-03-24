import React from 'react'
import { Providers } from './Providers'
import { Routes } from './route'
import { MotionReport } from 'components/MotionReport'
import { Patent } from 'pages/index/Patent'

export const App: React.FC = () => {
  return (
    <Providers>
      <MotionReport />
      <div className='app'>
        <Patent>
          <Routes></Routes>
        </Patent>
      </div>
    </Providers>
  )
}
