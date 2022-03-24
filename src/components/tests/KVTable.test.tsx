import React, { useState } from 'react'
import { act, wait, render, fireEvent } from 'test-utils'
import { KVTable } from 'components/KVTable'

describe('KVTable', () => {
  it('should render without crash', async () => {
    const Comp: React.FC = () => {
      return <KVTable records={[]} />
    }
    render(<Comp />)
  })
})
