import React from "react";
import { Flex, Box, useColorModeValue } from "@chakra-ui/react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import NavBar from "./NavBar";

const MainLayout: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} replace />;

  return (
    <Flex
      h="100vh" // Fixed height instead of minH
      flexDir="column"
      bg={useColorModeValue(
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)"
      )}
      position="relative"
      overflow="hidden" // Prevent scrolling on main container
    >
      {/* Static Background Pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity={useColorModeValue(0.1, 0.05)}
        bgImage={`radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`}
      />

      {/* Fixed Height Navbar */}
      <Box
        position="relative"
        zIndex={30}
        boxShadow="0 8px 32px rgba(0,0,0,0.1)"
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

        {/* Static Main Content */}
        <Box
          flex="1" // Take remaining space
          minW="0" // Allow shrinking if needed
          h="100%" // Full height of container
          overflow="hidden" // Prevent overflow
          position="relative"
          zIndex={10}
        >
          {/* Content Container with Fixed Dimensions */}
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
            h="100%" // Full height
            m={4} // Fixed margin
            p={6} // Fixed padding
            position="relative"
            overflow="auto" // Allow scrolling within content
            style={{
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
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
            {/* Static background pattern inside content */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              opacity={0.03}
              bgImage={`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}
            />

            {/* Static content container */}
            <Box
              position="relative"
              zIndex={2}
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
