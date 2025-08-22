'use client'

import React from "react";
import Image from "next/image";
import { useState } from "react";

import { getAddress } from "viem";
import { useAccount } from "wagmi";

interface ComponentProps {
    button: string;
}

export default function TokenIcon({tokenAddress, chainId, classNames}: {tokenAddress: string, chainId: string, classNames?: ComponentProps}) {

    const { isConnected, address } = useAccount()

    const trustWalletChainMap:any = {
        '1': 'ethereum',
        '5': 'goerli',
        '56': 'smartchain'
    }
    const checkedAddress = getAddress(tokenAddress)// : '0x0000000000'
    const source = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${trustWalletChainMap[chainId]}/assets/${checkedAddress}/logo.png`

    const unknownImage = '/brand/3d-token-question-white.png'

    const [imageSource, setImageSource] = useState(source)

    return (
        <>
            <Image
                className='w-12 h-12'
                width={64}
                height={64}
                alt="Token Icon"
                src={imageSource}
                blurDataURL="/brand/3d-token-question-white.png"
                placeholder="blur"       
                onError={() => {
                    setImageSource(unknownImage)
                }}
            />
        </>
    )
}