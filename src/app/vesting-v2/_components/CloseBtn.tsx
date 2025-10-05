import { CloseButton } from '@mantine/core'

import { Btn } from './Btn'

export function CloseBtn({ href }: { href?: string }) {
  return (
    <Btn as="link" href={href} variant="transparent" className=''>
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-[15px] font-bold gap-x-[0.6rem] flex items-center justify-center w-full h-full">
          <CloseButton color="#757A8B" className="hover:bg-transparent" size={24} /> Close
        </span>
      </div>
    </Btn>
  )
}
