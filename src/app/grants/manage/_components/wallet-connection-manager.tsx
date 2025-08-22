'use client'

import React, { useState } from "react"

import "@styles/main.scss";

import { useRouter, useSearchParams } from 'next/navigation';
import { Connector } from "wagmi";

import { useConnect, useDisconnect } from 'wagmi';
import { useEffect } from 'react';


import { usePathname } from "next/navigation";

import {
  useAccount,
} from 'wagmi'
import { useAutoConnect } from "./useAutoconnect";




export default function WalletConnectionManager() {

  const { connect, connectors, error } = useConnect();

  const { address, chain } = useAccount()
  
  const searchParams = useSearchParams()
  let router = useRouter()
  let pathname = usePathname()
  
  
  const coreSlug = pathname
  
  // const AUTOCONNECTED_CONNECTOR_IDS = ['safe'];
  
  // const { connect, connectors } = useConnect();
  

  // useEffect(() => {
  //   AUTOCONNECTED_CONNECTOR_IDS.forEach((connector) => {
  //     const connectorInstance = connectors.find((c) => c.id === connector && c.ready);

  //     if (connectorInstance) {
  //       connect({ connector: connectorInstance });
  //     }
  //   });


  // }, [connect, connectors]);

  useAutoConnect()

  const { isConnecting, connector: activeConnector } = useAccount();
  const { disconnect } = useDisconnect();


  useEffect(() => {
    if (!address) {
      let page = (!!searchParams.get('service')) ? searchParams.get('service') : 'overview'
      router.replace(coreSlug + `?service=${page}`)
    }

    if (address && chain && ((!searchParams.get('wallet') || !searchParams.get('service')) || 
        searchParams.get('chain') !== chain?.id.toString() || 
        searchParams.get('wallet') !== address)) {
      
      // Create URLSearchParams from existing parameters
      const currentParams = new URLSearchParams(searchParams.toString())
      
      // Update only the wallet, chain and service parameters
      currentParams.set('chain', chain.id.toString())
      currentParams.set('wallet', address.toString())
      if (!currentParams.get('service')) {
        currentParams.set('service', 'overview')
      }

      // Preserve all other parameters
      router.replace(coreSlug + '?' + currentParams.toString())
    }
  }, [address, chain, chain?.id, searchParams, coreSlug, router])


  // TODO: ADD LOCAL CACHE CLEARS 

  return (
    <>
    {/* For testing: */}
      {/* <div>
        <div>
          {activeConnector && (
            <>
              <button onClick={() => disconnect()}>Disconnect from {activeConnector.name}</button>
            </>
          )}

          {connectors
            .filter((x) => x.id !== activeConnector?.id)
            .map((x) => (
              <button key={x.id} onClick={() => connect({ connector: x })}>
                {x.name}
                {isConnecting && ' (connecting)'}
              </button>
            ))}
        </div>
      </div> */}
    </>
  )
}
