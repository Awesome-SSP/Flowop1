import React from "react";
import { Button, useColorModeValue } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

interface PremiumButtonProps extends ButtonProps {
    variant?: "primary" | "secondary" | "ghost" | "danger";
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
    variant = "primary",
    children,
    ...props
}) => {
    const getVariantStyles = (variant: string) => {
        switch (variant) {
            case "primary":
                return {
                    bg: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                    color: "white",
                    border: "none",
                    _hover: {
                        bg: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)"
                    },
                    _active: {
                        transform: "translateY(0px)"
                    }
                };
            case "secondary":
                return {
                    bg: useColorModeValue("white", "gray.800"),
                    color: useColorModeValue("gray.900", "white"),
                    border: "2px solid",
                    borderColor: useColorModeValue("gray.200", "gray.600"),
                    _hover: {
                        borderColor: "#6366F1",
                        transform: "translateY(-1px)",
                        boxShadow: "0 10px 25px rgba(99, 102, 241, 0.2)"
                    }
                };
            case "ghost":
                return {
                    bg: "transparent",
                    color: useColorModeValue("gray.700", "gray.300"),
                    border: "1px solid",
                    borderColor: useColorModeValue("gray.200", "gray.600"),
                    _hover: {
                        bg: useColorModeValue("gray.50", "gray.700"),
                        borderColor: "#6366F1"
                    }
                };
            case "danger":
                return {
                    bg: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                    color: "white",
                    border: "none",
                    _hover: {
                        bg: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 20px 40px rgba(239, 68, 68, 0.4)"
                    }
                };
            default:
                return {};
        }
    };

    return (
        <Button
            borderRadius="xl"
            fontWeight="600"
            transition="all 0.2s ease"
            _focus={{
                boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
            }}
            {...getVariantStyles(variant)}
            {...props}
        >
            {children}
        </Button>
    );
};
