"use client"

import React, { useEffect } from "react"
import { useToast } from "@chakra-ui/react"

type ToastOpts = {
  title?: string
  description?: string
  status?: "info" | "warning" | "success" | "error"
  duration?: number
  isClosable?: boolean
}

let _toastFn: ((o: ToastOpts) => void) | null = null

// lightweight toaster object compatible with previous usage (toaster.show / toaster.push)
export const toaster = {
  show: (opts: ToastOpts) => {
    if (_toastFn) return _toastFn(opts)
    // fallback to console if toast system not yet mounted
    // keep shape similar to Chakra toast
    // eslint-disable-next-line no-console
    console.log("toast (fallback)", opts)
  },
  push: (opts: ToastOpts) => toaster.show(opts),
  add: (opts: ToastOpts) => toaster.show(opts),
  toast: (opts: ToastOpts) => toaster.show(opts),
}

// React component to mount once (e.g. in App root)
// It binds Chakra's useToast to the exported `toaster`
export const Toaster: React.FC = () => {
  const toast = useToast()

  useEffect(() => {
    // bind
    _toastFn = (opts: ToastOpts) => {
      toast({
        title: opts.title,
        description: opts.description,
        status: opts.status,
        duration: typeof opts.duration === "number" ? opts.duration : 4000,
        isClosable: opts.isClosable !== undefined ? opts.isClosable : true,
        position: "bottom-right",
      })
    }
    return () => {
      _toastFn = null
    }
  }, [toast])

  return null
}
