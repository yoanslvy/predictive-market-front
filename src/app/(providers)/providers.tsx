import React from "react";

// import Web3Providers from "@/src/app/(providers)/web3Provider";
import AdobeAriaProvider from "@/src/app/(providers)/adobeAriaProvider";
// import ReactQueryProvider from "@app/(providers)/queryProvider";
// Replacing Tanstack Query with SWR for now for app directory changes
import { headers } from 'next/headers'

import { config } from '@/src/app/(providers)/wagmiConfig'
import Web3ModalProvider from '@/src/app/(providers)/web3Provider'
import { cookieToInitialState } from 'wagmi'
import ErudaProvider from "./erudaProvider";


export default function Providers({ children }: { children: React.ReactNode }) {

  const initialState = cookieToInitialState(config, headers().get('cookie'))

  return (
    <>
      <AdobeAriaProvider>
        <Web3ModalProvider initialState={initialState}>
          <ErudaProvider>
            {children}
          </ErudaProvider>
        </Web3ModalProvider>
      </AdobeAriaProvider>
    </>
  );
}
