'server-only'

import LogoSpinner from '@components/spinners/logoSpinnerAnimated'

export default async function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="h-44 w-44 bg-dark-base-999 p-2 rounded-full">
        <LogoSpinner></LogoSpinner>
      </div>
    </div>
  )
}
