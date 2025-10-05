import { produce } from 'immer'
import { create } from 'zustand'

import Cliff from '../../../_svg/emissionTypes/Cliff.svg'
import Cliff_Exponential from '../../../_svg/emissionTypes/Cliff_Exponential.svg'
import Exponential from '../../../_svg/emissionTypes/Exponential.svg'
import Linear from '../../../_svg/emissionTypes/Linear.svg'
import Monthly_Unlocks from '../../../_svg/emissionTypes/Monthly_Unlocks.svg'
import Timelock from '../../../_svg/emissionTypes/Timelock.svg'
import Unlock_Cliff from '../../../_svg/emissionTypes/Unlock_Cliff.svg'
import Unlock_In_Steps from '../../../_svg/emissionTypes/Unlock_In_Steps.svg'

export const actions = ['pending', 'success', 'error'] as const

export const emissionTypes = [
  {
    title: 'Linear Emission',
    description: 'Tokens are released continuously and evenly over the entire vesting period.',
    bottomText: 'Perfect for steady reward distribution and predictable token flow.',
    label: 'Linear',
    value: 'linear',
    svg: <Linear className="w-[300px]" />,
  },
  {
    title: 'Cliff Emission',
    description: 'All tokens are locked until a specific cliff date, then released all at once.',
    bottomText: 'Ideal for milestone-based rewards or ensuring commitment periods.',
    label: 'Cliff',
    value: 'cliff',
    svg: <Cliff className="w-[300px]" />,
  },
  {
    title: 'Unlock In Steps Emission',
    description: 'Tokens are released in equal portions at regular intervals over time.',
    bottomText: 'Great for structured quarterly or periodic token distributions.',
    label: 'Unlock In Steps',
    value: 'unlockInSteps',
    svg: <Unlock_In_Steps className="w-[300px]" />,
  },
  {
    title: 'Monthly Unlocks Emission',
    description: 'Tokens are unlocked in equal amounts every month for a set duration.',
    bottomText: 'Perfect for salary-style payments or monthly reward distributions.',
    label: 'Monthly Unlocks',
    value: 'monthlyUnlocks',
    svg: <Monthly_Unlocks className="w-[300px]" />,
  },
  {
    title: 'Timelock Emission',
    description: 'Tokens are completely locked until a specific unlock date, then fully available.',
    bottomText: 'Best for future airdrops or time-based reward releases.',
    label: 'Timelock',
    value: 'timelock',
    svg: <Timelock className="w-[300px]" />,
  },
  {
    title: 'Unlock Cliff Emission',
    description: 'Initial amount unlocks immediately, remainder vests linearly after cliff period.',
    bottomText: 'Combines immediate access with gradual long-term vesting.',
    label: 'Unlock Cliff',
    value: 'unlockCliff',
    svg: <Unlock_Cliff className="w-[300px]" />,
  },
  {
    title: 'Exponential Emission',
    description:
      'Token release rate increases exponentially over time, starting slow then accelerating.',
    bottomText: 'Rewards long-term commitment with increasing token flow over time.',
    label: 'Exponential',
    value: 'exponential',
    svg: <Exponential className="w-[300px]" />,
  },
  {
    title: 'Cliff Exponential Emission',
    description: 'Initial cliff period followed by exponentially increasing token releases.',
    bottomText: 'Combines commitment period with accelerating rewards for loyalty.',
    label: 'Cliff Exponential',
    value: 'cliffExponential',
    svg: <Cliff_Exponential className="w-[300px]" />,
  },
] as const

export type EmissionType = (typeof emissionTypes)[number]
export type EmissionTypeValue = EmissionType['value']

// Base flux type with common properties
export type BaseFlux = {
  address: string
  amount: number
  allowTopUps?: boolean
  isCompleted: boolean
}

// Specific flux types extending the base
export type LinearFlux = BaseFlux & {
  startDate: Date
  endDate: Date
}

export type UnlockCliffFlux = BaseFlux & {
  startDate: Date
  endDate: Date
  cliffDate: Date
  cliffAmount: number
  initialUnlockedAmount: number
}

export type MonthlyUnlocksFlux = BaseFlux & {
  startDate: Date
  months: number
}

export type StepsFlux = BaseFlux & {
  startDate: Date
  endDate: Date
  steps: number
}

export type ExponentialFlux = BaseFlux & {
  startDate: Date
  endDate: Date
}

export type CliffExponentialFlux = BaseFlux & {
  startDate: Date
  endDate: Date
  cliffDate: Date
  cliffAmount: number
  initialUnlockedAmount: number
}

export type CliffFlux = BaseFlux & {
  endDate: Date
  cliffDate: Date
  cliffAmount: number
}

export type TimelockFlux = BaseFlux & {
  unlockDate: Date
}

export type AnyFlux =
  | LinearFlux
  | UnlockCliffFlux
  | MonthlyUnlocksFlux
  | StepsFlux
  | ExponentialFlux
  | CliffExponentialFlux
  | CliffFlux
  | TimelockFlux

export type FluxSettings = {
  isFluxCancellable: boolean
  isFluxTransferrable: boolean
}

export type MintSettings = {
  isMintAllowed: boolean
  isMintForRecipientsAllowed: boolean
}

export type FluxCollections = {
  [K in EmissionTypeValue]: AnyFlux[]
}

type VestingStore = {
  // Emission type state
  emissionType: EmissionType
  setEmissionType: (emissionTypeValue: EmissionType) => void

  // Token info
  tokenAddress: string | null
  setTokenAddress: (tokenAddress: string) => void
  tokenSymbol: string | null
  setTokenSymbol: (tokenSymbol: string) => void
  tokenAmountUi: number | null
  setTokenAmountUi: (tokenAmountUi: number) => void
  tokenPriceUsd: number | null
  setTokenPriceUsd: (tokenPriceUsd: number) => void
  tokenLogoURI: string | null
  setTokenLogoURI: (tokenLogoURI: string) => void
  tokenDecimals: number | null
  setTokenDecimals: (tokenDecimals: number) => void

  // Media
  coverUrl: string | null
  setCoverUrl: (coverUrl: string) => void
  logoUrl: string | null
  setLogoUrl: (logoUrl: string) => void

  // Settings
  fluxSettings: FluxSettings
  setFluxSettings: (fluxSettings: FluxSettings) => void
  mintSettings: MintSettings
  setMintSettings: (mintSettings: MintSettings) => void

  // Flux collections - stored internally
  fluxCollections: FluxCollections

  // Flux utility methods
  setFluxes: <T extends AnyFlux = AnyFlux>(
    type: EmissionTypeValue,
    fluxes: T[] | ((prevFluxes: T[]) => T[])
  ) => void

  // Direct flux properties - prefer these over accessing fluxCollections for better reactivity
  // These are actual state properties, not computed getters, so components will react to changes
  fluxes: LinearFlux[]
  monthlyUnlocksFluxes: MonthlyUnlocksFlux[]
  cliffFluxes: CliffFlux[]
  timelockFluxes: TimelockFlux[]
  stepsFluxes: StepsFlux[]
  exponentialFluxes: ExponentialFlux[]
  unlockCliffFluxes: UnlockCliffFlux[]
  cliffExponentialFluxes: CliffExponentialFlux[]

  // Active and max fluxes (reactive properties)
  activeFluxes: AnyFlux[]
  updateActiveFluxes: () => void
  maxFluxes: number
  updateMaxFluxes: () => void

  // Direct flux setters - use these to update flux state
  setMonthlyUnlocksFluxes: (
    fluxes: MonthlyUnlocksFlux[] | ((prev: MonthlyUnlocksFlux[]) => MonthlyUnlocksFlux[])
  ) => void
  setLinearFluxes: (fluxes: LinearFlux[] | ((prev: LinearFlux[]) => LinearFlux[])) => void
  setCliffFluxes: (fluxes: CliffFlux[] | ((prev: CliffFlux[]) => CliffFlux[])) => void
  setTimelockFluxes: (fluxes: TimelockFlux[] | ((prev: TimelockFlux[]) => TimelockFlux[])) => void
  setStepsFluxes: (fluxes: StepsFlux[] | ((prev: StepsFlux[]) => StepsFlux[])) => void
  setExponentialFluxes: (
    fluxes: ExponentialFlux[] | ((prev: ExponentialFlux[]) => ExponentialFlux[])
  ) => void
  setUnlockCliffFluxes: (
    fluxes: UnlockCliffFlux[] | ((prev: UnlockCliffFlux[]) => UnlockCliffFlux[])
  ) => void
  setCliffExponentialFluxes: (
    fluxes: CliffExponentialFlux[] | ((prev: CliffExponentialFlux[]) => CliffExponentialFlux[])
  ) => void

  // Utility methods
  resetFluxes: () => void
}

// Initialize empty flux collections
const createEmptyFluxCollections = () => {
  const collections: Partial<FluxCollections> = {}
  emissionTypes.forEach(({ value }) => {
    collections[value] = []
  })
  return collections as FluxCollections
}

// Create the store with initial state
export const useVestingStore = create<VestingStore>()((set) => ({
  // Emission type
  emissionType: emissionTypes[0],
  setEmissionType: (emissionType: EmissionType) =>
    set(
      produce((store: VestingStore) => {
        store.emissionType = emissionType

        // Sync fluxes from collections to direct properties when type changes
        // This ensures UI components always have the latest data
        store.fluxes = (store.fluxCollections.linear || []) as LinearFlux[]
        store.monthlyUnlocksFluxes = (store.fluxCollections.monthlyUnlocks ||
          []) as MonthlyUnlocksFlux[]
        store.cliffFluxes = (store.fluxCollections.cliff || []) as CliffFlux[]
        store.timelockFluxes = (store.fluxCollections.timelock || []) as TimelockFlux[]
        store.stepsFluxes = (store.fluxCollections.unlockInSteps || []) as StepsFlux[]
        store.exponentialFluxes = (store.fluxCollections.exponential || []) as ExponentialFlux[]
        store.unlockCliffFluxes = (store.fluxCollections.unlockCliff || []) as UnlockCliffFlux[]
        store.cliffExponentialFluxes = (store.fluxCollections.cliffExponential ||
          []) as CliffExponentialFlux[]

        // Update the active fluxes based on the new emission type
        const activeType = emissionType.value
        switch (activeType) {
          case 'linear':
            store.activeFluxes = store.fluxes
            break
          case 'monthlyUnlocks':
            store.activeFluxes = store.monthlyUnlocksFluxes
            break
          case 'cliff':
            store.activeFluxes = store.cliffFluxes
            break
          case 'timelock':
            store.activeFluxes = store.timelockFluxes
            break
          case 'unlockInSteps':
            store.activeFluxes = store.stepsFluxes
            break
          case 'exponential':
            store.activeFluxes = store.exponentialFluxes
            break
          case 'unlockCliff':
            store.activeFluxes = store.unlockCliffFluxes
            break
          case 'cliffExponential':
            store.activeFluxes = store.cliffExponentialFluxes
            break
          default:
            store.activeFluxes = []
        }

        // Update max fluxes count
        store.maxFluxes = Math.max(
          store.fluxes.length,
          store.monthlyUnlocksFluxes.length,
          store.cliffFluxes.length,
          store.timelockFluxes.length,
          store.stepsFluxes.length,
          store.exponentialFluxes.length,
          store.unlockCliffFluxes.length,
          store.cliffExponentialFluxes.length,
          0 // Ensure we at least return 0 for empty collections
        )
      })
    ),

  // Token info
  tokenAddress: null,
  setTokenAddress: (tokenAddress: string) =>
    set(
      produce((store: VestingStore) => {
        store.tokenAddress = tokenAddress
      })
    ),
  tokenSymbol: null,
  setTokenSymbol: (tokenSymbol: string) =>
    set(
      produce((store: VestingStore) => {
        store.tokenSymbol = tokenSymbol
      })
    ),
  tokenAmountUi: null,
  setTokenAmountUi: (tokenAmountUi: number) =>
    set(
      produce((store: VestingStore) => {
        store.tokenAmountUi = tokenAmountUi
      })
    ),
  tokenPriceUsd: null,
  setTokenPriceUsd: (tokenPriceUsd: number) =>
    set(
      produce((store: VestingStore) => {
        store.tokenPriceUsd = tokenPriceUsd
      })
    ),
  tokenLogoURI: null,
  setTokenLogoURI: (tokenLogoURI: string) =>
    set(
      produce((store: VestingStore) => {
        store.tokenLogoURI = tokenLogoURI
      })
    ),

  tokenDecimals: null,
  setTokenDecimals: (tokenDecimals: number) =>
    set(
      produce((store: VestingStore) => {
        store.tokenDecimals = tokenDecimals
      })
    ),

  // Media
  coverUrl: null,
  setCoverUrl: (coverUrl: string) =>
    set(
      produce((store: VestingStore) => {
        store.coverUrl = coverUrl
      })
    ),
  logoUrl: null,
  setLogoUrl: (logoUrl: string) =>
    set(
      produce((store: VestingStore) => {
        store.logoUrl = logoUrl
      })
    ),

  // Settings
  fluxSettings: {
    isFluxCancellable: false,
    isFluxTransferrable: false,
  },
  setFluxSettings: (fluxSettings) =>
    set(
      produce((store: VestingStore) => {
        store.fluxSettings = fluxSettings
      })
    ),
  mintSettings: {
    isMintAllowed: true,
    isMintForRecipientsAllowed: true,
  },
  setMintSettings: (mintSettings) =>
    set(
      produce((store: VestingStore) => {
        store.mintSettings = mintSettings
      })
    ),

  // Flux collections - centralized storage
  fluxCollections: createEmptyFluxCollections(),

  // Generic flux methods

  setFluxes: <T extends AnyFlux = AnyFlux>(
    type: EmissionTypeValue,
    fluxes: T[] | ((prevFluxes: T[]) => T[])
  ) => {
    return set(
      produce((store: VestingStore) => {
        if (!store.fluxCollections[type]) {
          store.fluxCollections[type] = []
        }

        const currentFluxes = store.fluxCollections[type] as T[]

        if (typeof fluxes === 'function') {
          try {
            const updatedFluxes = fluxes(currentFluxes)
            store.fluxCollections[type] = updatedFluxes
            store.activeFluxes = updatedFluxes
          } catch (error) {
            throw error
          }
        } else {
          store.fluxCollections[type] = [...fluxes]
        }
      })
    )
  },

  fluxes: [],
  monthlyUnlocksFluxes: [],
  cliffFluxes: [],
  timelockFluxes: [],
  stepsFluxes: [],
  exponentialFluxes: [],
  unlockCliffFluxes: [],
  cliffExponentialFluxes: [],

  setLinearFluxes: (fluxes) => {
    set(
      produce((store: VestingStore) => {
        if (!store.fluxCollections.linear) {
          store.fluxCollections.linear = []
        }

        if (typeof fluxes === 'function') {
          const updatedFluxes = fluxes(store.fluxCollections.linear as LinearFlux[])
          store.fluxCollections.linear = updatedFluxes
          store.fluxes = updatedFluxes

          // Update activeFluxes if needed
          if (store.emissionType.value === 'linear') {
            store.activeFluxes = updatedFluxes
          }
        } else {
          store.fluxCollections.linear = [...fluxes]
          store.fluxes = [...fluxes]

          // Update activeFluxes if needed
          if (store.emissionType.value === 'linear') {
            store.activeFluxes = [...fluxes]
          }
        }

        // Update maxFluxes
        store.maxFluxes = Math.max(
          store.fluxes.length,
          store.monthlyUnlocksFluxes.length,
          store.cliffFluxes.length,
          store.timelockFluxes.length,
          store.stepsFluxes.length,
          store.exponentialFluxes.length,
          store.unlockCliffFluxes.length,
          store.cliffExponentialFluxes.length,
          0
        )
      })
    )
  },

  setMonthlyUnlocksFluxes: (fluxes) => {
    set(
      produce((store: VestingStore) => {
        if (!store.fluxCollections.monthlyUnlocks) {
          store.fluxCollections.monthlyUnlocks = []
        }
        if (typeof fluxes === 'function') {
          const updated = fluxes(store.fluxCollections.monthlyUnlocks as MonthlyUnlocksFlux[])
          store.fluxCollections.monthlyUnlocks = updated
          store.monthlyUnlocksFluxes = updated

          // Update activeFluxes if needed
          if (store.emissionType.value === 'monthlyUnlocks') {
            store.activeFluxes = updated
          }
        } else {
          store.fluxCollections.monthlyUnlocks = [...fluxes]
          store.monthlyUnlocksFluxes = [...fluxes]

          // Update activeFluxes if needed
          if (store.emissionType.value === 'monthlyUnlocks') {
            store.activeFluxes = [...fluxes]
          }
        }

        // Update maxFluxes
        store.maxFluxes = Math.max(
          store.fluxes.length,
          store.monthlyUnlocksFluxes.length,
          store.cliffFluxes.length,
          store.timelockFluxes.length,
          store.stepsFluxes.length,
          store.exponentialFluxes.length,
          store.unlockCliffFluxes.length,
          store.cliffExponentialFluxes.length,
          0
        )
      })
    )
  },

  setCliffFluxes: (fluxes) => {
    set(
      produce((store: VestingStore) => {
        if (!store.fluxCollections.cliff) {
          store.fluxCollections.cliff = []
        }
        if (typeof fluxes === 'function') {
          const updated = fluxes(store.fluxCollections.cliff as CliffFlux[])
          store.fluxCollections.cliff = updated
          store.cliffFluxes = updated

          // Update activeFluxes if needed
          if (store.emissionType.value === 'cliff') {
            store.activeFluxes = updated
          }
        } else {
          store.fluxCollections.cliff = [...fluxes]
          store.cliffFluxes = [...fluxes]

          // Update activeFluxes if needed
          if (store.emissionType.value === 'cliff') {
            store.activeFluxes = [...fluxes]
          }
        }

        // Update maxFluxes
        store.maxFluxes = Math.max(
          store.fluxes.length,
          store.monthlyUnlocksFluxes.length,
          store.cliffFluxes.length,
          store.timelockFluxes.length,
          store.stepsFluxes.length,
          store.exponentialFluxes.length,
          store.unlockCliffFluxes.length,
          store.cliffExponentialFluxes.length,
          0
        )
      })
    )
  },

  setTimelockFluxes: (fluxes) => {
    set(
      produce((store: VestingStore) => {
        if (!store.fluxCollections.timelock) {
          store.fluxCollections.timelock = []
        }
        if (typeof fluxes === 'function') {
          const updated = fluxes(store.fluxCollections.timelock as TimelockFlux[])
          store.fluxCollections.timelock = updated
          store.timelockFluxes = updated

          // Update activeFluxes if needed
          if (store.emissionType.value === 'timelock') {
            store.activeFluxes = updated
          }
        } else {
          store.fluxCollections.timelock = [...fluxes]
          store.timelockFluxes = [...fluxes]

          // Update activeFluxes if needed
          if (store.emissionType.value === 'timelock') {
            store.activeFluxes = [...fluxes]
          }
        }

        // Update maxFluxes
        store.maxFluxes = Math.max(
          store.fluxes.length,
          store.monthlyUnlocksFluxes.length,
          store.cliffFluxes.length,
          store.timelockFluxes.length,
          store.stepsFluxes.length,
          store.exponentialFluxes.length,
          store.unlockCliffFluxes.length,
          store.cliffExponentialFluxes.length,
          0
        )
      })
    )
  },

  setStepsFluxes: (fluxes) => {
    set(
      produce((store: VestingStore) => {
        if (!store.fluxCollections.unlockInSteps) {
          store.fluxCollections.unlockInSteps = []
        }
        if (typeof fluxes === 'function') {
          const updated = fluxes(store.fluxCollections.unlockInSteps as StepsFlux[])
          store.fluxCollections.unlockInSteps = updated
          store.stepsFluxes = updated

          // Update activeFluxes if needed
          if (store.emissionType.value === 'unlockInSteps') {
            store.activeFluxes = updated
          }
        } else {
          store.fluxCollections.unlockInSteps = [...fluxes]
          store.stepsFluxes = [...fluxes]

          // Update activeFluxes if needed
          if (store.emissionType.value === 'unlockInSteps') {
            store.activeFluxes = [...fluxes]
          }
        }

        // Update maxFluxes
        store.maxFluxes = Math.max(
          store.fluxes.length,
          store.monthlyUnlocksFluxes.length,
          store.cliffFluxes.length,
          store.timelockFluxes.length,
          store.stepsFluxes.length,
          store.exponentialFluxes.length,
          store.unlockCliffFluxes.length,
          store.cliffExponentialFluxes.length,
          0
        )
      })
    )
  },

  setExponentialFluxes: (fluxes) => {
    set(
      produce((store: VestingStore) => {
        if (!store.fluxCollections.exponential) {
          store.fluxCollections.exponential = []
        }
        if (typeof fluxes === 'function') {
          const updated = fluxes(store.fluxCollections.exponential as ExponentialFlux[])
          store.fluxCollections.exponential = updated
          store.exponentialFluxes = updated

          // Update activeFluxes if needed
          if (store.emissionType.value === 'exponential') {
            store.activeFluxes = updated
          }
        } else {
          store.fluxCollections.exponential = [...fluxes]
          store.exponentialFluxes = [...fluxes]

          // Update activeFluxes if needed
          if (store.emissionType.value === 'exponential') {
            store.activeFluxes = [...fluxes]
          }
        }

        // Update maxFluxes
        store.maxFluxes = Math.max(
          store.fluxes.length,
          store.monthlyUnlocksFluxes.length,
          store.cliffFluxes.length,
          store.timelockFluxes.length,
          store.stepsFluxes.length,
          store.exponentialFluxes.length,
          store.unlockCliffFluxes.length,
          store.cliffExponentialFluxes.length,
          0
        )
      })
    )
  },

  setUnlockCliffFluxes: (fluxes) => {
    set(
      produce((store: VestingStore) => {
        if (!store.fluxCollections.unlockCliff) {
          store.fluxCollections.unlockCliff = []
        }
        if (typeof fluxes === 'function') {
          const updated = fluxes(store.fluxCollections.unlockCliff as UnlockCliffFlux[])
          store.fluxCollections.unlockCliff = updated
          store.unlockCliffFluxes = updated

          // Update activeFluxes if needed
          if (store.emissionType.value === 'unlockCliff') {
            store.activeFluxes = updated
          }
        } else {
          store.fluxCollections.unlockCliff = [...fluxes]
          store.unlockCliffFluxes = [...fluxes]

          // Update activeFluxes if needed
          if (store.emissionType.value === 'unlockCliff') {
            store.activeFluxes = [...fluxes]
          }
        }

        // Update maxFluxes
        store.maxFluxes = Math.max(
          store.fluxes.length,
          store.monthlyUnlocksFluxes.length,
          store.cliffFluxes.length,
          store.timelockFluxes.length,
          store.stepsFluxes.length,
          store.exponentialFluxes.length,
          store.unlockCliffFluxes.length,
          store.cliffExponentialFluxes.length,
          0
        )
      })
    )
  },

  setCliffExponentialFluxes: (fluxes) => {
    set(
      produce((store: VestingStore) => {
        if (!store.fluxCollections.cliffExponential) {
          store.fluxCollections.cliffExponential = []
        }
        if (typeof fluxes === 'function') {
          const updated = fluxes(store.fluxCollections.cliffExponential as CliffExponentialFlux[])
          store.fluxCollections.cliffExponential = updated
          store.cliffExponentialFluxes = updated

          // Update activeFluxes if needed
          if (store.emissionType.value === 'cliffExponential') {
            store.activeFluxes = updated
          }
        } else {
          store.fluxCollections.cliffExponential = [...fluxes]
          store.cliffExponentialFluxes = [...fluxes]

          // Update activeFluxes if needed
          if (store.emissionType.value === 'cliffExponential') {
            store.activeFluxes = [...fluxes]
          }
        }

        // Update maxFluxes
        store.maxFluxes = Math.max(
          store.fluxes.length,
          store.monthlyUnlocksFluxes.length,
          store.cliffFluxes.length,
          store.timelockFluxes.length,
          store.stepsFluxes.length,
          store.exponentialFluxes.length,
          store.unlockCliffFluxes.length,
          store.cliffExponentialFluxes.length,
          0
        )
      })
    )
  },

  // Reset all fluxes
  resetFluxes: () =>
    set(
      produce((store: VestingStore) => {
        // Reset collections
        store.fluxCollections = createEmptyFluxCollections()

        // Reset direct properties too
        store.fluxes = []
        store.monthlyUnlocksFluxes = []
        store.cliffFluxes = []
        store.timelockFluxes = []
        store.stepsFluxes = []
        store.exponentialFluxes = []
        store.unlockCliffFluxes = []
        store.cliffExponentialFluxes = []

        // Reset derived properties
        store.activeFluxes = []
        store.maxFluxes = 0
      })
    ),

  // Active fluxes as a derived state property
  activeFluxes: [],

  // Update the derived activeFluxes whenever relevant state changes
  updateActiveFluxes: () =>
    set((state) => {
      const emissionType = state.emissionType.value
      let activeFluxes: AnyFlux[] = []

      switch (emissionType) {
        case 'linear':
          activeFluxes = state.fluxes
          break
        case 'monthlyUnlocks':
          activeFluxes = state.monthlyUnlocksFluxes
          break
        case 'cliff':
          activeFluxes = state.cliffFluxes
          break
        case 'timelock':
          activeFluxes = state.timelockFluxes
          break
        case 'unlockInSteps':
          activeFluxes = state.stepsFluxes
          break
        case 'exponential':
          activeFluxes = state.exponentialFluxes
          break
        case 'unlockCliff':
          activeFluxes = state.unlockCliffFluxes
          break
        case 'cliffExponential':
          activeFluxes = state.cliffExponentialFluxes
          break
      }

      return { activeFluxes }
    }),

  // Maximum fluxes count as a computed property
  maxFluxes: 0,

  // Update the max fluxes count
  updateMaxFluxes: () =>
    set((state) => ({
      maxFluxes: Math.max(
        state.fluxes.length,
        state.monthlyUnlocksFluxes.length,
        state.cliffFluxes.length,
        state.timelockFluxes.length,
        state.stepsFluxes.length,
        state.exponentialFluxes.length,
        state.unlockCliffFluxes.length,
        state.cliffExponentialFluxes.length,
        0 // Ensure we at least return 0 for empty collections
      ),
    })),
}))
