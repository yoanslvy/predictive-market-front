// import Asided from "@modules/Asided";
import Button from '@modules/Button'
import { FC } from 'react'

import { Frame } from '@components/tw/composed/header-frame'
// import Frame from "@modules/Frame";
import { ActionButton } from '@components/tw/primitive/action-button'
import { Heading } from '@components/tw/primitive/heading'

import IconPlus from '@images/icons/plus.svg'

type ContentRewardsProps = {}

export const ContentManageLocks: FC<ContentRewardsProps> = () => {
  const tools = (
    <>
      <ActionButton size={'default'} variant={'default'} icon={<IconPlus />}>
        New Lock
      </ActionButton>
    </>
  )
  const title = (
    <>
      <Heading>Create New Locker</Heading>
    </>
  )

  return <Frame title={title} tools={tools}></Frame>
}
