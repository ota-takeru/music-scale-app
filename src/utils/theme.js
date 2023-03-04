import 'styled-components'
import { css } from 'styled-components'

export const theme = {
  media: {
    sm: (...args) => css`
      @media (max-width: 640px) {
        ${css(...args)}
      }
    `,
  },
}
