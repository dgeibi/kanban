import { css } from 'emotion'

export const container = css`
  padding: 0 16px;
  max-width: 872px;
  margin: 0 auto;
`

export const mainContainer = css`
  ${container};
  margin-top: 8px;
`

const headerHeight = 50
const footerHeight = 50

export const header = css`
  height: ${headerHeight}px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
`

export const mainWrapper = css`
  min-height: calc(100vh - ${headerHeight + footerHeight + 5}px);
`
