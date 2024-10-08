'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConnectWallet, useSetChain } from "@web3-onboard/react";

import {
  Box,
  Flex,
  ChakraProvider,
} from '@chakra-ui/react'
import injectedModule from "@web3-onboard/injected-wallets";
import { init } from "@web3-onboard/react";
import networkFile from "../networks.json";

const config = networkFile;
const injected = injectedModule();
init({
  wallets: [injected],
  chains: Object.entries(config).map(([k, v], i) => ({
    id: k,
    token: v.token,
    label: v.label,
    rpcUrl: v.rpcUrl,
  })),
  appMetadata: {
    name: "Joao's Playground app",
    icon: "<svg><svg/>",
    description: "Enter the world of Cartesia",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
});
let apiURL = "https://jplayground.fly.dev/graphql";

export default function Navbar() {
  const router = useRouter()


  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();

  return (
    <>
      <ChakraProvider>
        <Box 
        backgroundColor={"#232931"} 
        px={4}
        filter={"drop-shadow(0 0 0.25rem black)"}
        className='navBar'
        >
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <Box 
              className='title podk'
              cursor={"pointer"}
              onClick={() => router.push(`/`)}
            >Playground</Box>

            <div>
            {!wallet && (
              <button onClick={() => connect()}>
                {connecting ? (<Box className='title'>Connecting...</Box>) : (<Box className='title'>Connect</Box>)}
              </button>
            )}
            {wallet && (
              <div className='walletWrapper'>
                  <div className='chainBox'>
                    <label>Switch Chain</label>
                    {settingChain ? (
                      <span>Switching chain...</span>
                    ) : (
                      <select
                        className='chainPicker'
                        onChange={({ target: { value } }) => {
                          if (config[value] !== undefined) {
                            setChain({ chainId: value });
                          } else {
                            alert("No deploy on this chain");
                          }
                        }}
                        value={connectedChain?.id}
                      >
                        {chains.map(({ id, label }) => {
                          return (
                            <option key={id} value={id}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                    )}                  
                  </div>
                <button onClick={() => disconnect(wallet)}>Disconnect Wallet</button>

              </div>
            )}
          </div>
          </Flex>
        </Box>
      </ChakraProvider>
    </>
  )
}
