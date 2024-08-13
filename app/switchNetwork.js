import { ethers } from 'ethers';
import configFile from "./networks.json";

const config = configFile;
console.log(config)

const sepolia = {
  chainId: '0xaa36a7',
  rpcUrls: ['https://rpc.sepolia.org'],
  chainName: 'Sepolia Testnet',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18
  },
  blockExplorerUrls: ['https://sepolia.etherscan.io']
}

// const sepolia = {
//   chainId: '0x7a69',
//   rpcUrls: ['https://localhost:8545'],
//   chainName: 'localhost',
//   nativeCurrency: {
//     name: 'DummyETH',
//     symbol: 'ETH',
//     decimals: 18
//   },
//   blockExplorerUrls: ['https://cartesiscan.io']
// }

const switchNetwork = async (wallet) => {
  if (wallet && wallet.provider) {
    const provider = new ethers.providers.Web3Provider(wallet.provider)
    const network = await provider.getNetwork()

    if (network.chainId !== parseInt(sepolia.chainId)) { // Sepolia's chain ID in decimal
      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: sepolia.chainId }])
      } catch (error) {
        console.error('Failed to switch network:', error)
        if (error.code === 4902) {
          try {
            await provider.send('wallet_addEthereumChain', [
              sepolia
            ])
          } catch (addError) {
            console.error('Failed to add and switch to Sepolia:', addError)
            // Optionally provide user feedback or instructions here
          }
        } else {
          // Handle other possible errors, such as user rejection
          console.error('Other error occurred:', error.message)
        }
      }
    }
  }
}

export {
  switchNetwork
}