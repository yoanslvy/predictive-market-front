import { sepolia } from 'viem/chains'
import { createPublicClient, http, getContract, getAddress, Hex } from 'viem'
import { simpleGrantManagerAbi } from '../contract/SimpleGrantManager'

export const singleManagerAddress = '0x0Ea58737FA363Fcd31e84DA2eCa54e55F0701309'

export type Grant = {
    grantId: string
    collateralToken: string
    conditionId: string
    questionId: string
    amount: string
    recipient: string
    resolved: string
    question: string
    deadline: string
    bond: bigint
    minBond: bigint
}

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


export const getGrant = async (grantId: string): Promise<Grant> => {
    let publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
    })

    const contract = getContract({
        address: getAddress(singleManagerAddress),
        abi: simpleGrantManagerAbi,
        client: publicClient,
    })

    const [grant, bond, minBond] = await Promise.all([
        contract.read.getGrant([grantId as Hex]) as Promise<any>,
        contract.read.getGrantQuestionBond([grantId as Hex]),
        contract.read.getGrantQuestionMinBond([grantId as Hex])
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
        minBond: minBond
    }

}

export const getGrantBestAnswer = async (grantId: string) => {
    let publicClient = createPublicClient({
        chain: sepolia,
        transport: http(),
    })

    const contract = getContract({
        address: getAddress(singleManagerAddress),
        abi: simpleGrantManagerAbi,
        client: publicClient,
    })


    const answer = await contract.read.getGrantQuestionBestAnswer([grantId as Hex])


    if (answer == "0x0000000000000000000000000000000000000000000000000000000000000000") return "No"

    return "Yes"


}



