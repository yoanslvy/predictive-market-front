'use client'

import { Tooltip as ReactTooltip } from 'react-tooltip'

const style = {
  backgroundColor: 'var(--color-hover)',
  borderRadius: '8px',
  maxWidth: '230px',
  zIndex: '2',
  fontSize: '12px',
}

export function Tooltip() {
  return <ReactTooltip id="app-tooltip" style={style} />
}
