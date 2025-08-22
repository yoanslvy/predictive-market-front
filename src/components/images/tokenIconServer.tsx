// 'use client'

import React from "react";
import Image from "next/image";

import { getAddress } from "viem";


interface ComponentProps {
    button: string;
}


const checkImage = async (url: string, fallback1: string, fallback2: string): Promise<string | null> => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
            return url;
        } else {
            const fallbackResponse1 = await fetch(fallback1, { method: 'HEAD' });
            if (fallbackResponse1.ok) {
                return fallback1;
            } else {
                const fallbackResponse2 = await fetch(fallback2, { method: 'HEAD' });
                if (fallbackResponse2.ok) {
                    return fallback2;
                } else {

                    return null;
                }
            }
        }
    } catch (error) {
        return null;
    }
};

export default async function TokenIcon({ tokenAddress, chainId, classNames }: { tokenAddress: string, chainId: string, classNames?: ComponentProps }) {

    // const { isConnected, address } = useAccount()



    const trustWalletChainMap: any = {
        '1': 'ethereum',
        '5': 'goerli',
        '40': 'telos',
        '56': 'smartchain',
        '137': 'polygon',
        '42161': 'arbitrum',
        '1329': 'sei'
    }
    
    const dextoolsChainMap: any = {
        '1': 'ether',
        '40': 'telos',
        '56': 'bsc',
        '137': 'polygon',
        '42161': 'arbitrum',
        '5': 'goerli',
        
    }
    const checkedAddress = getAddress(tokenAddress)// : '0x0000000000'



    // const source = 
    // const source = `https://www.dextools.io/resources/tokens/logos/${dextoolsChainMap[chainId]}/${checkedAddress}.png`
    const source = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${trustWalletChainMap[chainId]}/assets/${checkedAddress}/logo.png`
    const fallbackSource = `https://www.dextools.io/resources/tokens/logos/${dextoolsChainMap[chainId]}/${checkedAddress.toLowerCase()}.png` //|| '/brand/3d-token-question-white.png'
    const fallbackSource2 = `https://www.dextools.io/resources/tokens/logos/3/${dextoolsChainMap[chainId]}/${checkedAddress.toLowerCase()}.png` //|| '/brand/3d-token-question-white.png'
    // const [imageSource, setImageSource] = useState(`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${trustWalletChainMap[chainId]}/assets/${getAddress(tokenAddress)}/logo.png`)

    const validImageUrl = await checkImage(source, fallbackSource, fallbackSource2)

    if (!validImageUrl) {
        return (<>
            <Image
                className={classNames?.button}
                width={64}
                height={64}
                alt="Token Icon"
                src={'/brand/3d-token-question-white_blurred.png'}
                priority
            />
        </>); // or return a placeholder
    }

    // useEffect(() => {
    //     setSource(`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${trustWalletChainMap[chainId]}/assets/${getAddress(tokenAddress)}/logo.png`);
    //     router.refresh()
    //     setFallbackSource(`https://www.dextools.io/resources/tokens/logos/${dextoolsChainMap[chainId]}/${getAddress(tokenAddress).toLowerCase()}.png`)
    //     setFallbackSource2(`https://www.dextools.io/resources/tokens/logos/3/${dextoolsChainMap[chainId]}/${getAddress(tokenAddress).toLowerCase()}.png`)
    // }, [imageSource, tokenAddress, chainId]);


    // // const [error, setError] = useState(false);

    // let router = useRouter()
    // useEffect(() => {
    //     setImageSource(imageSource);
    //     router.refresh()
    // }, [imageSource, tokenAddress, chainId]);




    // const onError = () => {
    //     if (imageSource === source) {
    //         setImageSource(fallbackSource);
    //     }
    //     else if (imageSource === fallbackSource) {
    //         setImageSource(fallbackSource2);
    //         // setError(true)
    //     }
    //     else if (imageSource === fallbackSource2) {
    //         setImageSource('/brand/3d-token-question-white.png')
    //         // setError(true)
    //     }
    // };

    return (
        // error ? (
        //     <div className="w-12 h-12">
        //         {'G'}
        //     </div>
        // ) : 
        <>
            <Image
                className={classNames?.button}
                width={64}
                height={64}
                alt="Token Icon"
                src={validImageUrl}
                priority
            // blurDataURL="/brand/3d-token-question-white_blurred.png"
            // placeholder="blur"
            // onLoadingComplete={(result) => {
            //     if (result.naturalWidth === 0) {
            //         setImageSource(unknownImage)
            //         // Broken image
            //         //   setImageSource(unknownImage)

            //     }
            // }}

            // onError={onError}
            />
        </>

    )
}
// setImageSource('/brand/3d-token-question-white.png')