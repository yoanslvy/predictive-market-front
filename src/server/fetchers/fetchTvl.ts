export const fetchTvl = async () => {
  const result = await fetch('https://api.llama.fi/tvl/uncx-network', {
    next: { revalidate: 120 },
  })

  // error handle
  if (!result.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch Defi Llama TVL data')
  }

  return result.json()
}
