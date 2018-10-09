import { css } from 'emotion'
import { borderRadius } from './constants'

export const TopRoundedStyle = css`
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
`

export const BottomRoundedStyle = css`
  border-bottom-left-radius: ${borderRadius}px;
  border-bottom-right-radius: ${borderRadius}px;
`
