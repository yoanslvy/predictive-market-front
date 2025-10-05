import 'server-only'

import LogoSpinner from '@components/spinners/logoSpinnerAnimated'

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="p-2 rounded-full h-44 w-44 bg-dark-base-999">
        <LogoSpinner></LogoSpinner>
      </div>
    </div>
  )
}
