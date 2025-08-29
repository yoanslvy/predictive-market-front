import { sepolia } from 'viem/chains'
import { createPublicClient, http, getContract, getAddress } from 'viem'
import { simpleGrantManagerAbi } from '../contract/SimpleGrantManager'

export const getAllGrants = async () => {
    let publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
    })

    const contract = getContract({
        address: getAddress('0x667B6911206f208FDEa3Ab647Aa84996863AFf48'),
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
        address: getAddress('0x667B6911206f208FDEa3Ab647Aa84996863AFf48'),
        abi: simpleGrantManagerAbi,
        client: publicClient,
    })

    const [grant, bond] = await Promise.all([
        contract.read.getGrant([grantId]) as Promise<any>,
        contract.read.getGrantQuestionBond([grantId])
    ])



    return {
        grantId: grantId,
        collateralToken: grant.collateralToken,
        conditionId: grant.conditionId,
        questionId: grant.questionId,
        amount: grant.amount,
        recipient: grant.recipient,
        resolved: grant.resolved,
        question: grant.question,
        deadline: grant.deadline,
        bond: bond,
    }

}


