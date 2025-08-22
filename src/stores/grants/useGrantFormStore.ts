import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { parseUnits, isAddress } from 'viem'

interface StringValue {
    value: string
    message: string
    isDisabled?: boolean
}

interface GrantFormData {
    question: StringValue
    collateralToken: StringValue
    amount: StringValue
    recipient: StringValue
    deadline: StringValue
    minBond: StringValue
    hasAcceptedTerms: boolean
}

interface GrantFormState {
    grantFormData: GrantFormData
    updateForm: (payload: { name: string; input: string; tokenDecimals?: number; tokenBalance?: bigint }) => void
    updateBooleans: (payload: { hasAcceptedTerms?: boolean }) => void
    clearForm: () => void
    isFormValid: () => boolean
}

const InitValue: StringValue = {
    value: '',
    message: '',
    isDisabled: false
}

const createInitialState = (): GrantFormData => ({
    question: { ...InitValue },
    collateralToken: { ...InitValue },
    amount: { ...InitValue },
    recipient: { ...InitValue },
    deadline: { ...InitValue },
    minBond: { ...InitValue },
    hasAcceptedTerms: false
})

export const useGrantFormStore = create<GrantFormState>()(
    immer((set, get) => ({
        grantFormData: createInitialState(),

        updateForm: (payload) =>
            set((state) => {
                const { name, input, tokenDecimals = 18, tokenBalance } = payload
                let sanitisedInput = input

                switch (name) {
                    case 'question':
                        state.grantFormData.question.value = input
                        state.grantFormData.question.message =
                            input.length === 0 ? 'Question is required' :
                                input.length < 10 ? 'Question must be at least 10 characters' :
                                    input.length > 500 ? 'Question must be less than 500 characters' : ''
                        break

                    case 'collateralToken':
                        state.grantFormData.collateralToken.value = input
                        state.grantFormData.collateralToken.message =
                            input.length === 0 ? 'Token address is required' :
                                !isAddress(input) ? 'Invalid token address' : ''
                        break

                    case 'amount':
                        sanitisedInput = input.replace(/[^\d.-]/g, '')
                        const decimalsCount = sanitisedInput.includes('.') ? sanitisedInput.split('.').pop()!.length : 0

                        state.grantFormData.amount.value = sanitisedInput === '00' ? '0' : sanitisedInput
                        state.grantFormData.amount.message =
                            sanitisedInput.length === 0 ? 'Amount is required' :
                                sanitisedInput === '0' || sanitisedInput === '0.' ? 'Amount must be greater than 0' :
                                    sanitisedInput.split('.').length - 1 > 1 ? 'Invalid decimal format' :
                                        decimalsCount > tokenDecimals ? `Too many decimal places (max ${tokenDecimals})` :
                                            tokenBalance && parseUnits(sanitisedInput, tokenDecimals) > tokenBalance ? 'Amount exceeds balance' : ''
                        break

                    case 'recipient':
                        state.grantFormData.recipient.value = input
                        state.grantFormData.recipient.message =
                            input.length === 0 ? 'Recipient address is required' :
                                !isAddress(input) ? 'Invalid recipient address' : ''
                        break

                    case 'deadline':
                        const deadlineTimestamp = parseInt(input)
                        const now = Math.floor(Date.now() / 1000)

                        state.grantFormData.deadline.value = input
                        state.grantFormData.deadline.message =
                            input.length === 0 ? 'Deadline is required' :
                                isNaN(deadlineTimestamp) ? 'Invalid timestamp' :
                                    deadlineTimestamp <= now ? 'Deadline must be in the future' : ''
                        break

                    case 'minBond':
                        sanitisedInput = input.replace(/[^\d.-]/g, '')

                        state.grantFormData.minBond.value = sanitisedInput === '00' ? '0' : sanitisedInput
                        state.grantFormData.minBond.message =
                            sanitisedInput.length === 0 ? 'Minimum bond is required' :
                                sanitisedInput === '0' || sanitisedInput === '0.' ? 'Minimum bond must be greater than 0' :
                                    sanitisedInput.split('.').length - 1 > 1 ? 'Invalid decimal format' : ''
                        break

                    default:
                        break
                }
            }),

        updateBooleans: (payload) =>
            set((state) => {
                if (payload.hasAcceptedTerms !== undefined) {
                    state.grantFormData.hasAcceptedTerms = payload.hasAcceptedTerms
                }
            }),

        clearForm: () =>
            set((state) => {
                state.grantFormData = createInitialState()
            }),

        isFormValid: () => {
            const { grantFormData } = get()
            return (
                grantFormData.question.value.length > 0 &&
                grantFormData.question.message === '' &&
                grantFormData.collateralToken.value.length > 0 &&
                grantFormData.collateralToken.message === '' &&
                grantFormData.amount.value.length > 0 &&
                grantFormData.amount.message === '' &&
                grantFormData.recipient.value.length > 0 &&
                grantFormData.recipient.message === '' &&
                grantFormData.deadline.value.length > 0 &&
                grantFormData.deadline.message === '' &&
                grantFormData.minBond.value.length > 0 &&
                grantFormData.minBond.message === '' &&
                grantFormData.hasAcceptedTerms
            )
        }
    }))
) 