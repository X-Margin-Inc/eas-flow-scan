
type EASChainConfig = {
    chainId: number;
    chainName: string;
    version: string;
    contractAddress: string;
    schemaRegistryAddress: string;
    etherscanURL: string;
    /** Must contain a trailing dot (unless mainnet). */
    rpcProvider: string;
};


export const EAS_CHAIN_CONFIGS: EASChainConfig[] = [
  {
    chainId: 11155111,
    chainName: "ethereumSepolia",
    version: "0.26",
    contractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    schemaRegistryAddress: "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
    etherscanURL: "https://sepolia.etherscan.io",
    rpcProvider: `https://sepolia.infura.io/v3/`,
  }, 
  {
    chainId: 1,
    chainName: "ethereum",
    version: "0.26",
    contractAddress: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
    schemaRegistryAddress: "0xA7b39296258348C78294F95B872b282326A97BDF",
    etherscanURL: "https://etherscan.io",
    rpcProvider: `https://mainnet.infura.io/v3/`,
  },
  {
    chainId: 8453, // Base chain ID
    chainName: "base",
    version: "0.1",
    contractAddress: "0x4200000000000000000000000000000000000021", // Update with actual contract address
    schemaRegistryAddress: "0x4200000000000000000000000000000000000020", // Update with actual schema registry address
    etherscanURL: "https://basescan.org", // Update with actual etherscan URL
    rpcProvider: `https://base-mainnet.g.alchemy.com/v2/`, // Update with actual RPC provider
  },
  {
    chainId: 84532, // Base Sepolia chain ID
    chainName: "baseSepolia",
    version: "0.1",
    contractAddress: "0x4200000000000000000000000000000000000021", // Update with actual contract address
    schemaRegistryAddress: "0x4200000000000000000000000000000000000020", // Update with actual schema registry address
    etherscanURL: "https://sepolia.basescan.org", // Update with actual etherscan URL
    rpcProvider: `https://base-sepolia.g.alchemy.com/v2/`, // Update with actual RPC provider
  },
  {
    chainId: 747,
    chainName: "flowMainnet",
    version: "1.2.0",
    contractAddress: "0xaE1FE16a4A0f4d798d6868872Eb99Ae22b8c9B09",
    schemaRegistryAddress: "0x29306A367e1185BbC2a8E92A54a33c0B52350564",
    etherscanURL: "https://evm.flowscan.io",
    rpcProvider: `https://flow-mainnet.g.alchemy.com/v2/`,
  },
  {
    chainId: 545,
    chainName: "flowTestnet",
    version: "1.2.0",
    contractAddress: "0x201CB9CEe35cFe5Ac599ceFd1f84247c03b81A43",
    schemaRegistryAddress: "0x7354114050DF7cE7F062605B6632B742A9429Bdb",
    etherscanURL: "https://evm-testnet.flowscan.io",
    rpcProvider: `https://flow-testnet.g.alchemy.com/v2/`,
  }
];


export const baseURL = process.env.NODE_ENV === "development" ?
  `http://localhost:8080/api` :
  // `https://credora-network-backend.stage.credora.cloud/api/`:
  `https://credora-network-backend.stage.credora.cloud/api/`;


export const networkMap = EAS_CHAIN_CONFIGS.reduce((map, config) => {
  map[config.chainName] = config; // Store the full config for each chain
  return map;
}, {} as { [key: string]: EASChainConfig }); // Use the correct type

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString();
};


function bytes8ToString(bytes8: string): string {
  // Remove the '0x' prefix if it exists
  if (bytes8.startsWith('0x')) {
    bytes8 = bytes8.slice(2);
  }
  const buffer = Buffer.from(bytes8, 'hex');
  return buffer.toString('utf8').replace(/\0/g, '');
}

function stringToBytes8(inputString: string): string {
  let buffer = Buffer.from(inputString, 'utf8');
  let hexString = buffer.toString('hex').slice(0, 16);
  while (hexString.length < 16) {
    hexString += "00";
  }
  return '0x' + hexString;
}


// General function to convert a decimal string to a scaled BigNumber
function scaleToBigNumber(value: string) {
  if (value !== null && !isNaN(parseFloat(value))) {
      const scaledValue = BigInt(Math.floor(parseFloat(value) * 1e10));
      return scaledValue * BigInt(1e8);
  }
  return BigInt(0);
}

export { bytes8ToString, stringToBytes8, scaleToBigNumber };