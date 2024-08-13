'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { Box, Button, useDisclosure, Image, ChakraProvider, Textarea } from '@chakra-ui/react'

import networkFile from "../networks.json";

const config = networkFile;

export default function Stages() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chapter = parseInt(searchParams.get('chapter')) || 0
  const step = parseInt(searchParams.get('step')) || 0
  const [metadata, setMetadata] = useState({ total_steps: 1 })

  let nextStep = step + 1
  let prevStep = step - 1
  let nextChapter = chapter


  useEffect(()  => {
    fetch(`/chapter_metadata/${chapter}.json`)
      .then(r => r.text())
      .then(text => {
        let json = JSON.parse(text)
        setMetadata(json)
      }).catch(err => {
        console.log(err)
      });

  }, [])

  return (

    <ChakraProvider>
        
      <Box
        display={"flex"}
        justifyContent={'center'}
        alignItems={'center'}
        p={4}
        height={"120px"}
        backgroundSize="cover"
        boxShadow={"inset 0 0 0 2000px rgba(0, 0, 0, 0.85)"}
        backgroundPosition={"center bottom -70%"}
        backgroundImage={`url('/images/chapters/${chapter}.webp')`}
      >
        <div className="hero-stage">
          <button className='prev-button' type="button" onClick={() => {
            
            if (prevStep < 0) { 
              router.push(`/`)
            } else {
              router.push(`/play?chapter=${nextChapter}&step=${prevStep}`)
            }
          }} />

          {Array.from({ length: metadata.total_steps}, (_, i) => {
            
            if ( i === metadata.total_steps -1) {
              if (i === step) {
                return (
                  <Image key={i}
                    height={"90px"}
                    src='/images/character/walking-side.png' 
                    alt='hero' 
                  />
                )
              } else if (i < step ) {
                return (<div key={i} className="dot flex-item done"></div>)
              } else {
                return (<div key={i} className="dot flex-item"></div>)
              }
            }

            if (i === step) {
              return (
                <>
                  <Image key={i}
                    height={"90px"}
                    src='/images/character/walking-side.png' 
                    alt='hero' 
                  />
                  <div key={i} className="line"></div>
                </>
              )
              
            } else if (i < step ) {
              return (<><div key={i} className="dot flex-item done"></div><div key={i} className="line"></div></>)
            } else {
              return (<><div key={i} className="dot flex-item"></div><div key={i} className="line"></div></>)
            }
          })}

          <button className='next-button' type="button" onClick={() => {
            
            if (nextStep >= metadata.total_steps) { 
              router.push(`/`)
            } else {
              router.push(`/play?chapter=${nextChapter}&step=${nextStep}`)
            }
          }} />
            

        </div>
      </Box>
      
    </ChakraProvider>
    
  );
}
