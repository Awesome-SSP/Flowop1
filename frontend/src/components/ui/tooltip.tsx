import { Tooltip as ChakraTooltip } from "@chakra-ui/react"
import * as React from "react"

export interface TooltipProps {
    children: React.ReactNode
    label: string
    placement?: "top" | "bottom" | "left" | "right"
}

export function Tooltip({ children, label, placement = "top" }: TooltipProps) {
    return (
        <ChakraTooltip label={label} placement={placement}>
            {children}
        </ChakraTooltip>
    )
}
