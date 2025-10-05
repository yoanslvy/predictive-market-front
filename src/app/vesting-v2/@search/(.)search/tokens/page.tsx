import * as z from 'zod'

import TokenTable from '../_modules/tokenTable'

export const maxDuration = 300

const searchParamsSchema = z.object({
  sgquery: z.string().optional(),
  sgpage: z.coerce.number().optional().default(1),
  sgchain: z.coerce.number().optional(),
})

type Props = {
  searchParams: z.infer<typeof searchParamsSchema>
}

export default function PhotoModal({ searchParams }: Props) {
  const parsedParams = searchParamsSchema.safeParse(searchParams)

  if (!parsedParams.success) {
    return <div>Invalid parameters</div>
  }

  const { sgquery, sgpage, sgchain } = parsedParams.data

  return <TokenTable page={sgpage} filter={sgquery} chainFilter={sgchain} />
}
