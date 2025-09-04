import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

interface PremiumCardProps {
    children: React.ReactNode;
    p?: number | string;
    bg?: string;
    borderRadius?: string;
    boxShadow?: string;
    border?: string;
    _hover?: any;
    [key: string]: any;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
    children,
    p = 6,
    bg,
    borderRadius = "2xl",
    boxShadow,
    border,
    _hover,
    ...props
}) => {
    const defaultBg = useColorModeValue(
        "rgba(255,255,255,0.9)",
        "rgba(26,32,46,0.9)"
    );

    const defaultShadow = useColorModeValue(
        "0 20px 60px rgba(0,0,0,0.1), 0 8px 25px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        "0 20px 60px rgba(0,0,0,0.3), 0 8px 25px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
    );

    const defaultBorder = useColorModeValue(
        "1px solid rgba(255,255,255,0.3)",
        "1px solid rgba(255,255,255,0.1)"
    );

    return (
        <Box
            bg={bg || defaultBg}
            borderRadius={borderRadius}
            boxShadow={boxShadow || defaultShadow}
            border={border || defaultBorder}
            p={p}
            position="relative"
            overflow="hidden"
            backdropFilter="blur(20px)"
            sx={{
                WebkitBackdropFilter: "blur(20px)",
            }}
            transition="all 0.3s ease"
            _hover={{
                transform: "translateY(-2px)",
                boxShadow: useColorModeValue(
                    "0 25px 70px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.1)",
                    "0 25px 70px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.3)"
                ),
                ..._hover
            }}
            _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                bgGradient: useColorModeValue(
                    "linear(to-r, transparent, rgba(255,255,255,0.8), transparent)",
                    "linear(to-r, transparent, rgba(255,255,255,0.2), transparent)"
                ),
                zIndex: 1,
            }}
            {...props}
        >
            <Box position="relative" zIndex={2}>
                {children}
            </Box>
        </Box>
    );
};
