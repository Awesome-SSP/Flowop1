"use client"

import { ChakraProvider } from "@chakra-ui/react"

export interface ProviderProps {
  children: React.ReactNode
}

export function Provider({ children }: ProviderProps) {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  )
}
