import React from "react";
import { Flex, Box, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import NavBar from "./NavBar";

const MainLayout: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem("token");
    const location = useLocation();
    const disclosure = useDisclosure();

    if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} replace />;

    return (
        <Flex
            minH="100vh"
            flexDir="column"
            bg={useColorModeValue(
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)"
            )}
            position="relative"
            overflow="hidden"
        >
            {/* Animated Background Pattern */}
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                opacity={useColorModeValue(0.1, 0.05)}
                bgImage={`radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`}
                animation="float 20s ease-in-out infinite"
                sx={{
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                        '33%': { transform: 'translateY(-10px) rotate(1deg)' },
                        '66%': { transform: 'translateY(5px) rotate(-1deg)' },
                    },
                }}
            />

            {/* Navbar with enhanced styling */}
            <Box
                position="relative"
                zIndex={30}
                boxShadow="0 8px 32px rgba(0,0,0,0.1)"
                backdropFilter="blur(16px)"
            >
                <NavBar />
            </Box>

            <Flex flex="1" overflow="hidden" position="relative" zIndex={10}>
                {/* Enhanced Sidebar */}
                <SideBar isOpen={disclosure.isOpen} onOpen={disclosure.onOpen} onClose={disclosure.onClose} />

                {/* Ultra-modern main content area */}
                <Box
                    flex="1"
                    p={{ base: 4, md: 8 }}
                    overflowY="auto"
                    position="relative"
                >
                    {/* Content Container with Advanced Glassmorphism */}
                    <Box
                        bg={useColorModeValue(
                            "rgba(255,255,255,0.9)",
                            "rgba(26,26,46,0.9)"
                        )}
                        borderRadius="3xl"
                        boxShadow={useColorModeValue(
                            "0 20px 60px rgba(0,0,0,0.1), 0 8px 25px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
                            "0 20px 60px rgba(0,0,0,0.3), 0 8px 25px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
                        )}
                        border="1px solid"
                        borderColor={useColorModeValue("rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)")}
                        minH="calc(100vh - 140px)"
                        p={{ base: 6, md: 8 }}
                        position="relative"
                        overflow="hidden"
                        style={{
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                        }}
                        animation="slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                        sx={{
                            '@keyframes slideInUp': {
                                from: {
                                    opacity: 0,
                                    transform: 'translateY(30px) scale(0.98)',
                                },
                                to: {
                                    opacity: 1,
                                    transform: 'translateY(0) scale(1)',
                                },
                            },
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
                    >
                        {/* Subtle animated background pattern inside content */}
                        <Box
                            position="absolute"
                            top="0"
                            left="0"
                            right="0"
                            bottom="0"
                            opacity={0.03}
                            bgImage={`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}
                            animation="patternMove 30s linear infinite"
                            sx={{
                                '@keyframes patternMove': {
                                    from: { transform: 'translateX(0) translateY(0)' },
                                    to: { transform: 'translateX(60px) translateY(60px)' },
                                },
                            }}
                        />

                        {/* Content with stagger animation */}
                        <Box
                            position="relative"
                            zIndex={2}
                            animation="contentFadeIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s both"
                            sx={{
                                '@keyframes contentFadeIn': {
                                    from: {
                                        opacity: 0,
                                        transform: 'translateY(20px)',
                                    },
                                    to: {
                                        opacity: 1,
                                        transform: 'translateY(0)',
                                    },
                                },
                            }}
                        >
                            <Outlet />
                        </Box>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
};

export default MainLayout;
