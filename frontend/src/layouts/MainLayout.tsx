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
        "repeating-linear-gradient(45deg, #ff00ff 0px, #ffff00 10px, #00ff00 20px, #ff0000 30px, #00ffff 40px)", 
        "repeating-conic-gradient(from 0deg at 50% 50%, #ff1493 0deg, #9acd32 72deg, #ff4500 144deg, #8a2be2 216deg, #dc143c 288deg)"
      )}
      position="relative"
      animation="rainbow-spin 3s linear infinite, shake 0.5s ease-in-out infinite alternate"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: useColorModeValue(
          "radial-gradient(circle at 20% 80%, rgba(255, 0, 255, 0.8) 0%, transparent 30%), radial-gradient(circle at 80% 20%, rgba(255, 255, 0, 0.7) 0%, transparent 40%), radial-gradient(circle at 40% 40%, rgba(0, 255, 0, 0.6) 0%, transparent 35%)",
          "radial-gradient(circle at 30% 70%, rgba(255, 20, 147, 0.9) 0%, transparent 25%), radial-gradient(circle at 70% 30%, rgba(255, 69, 0, 0.8) 0%, transparent 30%), radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.7) 0%, transparent 40%)"
        ),
        zIndex: 0,
        animation: "pulse 1s ease-in-out infinite alternate"
      }}
      sx={{
        '@keyframes rainbow-spin': {
          '0%': { filter: 'hue-rotate(0deg) contrast(150%) saturate(200%)' },
          '25%': { filter: 'hue-rotate(90deg) contrast(200%) saturate(300%)' },
          '50%': { filter: 'hue-rotate(180deg) contrast(150%) saturate(200%)' },
          '75%': { filter: 'hue-rotate(270deg) contrast(200%) saturate(300%)' },
          '100%': { filter: 'hue-rotate(360deg) contrast(150%) saturate(200%)' },
        },
        '@keyframes shake': {
          '0%': { transform: 'translateX(0px)' },
          '100%': { transform: 'translateX(2px)' },
        },
        '@keyframes pulse': {
          '0%': { opacity: 0.8 },
          '100%': { opacity: 1 },
        },
      }}
    > 
      {/* top navbar without hamburger */}
      <Box position="relative" zIndex={10}>
        <NavBar />
      </Box>

      <Flex flex="1" overflow="hidden" position="relative" zIndex={1}>
        {/* sidebar (desktop) and mobile drawer with its own hamburger */}
        <SideBar isOpen={disclosure.isOpen} onOpen={disclosure.onOpen} onClose={disclosure.onClose} />

        {/* main content area with UGLY glassmorphism */}
        <Box
          flex="1"
          p={{ base: 6, md: 12 }}
          overflowY="auto"
          bg={useColorModeValue(
            "rgba(255, 0, 255, 0.8)", 
            "rgba(0, 255, 0, 0.9)"
          )}
          border="5px dashed #ff0000"
          borderRadius="0px"
          boxShadow="inset 0 0 50px rgba(255, 255, 0, 0.9), 0 0 100px rgba(255, 0, 255, 0.8), 0 0 200px rgba(0, 255, 255, 0.7)"
          m={{ base: 3, md: 8 }}
          style={{ 
            backdropFilter: "blur(1px) saturate(500%) contrast(200%)",
            transition: "all 0.1s linear",
            background: useColorModeValue(
              "repeating-linear-gradient(90deg, rgba(255, 0, 0, 0.8) 0%, rgba(0, 255, 0, 0.8) 25%, rgba(0, 0, 255, 0.8) 50%, rgba(255, 255, 0, 0.8) 75%)",
              "repeating-radial-gradient(circle, rgba(255, 20, 147, 0.9) 0%, rgba(255, 69, 0, 0.8) 50%, rgba(138, 43, 226, 0.7) 100%)"
            ),
            fontFamily: "Comic Sans MS, cursive",
            textShadow: "0 0 10px #ff00ff, 0 0 20px #00ffff, 0 0 30px #ffff00",
          }}
          minH="85vh"
          opacity={1}
          animation="uglyPulse 0.3s ease-in-out infinite alternate, uglyRotate 2s linear infinite"
          _hover={{
            boxShadow: "inset 0 0 100px rgba(255, 0, 0, 1), 0 0 200px rgba(255, 255, 0, 1), 0 0 300px rgba(255, 0, 255, 1)",
            transform: "translateY(-10px) rotateX(15deg) skewY(5deg)",
            filter: "brightness(200%) contrast(300%) saturate(400%)",
          }}
          sx={{
            '@keyframes uglyPulse': {
              '0%': { 
                backgroundColor: 'rgba(255, 0, 255, 0.8)',
                borderColor: '#ff0000',
              },
              '50%': {
                backgroundColor: 'rgba(0, 255, 0, 0.8)',
                borderColor: '#ffff00',
              },
              '100%': { 
                backgroundColor: 'rgba(255, 69, 0, 0.8)',
                borderColor: '#00ffff',
              },
            },
            '@keyframes uglyRotate': {
              '0%': { 
                filter: 'hue-rotate(0deg) brightness(150%)',
              },
              '100%': { 
                filter: 'hue-rotate(360deg) brightness(150%)',
              },
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