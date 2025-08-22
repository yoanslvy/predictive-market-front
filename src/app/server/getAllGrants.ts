import { sepolia } from 'viem/chains'
import { createPublicClient, http, getContract, getAddress } from 'viem'
import { simpleGrantManagerAbi } from '../contract/SimpleGrantManager'

export const getAllGrants = async () => {
    let publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
    })

    const contract = getContract({
        address: getAddress('0xe48DBCd180C114A669B75274DeF111dC2B1ccB9c'),
        abi: simpleGrantManagerAbi,
        client: publicClient,
    })

    const allGrants = await contract.read.getAllGrants()

    return allGrants
}


export const getGrant = async (grantId: string) => {
    let publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
    })

    const contract = getContract({
        address: getAddress('0xe48DBCd180C114A669B75274DeF111dC2B1ccB9c'),
        abi: simpleGrantManagerAbi,
        client: publicClient,
    })

    const grant = await contract.read.grants([grantId]) as any[]

    return {
        grantId: grantId,
        collateralToken: grant[0],
        conditionId: grant[1],
        questionId: grant[2],
        amount: grant[3],
        recipient: grant[4],
        resolved: grant[5],
        question: grant[6],
        deadline: grant[7],
    }

}
