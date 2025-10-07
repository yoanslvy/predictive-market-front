export const simpleGrantManagerAbi = [
  {
    "inputs": [
      {
        "internalType": "contract IConditionalTokens",
        "name": "_conditionalTokens",
        "type": "address"
      },
      {
        "internalType": "contract IRealityETH_v3_0",
        "name": "_realitio",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_arbitrator",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "_questionTimeout",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "_autoArbitrationThreshold",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_klerosArbitrator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_stakeholderArbitrator",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "questionId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "submitter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "answer",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "bond",
        "type": "uint256"
      }
    ],
    "name": "AnswerSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "questionId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "conditionId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "collateralToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "deadline",
        "type": "uint32"
      }
    ],
    "name": "GrantCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "provider",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "GrantRecovered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "yesTokensBurned",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "collateralReceived",
        "type": "uint256"
      }
    ],
    "name": "GrantRedeemed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "name": "GrantResolved",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "arbitrator",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "arbitratorType",
    "outputs": [
      {
        "internalType": "enum SimpleGrantManager.ArbitratorType",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "autoArbitrationThreshold",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "conditionalTokens",
    "outputs": [
      {
        "internalType": "contract IConditionalTokens",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "internalType": "contract IERC20",
        "name": "collateralToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint32",
        "name": "deadline",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "minBond",
        "type": "uint256"
      }
    ],
    "name": "createGrant",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllGrants",
    "outputs": [
      {
        "internalType": "bytes32[]",
        "name": "",
        "type": "bytes32[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "getGrant",
    "outputs": [
      {
        "components": [
          {
            "internalType": "contract IERC20",
            "name": "collateralToken",
            "type": "address"
          },
          {
            "internalType": "bytes32",
            "name": "conditionId",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "questionId",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "resolved",
            "type": "bool"
          },
          {
            "internalType": "string",
            "name": "question",
            "type": "string"
          },
          {
            "internalType": "uint32",
            "name": "deadline",
            "type": "uint32"
          }
        ],
        "internalType": "struct SimpleGrantManager.Grant",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGrantCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "getGrantQuestionBestAnswer",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "getGrantQuestionBond",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "getGrantQuestionBounty",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "getGrantQuestionFinalAnswer",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "getGrantQuestionFinalizeTS",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "getGrantQuestionInfo",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isFinalized",
        "type": "bool"
      },
      {
        "internalType": "bytes32",
        "name": "bestAnswer",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "bond",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minBond",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bounty",
        "type": "uint256"
      },
      {
        "internalType": "uint32",
        "name": "finalizeTS",
        "type": "uint32"
      },
      {
        "internalType": "uint32",
        "name": "openingTS",
        "type": "uint32"
      },
      {
        "internalType": "bool",
        "name": "isPendingArbitration",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "getGrantQuestionMinBond",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "getGrantQuestionOpeningTS",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "getGrantTokenIds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "yesTokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "noTokenId",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "grants",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "collateralToken",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "conditionId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "questionId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "resolved",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "internalType": "uint32",
        "name": "deadline",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "isGrantQuestionFinalized",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "isGrantQuestionPendingArbitration",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "klerosArbitrator",
    "outputs": [
      {
        "internalType": "contract IKlerosArbitrator",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC1155BatchReceived",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "name": "onERC1155Received",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "questionTimeout",
    "outputs": [
      {
        "internalType": "uint32",
        "name": "",
        "type": "uint32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "realitio",
    "outputs": [
      {
        "internalType": "contract IRealityETH_v3_0",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "recoverFailedGrant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "redeemGrant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      }
    ],
    "name": "resolveGrant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stakeholderArbitrator",
    "outputs": [
      {
        "internalType": "contract IStakeholderArbitrator",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "grantId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "answer",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxPrevious",
        "type": "uint256"
      }
    ],
    "name": "submitAnswer",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const