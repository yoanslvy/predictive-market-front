'use client'

import { ToastContainer } from 'react-toastify'

import './Toaster.scss'

export default function Toaster() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      closeOnClick
      pauseOnFocusLoss
      pauseOnHover
      theme="dark"
      stacked
      role="alert"
    />
  )
}
