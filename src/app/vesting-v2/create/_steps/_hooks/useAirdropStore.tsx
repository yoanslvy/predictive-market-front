import { produce } from 'immer'
import { create } from 'zustand'

import Linear from '../../../_svg/emissionTypes/Linear.svg'
import Timelock from '../../../_svg/emissionTypes/Timelock.svg'
import Unlock_In_Steps from '../../../_svg/emissionTypes/Unlock_In_Steps.svg'

export const actions = ['pending', 'success', 'error'] as const

export const emissionTypes = [
  {
    title: 'Scheduled Airdrop',
    description:
      'All tokens are distributed to recipients at a specific future date in a single transaction.',
    bottomText:
      'Ideal for event-based or time-locked airdrops where everyone receives tokens at once.',
    label: 'Scheduled',
    value: 'scheduled',
    svg: <Timelock className="w-[300px]" />,
  },
  {
    title: 'Unlock In Steps Airdrop',
    description: 'Tokens are distributed to recipients in multiple batches over a defined period.',
    bottomText: 'Great for phased airdrops, rewarding continued engagement or participation.',
    label: 'Unlock In Steps',
    value: 'unlockInSteps',
    svg: <Unlock_In_Steps className="w-[300px]" />,
  },
  {
    title: 'Linear Emission Airdrop',
    description: 'Tokens are released continuously and evenly over the entire airdrop period.',
    bottomText: 'Perfect for steady reward distribution and predictable token flow.',
    label: 'Linear',
    value: 'linear',
    svg: <Linear className="w-[300px]" />,
  },
] as const

export const distributionTypes = [
  {
    title: 'Uniform',
    bottomText: 'Assign the same token amount to all addresses.',
  },
  // {
  //   title: 'Group',
  //   bottomText: 'Choose groups and set a token amount for each group.',
  // },
  {
    title: 'Custom',
    bottomText: 'Set a unique token amount for each address.',
  },
] as const

export type EmissionType = (typeof emissionTypes)[number]
export type EmissionTypeValue = EmissionType['value']

export type DistributionType = (typeof distributionTypes)[number]

export type Recipient = {
  address: string
  amount: number
  isCompleted: boolean
}

// StepsRecipient is just an alias for Recipient to maintain type safety
export type StepsRecipient = Recipient

export type AnyRecipient = Recipient | StepsRecipient

export type FluxSettings = {
  isFluxCancellable: boolean
  isFluxTransferrable: boolean
}

export type MintSettings = {
  isMintAllowed: boolean
  isMintForRecipientsAllowed: boolean
}

export type RecipientCollections = {
  [K in EmissionTypeValue]: AnyRecipient[]
}

type AirdropStore = {
  // Emission type state
  emissionType: EmissionType
  setEmissionType: (emissionTypeValue: EmissionType) => void

  // Distribution type state
  distributionType: DistributionType
  setDistributionType: (distributionTypeValue: DistributionType) => void

  // Token info
  tokenAddress: string | null
  setTokenAddress: (tokenAddress: string) => void
  tokenSymbol: string | null
  setTokenSymbol: (tokenSymbol: string) => void
  tokenAmountUi: number | null
  setTokenAmountUi: (tokenAmountUi: number | null) => void
  tokenPriceUsd: number | null
  setTokenPriceUsd: (tokenPriceUsd: number) => void
  tokenLogoURI: string | null
  setTokenLogoURI: (tokenLogoURI: string) => void
  tokenDecimals: number | null
  setTokenDecimals: (tokenDecimals: number) => void

  // Airdrop specific
  airdropTokenAmountUi: number | null
  setAirdropTokenAmountUi: (tokenAmountUi: number | null) => void

  // Media
  coverUrl: string | null
  setCoverUrl: (coverUrl: string) => void
  logoUrl: string | null
  setLogoUrl: (logoUrl: string) => void

  // Dates
  startDate: Date | null
  setStartDate: (startDate: Date | null) => void
  endDate: Date | null
  setEndDate: (endDate: Date | null) => void

  // Steps
  steps: number | null
  setSteps: (steps: number | null | ((prevSteps: number | null) => number | null)) => void

  // Settings
  fluxSettings: FluxSettings
  setFluxSettings: (fluxSettings: FluxSettings) => void
  mintSettings: MintSettings
  setMintSettings: (mintSettings: MintSettings) => void

  // Recipient collections - stored internally
  recipientCollections: RecipientCollections

  // Recipient utility methods
  setRecipients: <T extends AnyRecipient = AnyRecipient>(
    type: EmissionTypeValue,
    recipients: T[] | ((prevRecipients: T[]) => T[])
  ) => void

  // Direct recipient properties
  recipients: Recipient[]
  stepsRecipients: StepsRecipient[]
  linearRecipients: Recipient[]

  // Active and max recipients (reactive properties)
  activeRecipients: AnyRecipient[]
  updateActiveRecipients: () => void
  maxRecipients: number
  updateMaxRecipients: () => void

  // Direct recipient setters
  setScheduledRecipients: (recipients: Recipient[] | ((prev: Recipient[]) => Recipient[])) => void
  setStepsRecipients: (
    recipients: StepsRecipient[] | ((prev: StepsRecipient[]) => StepsRecipient[])
  ) => void
  setLinearRecipients: (recipients: Recipient[] | ((prev: Recipient[]) => Recipient[])) => void

  // Legacy methods - maintained for backward compatibility
  addRecipients: (recipients: Recipient[]) => void

  // Utility methods
  resetFluxes: () => void
}

// Initialize empty recipient collections
const createEmptyRecipientCollections = () => {
  const collections: Partial<RecipientCollections> = {}
  emissionTypes.forEach(({ value }) => {
    collections[value] = []
  })
  return collections as RecipientCollections
}

// Create the store with initial state
export const useAirdropStore = create<AirdropStore>()((set) => ({
  // Emission type
  emissionType: emissionTypes[0],
  setEmissionType: (emissionType: EmissionType) => {
    set(
      produce((store: AirdropStore) => {
        store.emissionType = emissionType

        // Sync recipients from collections to direct properties when type changes
        store.recipients = (store.recipientCollections.scheduled || []) as Recipient[]
        store.stepsRecipients = (store.recipientCollections.unlockInSteps || []) as StepsRecipient[]
        store.linearRecipients = (store.recipientCollections.linear || []) as Recipient[]
        // Update the active recipients
        const activeType = emissionType.value
        if (activeType === 'scheduled') {
          store.activeRecipients = store.recipients
        } else if (activeType === 'unlockInSteps') {
          store.activeRecipients = store.stepsRecipients
        } else if (activeType === 'linear') {
          store.activeRecipients = store.linearRecipients
        } else {
          store.activeRecipients = []
        }
      })
    )
  },

  // Distribution type
  distributionType: distributionTypes[0],
  setDistributionType: (distributionType: DistributionType) =>
    set(
      produce((store: AirdropStore) => {
        store.distributionType = distributionType
      })
    ),

  // Token info
  tokenSymbol: null,
  setTokenSymbol: (tokenSymbol: string) =>
    set(
      produce((store: AirdropStore) => {
        store.tokenSymbol = tokenSymbol
      })
    ),
  tokenAmountUi: null,
  setTokenAmountUi: (tokenAmountUi: number | null) =>
    set(
      produce((store: AirdropStore) => {
        store.tokenAmountUi = tokenAmountUi
      })
    ),
  tokenPriceUsd: null,
  setTokenPriceUsd: (tokenPriceUsd: number) =>
    set(
      produce((store: AirdropStore) => {
        store.tokenPriceUsd = tokenPriceUsd
      })
    ),
  tokenLogoURI: null,
  setTokenLogoURI: (tokenLogoURI: string) =>
    set(
      produce((store: AirdropStore) => {
        store.tokenLogoURI = tokenLogoURI
      })
    ),
  tokenAddress: null,
  setTokenAddress: (tokenAddress: string) =>
    set(
      produce((store: AirdropStore) => {
        store.tokenAddress = tokenAddress
      })
    ),

  // Token decimals
  tokenDecimals: null,
  setTokenDecimals: (tokenDecimals: number) =>
    set(
      produce((store: AirdropStore) => {
        store.tokenDecimals = tokenDecimals
      })
    ),

  // Airdrop specific
  airdropTokenAmountUi: null,
  setAirdropTokenAmountUi: (airdropTokenAmountUi: number | null) =>
    set(
      produce((store: AirdropStore) => {
        store.airdropTokenAmountUi = airdropTokenAmountUi
      })
    ),

  // Media
  coverUrl: null,
  setCoverUrl: (coverUrl: string) =>
    set(
      produce((store: AirdropStore) => {
        store.coverUrl = coverUrl
      })
    ),
  logoUrl: null,
  setLogoUrl: (logoUrl: string) =>
    set(
      produce((store: AirdropStore) => {
        store.logoUrl = logoUrl
      })
    ),

  // Dates
  startDate: null,
  setStartDate: (startDate: Date | null) =>
    set(
      produce((store: AirdropStore) => {
        store.startDate = startDate
      })
    ),
  endDate: null,
  setEndDate: (endDate: Date | null) =>
    set(
      produce((store: AirdropStore) => {
        store.endDate = endDate
      })
    ),

  // Steps
  steps: null,
  setSteps: (steps: number | null | ((prevSteps: number | null) => number | null)) =>
    set(
      produce((store: AirdropStore) => {
        store.steps = typeof steps === 'function' ? steps(store.steps) : steps
      })
    ),

  // Settings
  fluxSettings: {
    isFluxCancellable: false,
    isFluxTransferrable: false,
  },
  setFluxSettings: (fluxSettings) =>
    set(
      produce((store: AirdropStore) => {
        store.fluxSettings = fluxSettings
      })
    ),
  mintSettings: {
    isMintAllowed: true,
    isMintForRecipientsAllowed: true,
  },
  setMintSettings: (mintSettings) =>
    set(
      produce((store: AirdropStore) => {
        store.mintSettings = mintSettings
      })
    ),

  recipientCollections: createEmptyRecipientCollections(),

  setRecipients: <T extends AnyRecipient = AnyRecipient>(
    type: EmissionTypeValue,
    recipients: T[] | ((prevRecipients: T[]) => T[])
  ) => {
    return set(
      produce((store: AirdropStore) => {
        if (type === 'scheduled') {
          store.setScheduledRecipients(recipients as Recipient[])
        } else if (type === 'unlockInSteps') {
          store.setStepsRecipients(recipients as StepsRecipient[])
        } else if (type === 'linear') {
          store.setLinearRecipients(recipients as Recipient[])
        }
      })
    )
  },

  // Direct recipient properties
  recipients: [],
  stepsRecipients: [],
  linearRecipients: [],

  // Direct recipient setters
  setScheduledRecipients: (recipients) => {
    set(
      produce((store: AirdropStore) => {
        if (!store.recipientCollections.scheduled) {
          store.recipientCollections.scheduled = []
        }

        if (typeof recipients === 'function') {
          const updatedRecipients = recipients(store.recipientCollections.scheduled as Recipient[])
          store.recipientCollections.scheduled = updatedRecipients
          store.recipients = updatedRecipients

          // Update active recipients if we're in scheduled mode
          if (store.emissionType.value === 'scheduled') {
            store.activeRecipients = updatedRecipients
          }
        } else {
          store.recipientCollections.scheduled = [...recipients]
          store.recipients = [...recipients]

          // Update active recipients if we're in scheduled mode
          if (store.emissionType.value === 'scheduled') {
            store.activeRecipients = [...recipients]
          }
        }
      })
    )
  },

  setStepsRecipients: (recipients) => {
    set(
      produce((store: AirdropStore) => {
        if (!store.recipientCollections.unlockInSteps) {
          store.recipientCollections.unlockInSteps = []
        }

        if (typeof recipients === 'function') {
          const updatedRecipients = recipients(
            store.recipientCollections.unlockInSteps as StepsRecipient[]
          )
          store.recipientCollections.unlockInSteps = updatedRecipients
          store.stepsRecipients = updatedRecipients

          // Update active recipients if we're in unlockInSteps mode
          if (store.emissionType.value === 'unlockInSteps') {
            store.activeRecipients = updatedRecipients
          }
        } else {
          store.recipientCollections.unlockInSteps = [...recipients]
          store.stepsRecipients = [...recipients]

          // Update active recipients if we're in unlockInSteps mode
          if (store.emissionType.value === 'unlockInSteps') {
            store.activeRecipients = [...recipients]
          }
        }
      })
    )
  },

  setLinearRecipients: (recipients) => {
    set(
      produce((store: AirdropStore) => {
        if (!store.recipientCollections.linear) {
          store.recipientCollections.linear = []
        }

        if (typeof recipients === 'function') {
          const updatedRecipients = recipients(store.recipientCollections.linear as Recipient[])
          store.recipientCollections.linear = updatedRecipients
          store.linearRecipients = updatedRecipients
          // Update active recipients if we're in linear mode
          if (store.emissionType.value === 'linear') {
            store.activeRecipients = updatedRecipients
          }
        } else {
          store.recipientCollections.linear = [...recipients]
          store.linearRecipients = [...recipients]
          // Update active recipients if we're in linear mode
          if (store.emissionType.value === 'linear') {
            store.activeRecipients = [...recipients]
          }
        }
      })
    )
  },

  // Legacy methods - maintained for backward compatibility
  addRecipients: (newRecipients: Recipient[]) =>
    set(
      produce((store: AirdropStore) => {
        const type = store.emissionType.value
        const currentRecipients = [...(store.recipientCollections[type] || [])]
        const updatedRecipients = [...currentRecipients, ...newRecipients]
        store.recipientCollections[type] = updatedRecipients

        // Also update the direct properties
        if (type === 'scheduled') {
          store.recipients = updatedRecipients as Recipient[]
          // Update active recipients
          store.activeRecipients = updatedRecipients
        } else if (type === 'unlockInSteps') {
          store.stepsRecipients = updatedRecipients as StepsRecipient[]
          // Update active recipients
          store.activeRecipients = updatedRecipients
        } else if (type === 'linear') {
          store.linearRecipients = updatedRecipients as Recipient[]
          // Update active recipients
          store.activeRecipients = updatedRecipients
        }
      })
    ),

  // Reset all recipients
  resetFluxes: () =>
    set(
      produce((store: AirdropStore) => {
        // Reset collections
        store.recipientCollections = createEmptyRecipientCollections()

        // Reset direct properties too
        store.recipients = []
        store.stepsRecipients = []
        store.activeRecipients = []
        store.steps = null
        store.linearRecipients = []
      })
    ),

  // Active recipients as a derived state property
  activeRecipients: [],

  // Update the derived activeRecipients whenever relevant state changes
  updateActiveRecipients: () =>
    set((state) => {
      const emissionType = state.emissionType.value
      let activeRecipients: AnyRecipient[] = []

      switch (emissionType) {
        case 'scheduled':
          activeRecipients = state.recipients
          break
        case 'unlockInSteps':
          activeRecipients = state.stepsRecipients
          break
        case 'linear':
          activeRecipients = state.linearRecipients
          break
      }

      return { activeRecipients }
    }),

  // Maximum recipients count as a computed property
  maxRecipients: 0,

  // Update the max recipients count
  updateMaxRecipients: () =>
    set((state) => ({
      maxRecipients: Math.max(
        state.recipients.length,
        state.stepsRecipients.length,
        state.linearRecipients.length,
        0 // Ensure we at least return 0 for empty collections
      ),
    })),
}))
