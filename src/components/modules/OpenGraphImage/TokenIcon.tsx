import { CSSProperties } from 'react'

import IconUnknown from '@images/emoji/hmm.svg'

export type TokenIconProps = {
  src: string | null
  style?: CSSProperties
}

export default function TokenIcon({ src, style }: TokenIconProps) {
  const styles = {
    width: '128px',
    height: '128px',
    borderWidth: '6px',
    borderStyle: 'solid',
    borderRadius: '50%',
    borderColor: '#0e1015',

    ...style,
  }

  return src ? <img src={src} alt="" style={styles} /> : <IconUnknown style={styles} />
}
