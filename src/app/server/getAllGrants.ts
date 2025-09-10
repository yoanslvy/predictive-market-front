import { sepolia } from 'viem/chains'
import { createPublicClient, http, getContract, getAddress, Hex } from 'viem'
import { simpleGrantManagerAbi } from '../contract/SimpleGrantManager'

export const singleManagerAddress = '0x4F07b6daCcd6dF8D52efd32F22534304Cc0e1114'

export const getAllGrants = async () => {
    let publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
    })

    const contract = getContract({
        address: getAddress(singleManagerAddress),
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
        address: getAddress(singleManagerAddress),
        abi: simpleGrantManagerAbi,
        client: publicClient,
    })

    const [grant, bond] = await Promise.all([
        contract.read.getGrant([grantId as Hex]) as Promise<any>,
        contract.read.getGrantQuestionBond([grantId as Hex])
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


