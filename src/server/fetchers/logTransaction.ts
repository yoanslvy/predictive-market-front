
// Only use this function when UNCX makes a B2B fee
// e.g. onLock, onCollect. 
// NOT onApprove etc.
// In general if UNCX makes a fee, use this function so we can
// log user info for accounting.

const onFeeTxnSuccess = async (chainId: string, txHash: string, sender: string) => {
  return fetch('/api/transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chainId: chainId,
      txHash: txHash,
      sender: sender
    }),
  });
}

export { onFeeTxnSuccess }

