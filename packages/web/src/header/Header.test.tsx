import { fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import Header from 'src/header/Header'
describe('Header', () => {
  describe('when desktop', () => {
    const menuNames = ['About', 'Connect', 'Join', 'Build']
    it('renders the page names', async () => {
      const { debug, getByText } = render(<Header />)
      menuNames.forEach((item) => {
        expect(getByText(item)).toBeTruthy()
      })

      fireEvent.scroll(window, { target: { scrollY: 2000 } })
      menuNames.forEach((item) => {
        expect(getComputedStyle(getByText(item)))
      })
    })
  })
})
