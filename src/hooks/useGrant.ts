import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import { Address, parseUnits, erc20Abi, formatUnits } from 'viem'
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
    useReadContract
} from 'wagmi'

import { simpleGrantManagerAbi } from '@/src/app/contract/SimpleGrantManager'
import { useGrantFormStore } from '@/src/stores/grants/useGrantFormStore'

const GRANT_MANAGER_ADDRESS = '0x0Ea58737FA363Fcd31e84DA2eCa54e55F0701309' as const

export interface CreateGrantParams {
    condition: string
    collateralToken: Address
    amount: string
    recipient: Address
    openingTime?: number
    minBond?: string
}

export function useGrant() {
    const { address, isConnected } = useAccount()
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const { grantFormData, clearForm, isFormValid } = useGrantFormStore()

    // Check current allowance
    const {
        data: currentAllowance,
        refetch: refetchAllowance,
        isLoading: isAllowanceLoading
    } = useReadContract({
        address: grantFormData.collateralToken.value as Address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as Address, GRANT_MANAGER_ADDRESS],
        query: {
            enabled: !!(
                address &&
                grantFormData.collateralToken.value &&
                grantFormData.collateralToken.value.startsWith('0x')
            ),
        },
    })

    // Contract write for grant creation
    const {
        writeContract: writeGrantContract,
        data: grantHash,
        isPending: isGrantWritePending,
        error: grantWriteError,
        reset: resetGrantWrite,
    } = useWriteContract()

    // Contract write for token approval
    const {
        writeContract: writeApprovalContract,
        data: approvalHash,
        isPending: isApprovalWritePending,
        error: approvalWriteError,
        reset: resetApprovalWrite,
    } = useWriteContract()

    // Wait for grant transaction
    const {
        isLoading: isGrantConfirming,
        isSuccess: isGrantConfirmed,
        error: grantReceiptError,
    } = useWaitForTransactionReceipt({
        hash: grantHash,
    })

    // Wait for approval transaction
    const {
        isLoading: isApprovalConfirming,
        isSuccess: isApprovalConfirmed,
        error: approvalReceiptError,
    } = useWaitForTransactionReceipt({
        hash: approvalHash,
    })

    // Compute overall status
    const status: 'idle' | 'approving' | 'creating' | 'success' | 'error' =
        errorMsg ? 'error' :
            isApprovalWritePending || isApprovalConfirming ? 'approving' :
                isGrantWritePending || isGrantConfirming || isProcessing ? 'creating' :
                    isGrantConfirmed ? 'success' :
                        'idle'

    // Reset form on successful grant creation
    useEffect(() => {
        if (isGrantConfirmed) {
            clearForm()
            setIsProcessing(false)
            toast.success('Grant created successfully!')
        }
    }, [isGrantConfirmed, clearForm])

    // Refetch allowance after approval is confirmed
    useEffect(() => {
        if (isApprovalConfirmed) {
            refetchAllowance()
            toast.success('Token approval confirmed!')
        }
    }, [isApprovalConfirmed, refetchAllowance])

    // Handle errors
    useEffect(() => {
        const error = grantWriteError || grantReceiptError || approvalWriteError || approvalReceiptError
        if (error) {
            setErrorMsg(error.message || 'Transaction failed')
            setIsProcessing(false)
            toast.error(`Transaction failed: ${error.message || 'Unknown error'}`)
        }
    }, [grantWriteError, grantReceiptError, approvalWriteError, approvalReceiptError])

    // Check if approval is needed
    const needsApproval = (amount?: string): boolean => {
        if (!currentAllowance || !amount) return true

        try {
            const requiredAmount = parseUnits(amount, 18)
            return currentAllowance < requiredAmount
        } catch {
            return false
        }
    }

    // Get formatted allowance
    const getFormattedAllowance = (): string => {
        if (!currentAllowance) return '0'
        return formatUnits(currentAllowance, 18)
    }

    // Approve tokens
    const approve = async (tokenAddress?: Address, amount?: string): Promise<void> => {
        // Use form data as defaults if parameters not provided
        const finalTokenAddress = tokenAddress || grantFormData.collateralToken.value as Address
        const finalAmount = amount || grantFormData.amount.value

        if (!isConnected || !finalTokenAddress || !finalAmount) {
            throw new Error('Missing required parameters for approval')
        }

        try {
            setErrorMsg(null)
            const amountBN = parseUnits(finalAmount, 18)

            writeApprovalContract({
                address: finalTokenAddress,
                abi: erc20Abi,
                functionName: 'approve',
                args: [GRANT_MANAGER_ADDRESS, amountBN],
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            setErrorMsg(`Approval failed: ${message}`)
            throw error
        }
    }

    // Create grant (approval must be handled separately if needed)
    const createGrant = async (params?: Partial<CreateGrantParams>): Promise<void> => {
        if (!isConnected) {
            throw new Error('Wallet not connected')
        }

        try {
            setErrorMsg(null)
            setIsProcessing(true)

            // Use params or fall back to form data
            const condition = params?.condition || grantFormData.condition.value
            const collateralToken = params?.collateralToken || grantFormData.collateralToken.value as Address
            const amount = params?.amount || grantFormData.amount.value
            const recipient = params?.recipient || grantFormData.recipient.value as Address
            const openingTime = params?.openingTime ||
                (grantFormData.openingTime.value
                    ? parseInt(grantFormData.openingTime.value)
                    : Math.floor(Date.now() / 1000) + 60 * 60) // Default: 1 hour from now
            const minBond = params?.minBond || grantFormData.minBond.value || '0'

            // Validate required fields
            if (!condition) throw new Error('Condition is required')
            if (!collateralToken) throw new Error('Collateral token is required')
            if (!amount) throw new Error('Amount is required')
            if (!recipient) throw new Error('Recipient is required')

            // Create the grant
            const amountBN = parseUnits(amount, 18)
            const minBondBN = parseUnits(minBond, 18)

            writeGrantContract({
                address: GRANT_MANAGER_ADDRESS,
                abi: simpleGrantManagerAbi,
                functionName: 'createGrant',
                args: [
                    condition,
                    collateralToken,
                    amountBN,
                    recipient,
                    openingTime,
                    minBondBN,
                ],
                value: minBondBN
            })

            //clearForm()

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            setErrorMsg(`Grant creation failed: ${message}`)
            setIsProcessing(false)
            throw error
        }
    }

    // Create grant directly from form data
    const createGrantFromForm = async (): Promise<void> => {
        if (!isFormValid()) {
            throw new Error('Form validation failed')
        }

        return createGrant()
    }

    // Reset all states
    const reset = (): void => {
        resetGrantWrite()
        resetApprovalWrite()
        setErrorMsg(null)
        setIsProcessing(false)
    }

    return {
        // Actions
        createGrant,
        createGrantFromForm,
        approve,
        reset,

        // Status
        status,
        isProcessing,
        isConnected,
        needsApproval: (amount?: string) => needsApproval(amount || grantFormData.amount.value),

        // Data
        currentAllowance,
        formattedAllowance: getFormattedAllowance(),
        isAllowanceLoading,

        // Transaction hashes
        grantHash,
        approvalHash,

        // Transaction states
        isGrantWritePending,
        isGrantConfirming,
        isGrantConfirmed,
        isApprovalWritePending,
        isApprovalConfirming,
        isApprovalConfirmed,

        // Errors
        error: errorMsg,
        grantWriteError,
        grantReceiptError,
        approvalWriteError,
        approvalReceiptError,

        // Form validation
        isFormValid,
    }
}
