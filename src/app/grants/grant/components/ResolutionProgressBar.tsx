'use client'

interface ResolutionProgressBarProps {
  grantId: string
  creationDate?: string
  openingTime?: string
  resolved?: boolean
}

export default function ResolutionProgressBar({
  grantId,
  creationDate,
  openingTime,
  resolved,
}: ResolutionProgressBarProps) {
  // Determine current step based on grant status
  const now = new Date()
  const openingTimeDate = openingTime ? new Date(Number(openingTime)) : null
  const creationDateDate = creationDate ? new Date(Number(creationDate)) : null
  const isOpeningTimePassed = openingTimeDate ? openingTimeDate < now : false

  const steps = [
    {
      id: 'created',
      title: 'Grant Created',
      subtitle: creationDateDate ? creationDateDate.toLocaleDateString() : 'Pending',
      status: 'completed', // Always completed if we're viewing it
    },
    {
      id: 'funded',
      title: 'Deliverables Pending',
      subtitle: undefined,
      status: 'completed',
    },
    {
      id: 'open',
      title: 'Resolution Opening',
      subtitle: openingTimeDate ? openingTimeDate.toLocaleDateString() : 'Pending',
      status: isOpeningTimePassed ? 'completed' : 'pending',
    },
    {
      id: 'resolution',
      title: 'Resolution Pending',
      subtitle: undefined,
      status: isOpeningTimePassed && !resolved ? 'active' : resolved ? 'completed' : 'pending',
    },
    {
      id: 'resolved',
      title: 'Grant Resolved',
      subtitle: openingTimeDate ? openingTimeDate.toLocaleDateString() : 'Pending',
      status: resolved ? 'completed' : 'pending',
    },
  ]

  return (
    <div className="h-full w-full rounded-xl bg-[#17181C] px-[34px] py-[32px]">
      <div className="mb-6">
        <h3 className="text-[24px] font-bold text-[#F0F2FB] mb-2">Resolution Progress</h3>
      </div>

      {/* Horizontal progress steps */}
      <div className="relative mb-8">
        {/* Horizontal connector line background */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#30333C]" />

        {/* Progress line overlay */}
        <div
          className="absolute top-4 left-4 h-0.5 bg-[#01EB5A] transition-all duration-500 ease-out"
          style={{
            width: `calc(${
              (steps.filter((s) => s.status === 'completed').length / steps.length) * 100
            }% - 2rem)`,
          }}
        />

        {/* Steps */}
        <div className="flex justify-between items-start">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center text-center max-w-[140px]">
              {/* Status indicator */}
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 relative z-10 ${
                  step.status === 'completed'
                    ? 'bg-[#01EB5A] border-[#01EB5A] text-[#17181C]'
                    : step.status === 'active'
                      ? 'bg-[#17181C] border-[#01EB5A] text-[#01EB5A]'
                      : 'bg-[#2C2F3A] border-[#30333C] text-[#80838f]'
                }`}>
                {step.status === 'completed' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Step details */}
              <div className="mt-3">
                <h4
                  className={`text-sm font-semibold transition-colors duration-300 leading-tight ${
                    step.status === 'completed' || step.status === 'active'
                      ? 'text-[#F0F2FB]'
                      : 'text-[#80838f]'
                  }`}>
                  {step.title}
                </h4>
                <p
                  className={`text-xs mt-1 transition-colors duration-300 leading-tight ${
                    step.status === 'active' ? 'text-[#01EB5A]' : 'text-[#80838f]'
                  }`}>
                  {step.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
