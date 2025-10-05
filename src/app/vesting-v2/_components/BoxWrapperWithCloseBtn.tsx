import { ReactNode } from 'react'

import { CloseBtn } from './CloseBtn'

export function BoxWrapperWithCloseBtn({ children, href }: { children: ReactNode; href?: string }) {
  return (
    <div className="page-content-no-pt-no-flex rounded-xl bg-[#17181c] relative">
      <div className="absolute top-[1.5em] right-[1.5em] z-10">
        <CloseBtn href={href} />
      </div>
      <div className="flex items-start justify-center w-full h-full mt-[6em] lg:mt-[1.5em]">
        {children}
      </div>
    </div>
  )
}
