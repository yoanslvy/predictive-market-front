import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface StringValue {
    value: string
    message: string
    isDisabled?: boolean
}

interface SubmitAnswerData {
    grantId: StringValue
    answer: StringValue
    maxPrevious: StringValue
    bondAmount: StringValue
    hasAcceptedTerms: boolean
}

interface SubmitAnswerState {
    SubmitAnswerData: SubmitAnswerData
    updateForm: (payload: { name: string; input: string }) => void
    updateBooleans: (payload: { hasAcceptedTerms?: boolean }) => void
    clearForm: () => void
    isFormValid: () => boolean
}

const InitValue: StringValue = {
    value: '',
    message: '',
    isDisabled: false
}

const createInitialState = (): SubmitAnswerData => ({
    grantId: { ...InitValue },
    answer: { ...InitValue },
    maxPrevious: { ...InitValue },
    bondAmount: { ...InitValue },
    hasAcceptedTerms: false
})

export const useSubmitAnswerStore = create<SubmitAnswerState>()(
    immer((set, get) => ({
        SubmitAnswerData: createInitialState(),

        updateForm: (payload) =>
            set((state) => {
                const { name, input } = payload
                let sanitisedInput = input

                switch (name) {
                    case 'grantId':
                        state.SubmitAnswerData.grantId.value = input
                        state.SubmitAnswerData.grantId.message =
                            input.length === 0 ? 'Grant ID is required' :
                                !/^0x[a-fA-F0-9]{64}$/.test(input) ? 'Invalid grant ID format (must be 32 bytes hex)' : ''
                        break

                    case 'answer':
                        // Answer should be 0 (No) or 1 (Yes) 
                        state.SubmitAnswerData.answer.value = input
                        state.SubmitAnswerData.answer.message =
                            input.length === 0 ? 'Answer is required' :
                                !['0', '1'].includes(input) ? 'Answer must be 0 (No) or 1 (Yes)' : ''
                        break

                    case 'maxPrevious':
                        sanitisedInput = input.replace(/[^\d.-]/g, '')

                        state.SubmitAnswerData.maxPrevious.value = sanitisedInput === '00' ? '0' : sanitisedInput
                        state.SubmitAnswerData.maxPrevious.message =
                            sanitisedInput.length === 0 ? 'Max previous is required' :
                                sanitisedInput.split('.').length - 1 > 1 ? 'Invalid decimal format' :
                                    parseFloat(sanitisedInput) < 0 ? 'Value must be non-negative' : ''
                        break

                    case 'bondAmount':
                        sanitisedInput = input.replace(/[^\d.-]/g, '')

                        state.SubmitAnswerData.bondAmount.value = sanitisedInput === '00' ? '0' : sanitisedInput
                        state.SubmitAnswerData.bondAmount.message =
                            sanitisedInput.length === 0 ? 'Bond amount is required' :
                                sanitisedInput === '0' || sanitisedInput === '0.' ? 'Bond amount must be greater than 0' :
                                    sanitisedInput.split('.').length - 1 > 1 ? 'Invalid decimal format' : ''
                        break

                    default:
                        break
                }
            }),

        updateBooleans: (payload) =>
            set((state) => {
                if (payload.hasAcceptedTerms !== undefined) {
                    state.SubmitAnswerData.hasAcceptedTerms = payload.hasAcceptedTerms
                }
            }),

        clearForm: () =>
            set((state) => {
                state.SubmitAnswerData = createInitialState()
            }),

        isFormValid: () => {
            const { SubmitAnswerData } = get()
            return (
                SubmitAnswerData.grantId.value.length > 0 &&
                SubmitAnswerData.grantId.message === '' &&
                SubmitAnswerData.answer.value.length > 0 &&
                SubmitAnswerData.answer.message === '' &&
                SubmitAnswerData.maxPrevious.value.length > 0 &&
                SubmitAnswerData.maxPrevious.message === '' &&
                SubmitAnswerData.bondAmount.value.length > 0 &&
                SubmitAnswerData.bondAmount.message === '' &&
                SubmitAnswerData.hasAcceptedTerms
            )
        }
    }))
)
