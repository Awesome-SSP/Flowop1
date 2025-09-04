import React from "react";
import { Flex, Box, useColorModeValue } from "@chakra-ui/react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import NavBar from "./NavBar";
import { PremiumCard } from "../components/ui/PremiumCard";

const MainLayout: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} replace />;

  return (
    <Flex
      h="100vh"
      flexDir="column"
      bg={useColorModeValue(
        "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
        "linear-gradient(135deg, #111827 0%, #1F2937 50%, #374151 100%)"
      )}
      position="relative"
      overflow="hidden"
    >
      {/* Premium Background Effects */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity={useColorModeValue(0.15, 0.08)}
        bgImage={`radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%),
                  radial-gradient(circle at 50% 10%, rgba(99,102,241,0.3) 0%, transparent 40%),
                  radial-gradient(circle at 10% 80%, rgba(139,92,246,0.2) 0%, transparent 30%)`}
      />

      {/* Floating Orbs */}
      <Box
        position="absolute"
        top="20%"
        left="10%"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)"
        filter="blur(40px)"
        opacity={0.7}
        animation="float 6s ease-in-out infinite"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="10%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)"
        filter="blur(60px)"
        opacity={0.5}
        animation="float 8s ease-in-out infinite reverse"
      />

      {/* Fixed Height Navbar */}
      <Box
        position="relative"
        zIndex={30}
        boxShadow={useColorModeValue(
          "0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.1)",
          "0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)"
        )}
        flexShrink={0} // Prevent navbar from shrinking
        h="70px" // Fixed navbar height
      >
        <NavBar />
      </Box>

      {/* Fixed Layout Container */}
      <Flex flex="1" h="calc(100vh - 70px)" position="relative" zIndex={10}>
        {/* Fixed Width Sidebar - Always Visible */}
        <Box
          w="280px" // Fixed width - never changes
          flexShrink={0} // Never shrink
          display="block" // Always visible - no responsive hiding
          position="relative"
          zIndex={20}
        >
          <SideBar />
        </Box>

        {/* Premium Main Content */}
        <Box
          flex="1"
          minW="0"
          h="100%"
          overflowY="auto"
          position="relative"
          zIndex={10}
        >
          <PremiumCard
            h="100%"
            m={4}
            p={6}
            borderRadius="3xl"
            _hover={{
              transform: "none" // Disable hover effect for main content
            }}
          >
            <Box
              h="100%"
              overflowY="auto"
              position="relative"
              zIndex={2}
            >
              <Outlet />
            </Box>
          </PremiumCard>
        </Box>
      </Flex>
    </Flex>
  );
};

export default MainLayout;
