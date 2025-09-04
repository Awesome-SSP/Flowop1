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
    <Flex minH="100vh" flexDir="column" bg={useColorModeValue("#f5f7fa", "#23272f")}> 
      {/* top navbar without hamburger */}
      <NavBar />

      <Flex flex="1" overflow="hidden">
        {/* sidebar (desktop) and mobile drawer with its own hamburger */}
        <SideBar isOpen={disclosure.isOpen} onOpen={disclosure.onOpen} onClose={disclosure.onClose} />

        {/* main content area with glassmorphism, shadow, rounded corners, and fade-in animation */}
        <Box
          flex="1"
          p={{ base: 6, md: 10 }}
          overflowY="auto"
          bg={useColorModeValue("rgba(255,255,255,0.85)", "rgba(36,39,54,0.85)")}
          borderRadius={{ base: "xl", md: "2xl" }}
          boxShadow="0 8px 32px rgba(30,64,175,0.10)"
          m={{ base: 2, md: 6 }}
          style={{ backdropFilter: "blur(12px)", transition: "box-shadow 0.3s, background 0.3s" }}
          minH="80vh"
          opacity={1}
          animation="fadeIn 0.7s"
          sx={{
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(16px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default MainLayout;