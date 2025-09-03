import React from "react";
import { Flex, Box, useDisclosure } from "@chakra-ui/react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import NavBar from "./NavBar";

const MainLayout: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  const location = useLocation();
  const disclosure = useDisclosure();

  if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} replace />;

  return (
    <Flex minH="100vh" flexDir="column">
      {/* top navbar without hamburger */}
      <NavBar />

      <Flex flex="1" overflow="hidden">
        {/* sidebar (desktop) and mobile drawer with its own hamburger */}
        <SideBar isOpen={disclosure.isOpen} onOpen={disclosure.onOpen} onClose={disclosure.onClose} />

        {/* main content area */}
        <Box flex="1" p={{ base: 4, md: 6 }} overflowY="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default MainLayout;