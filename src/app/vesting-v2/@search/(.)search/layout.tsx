'use client'

import React from 'react'

import Box from '@/src/components/modules/Box'
import styles from '@/src/components/modules/Page/PageHeader/PageHeader.module.scss'

import { Modal } from './_modules/Modal/modal'
import { PageSearch } from './_modules/PageSearch/PageSearch'

export type GlobalSearchParams = {
  sgpage: string | null
  sgquery: string | null
  sgchain: string | null
  sgview?: string
  sgts?: string
}

export default function SearchRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Modal
        modalContent={
          <Box>
            <PageSearch className={styles.dialogSearch} />
            {children}
          </Box>
        }
        classContent={styles.dialogContent}
        classOverlay={styles.dialog}
        closeIcon={false}
      />
    </>
  )
}
