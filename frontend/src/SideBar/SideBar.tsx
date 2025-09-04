import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Link,
  Avatar,
  Divider,
  Button,
  useColorModeValue,
  Collapse,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FiHome,
  FiBarChart2,
  FiLayers,
  FiSettings,
  FiLogOut,
  FiUpload,
  FiUsers,
  FiChevronDown,
  FiChevronRight,
  FiMenu,
} from "react-icons/fi";

type NavItem = {
  label: string;
  to?: string;
  icon: React.ElementType;
  children?: { label: string; to: string }[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: FiHome },
  { label: "Reports", to: "/reports", icon: FiBarChart2 },
  { label: "Data", to: "/data", icon: FiLayers },
  {
    label: "Document Transfer",
    icon: FiUpload,
    children: [
      { label: "My Uploads", to: "/documents/uploads" },
      { label: "My Downloads", to: "/documents/downloads" },
    ],
  },
  {
    label: "Administration",
    icon: FiUsers,
    children: [
      { label: "Manage Contact", to: "/admin/contacts" },
      { label: "Manage Notice", to: "/admin/notices" },
    ],
  },
  { label: "Settings", to: "/settings", icon: FiSettings },
];

type SideBarProps = {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

const SideBar: React.FC<SideBarProps> = ({ isOpen: controlledIsOpen, onOpen: controlledOnOpen, onClose: controlledOnClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeBg = useColorModeValue("orange.200", "purple.700");  // Light mode orange, dark mode purple
  const activeColor = useColorModeValue("orange.700", "purple.200");  // Light mode orange, dark mode purple
  const textColor = useColorModeValue("gray.700", "gray.200");

  // use controlled props or fallback to internal disclosure
  const internal = useDisclosure();
  const isControlled = typeof controlledIsOpen !== "undefined" && controlledOnOpen && controlledOnClose;
  const isOpen = isControlled ? controlledIsOpen! : internal.isOpen;
  const onOpen = isControlled ? controlledOnOpen! : internal.onOpen;
  const onClose = isControlled ? controlledOnClose! : internal.onClose;

  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const next: Record<string, boolean> = {};
    navItems.forEach((item) => {
      if (item.children) {
        next[item.label] = item.children.some((c) => location.pathname.startsWith(c.to));
      }
    });
    setOpen((o) => ({ ...o, ...next }));
  }, [location.pathname]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    } catch {}
    onClose(); // close drawer if open
    navigate("/", { replace: true });
  };

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <VStack align="stretch" spacing={6} h="100%">
      {/* Removed the Flowops logo section */}
      <VStack spacing={1} align="stretch">
        {navItems.map((item) =>
          item.children ? (
            <Box key={item.label}>
              <HStack
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                onClick={() => setOpen((s) => ({ ...s, [item.label]: !s[item.label] }))}
                _hover={{ bg: useColorModeValue("orange.200", "purple.700") }}  // Light mode orange, dark mode purple
                align="center"
                justify="space-between"
              >
                <HStack>
                  <Icon as={item.icon} boxSize={5} mr={3} color={textColor} />
                  <Text fontSize="sm" color={textColor} fontWeight={500}>
                    {item.label}
                  </Text>
                </HStack>

                <IconButton
                  aria-label={`${open[item.label] ? "collapse" : "expand"} ${item.label}`}
                  icon={open[item.label] ? <FiChevronDown /> : <FiChevronRight />}
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen((s) => ({ ...s, [item.label]: !s[item.label] }));
                  }}
                />
              </HStack>

              <Collapse in={Boolean(open[item.label])} animateOpacity>
                <VStack align="stretch" spacing={0} mt={2} pl={4}>
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={() => {
                        onItemClick?.();
                      }}
                    >
                      {({ isActive }) => (
                        <Link
                          px={3}
                          py={2}
                          borderRadius="md"
                          display="flex"
                          alignItems="center"
                          fontWeight={500}
                          color={isActive ? activeColor : textColor}
                          bg={isActive ? activeBg : undefined}
                          _hover={{ textDecoration: "none", bg: useColorModeValue("orange.200", "purple.700") }}  // Light mode orange, dark mode purple
                        >
                          <Text fontSize="sm">{child.label}</Text>
                        </Link>
                      )}
                    </NavLink>
                  ))}
                </VStack>
              </Collapse>
            </Box>
          ) : (
            <NavLink
              key={item.to ?? item.label}
              to={item.to ?? "#"}
              onClick={() => {
                onItemClick?.();
              }}
            >
              {({ isActive }) => (
                <Link
                  px={3}
                  py={2}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  fontWeight={500}
                  color={isActive ? activeColor : textColor}
                  bg={isActive ? activeBg : undefined}
                  _hover={{ textDecoration: "none", bg: useColorModeValue("orange.200", "purple.700") }}  // Light mode orange, dark mode purple
                >
                  <Icon as={item.icon} boxSize={5} mr={3} />
                  <Text fontSize="sm">{item.label}</Text>
                </Link>
              )}
            </NavLink>
          )
        )}
      </VStack>

      <Box mt="auto">
        <Divider mb={4} />
        <VStack spacing={3} align="stretch">
          <Button variant="ghost" justifyContent="flex-start" leftIcon={<FiLogOut />} onClick={handleLogout}>
            Logout
          </Button>
        </VStack>
      </Box>
    </VStack>
  );

  return (
    <>
      {/* mobile hamburger - fixed position with glassmorphism */}
      <IconButton
        aria-label="Open menu"
        icon={<FiMenu />}
        position="fixed"
        top={4}
        left={4}
        zIndex={60}
        display={{ base: "inline-flex", md: "none" }}
        onClick={onOpen}
        bg={useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)")}
        borderRadius="xl"
        backdropFilter="blur(20px)"
        border="1px solid rgba(255, 255, 255, 0.2)"
        boxShadow="0 8px 32px rgba(31, 38, 135, 0.37)"
        _hover={{ 
          bg: useColorModeValue("rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.2)"),
          transform: "translateY(-2px)"
        }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      />

      {/* desktop sidebar with heroic glassmorphism */}
      <Box
        as="aside"
        w={{ base: "0", md: "280px" }}
        display={{ base: "none", md: "block" }}
        bg={useColorModeValue(
          "rgba(255, 255, 255, 0.25)", 
          "rgba(255, 255, 255, 0.08)"
        )}
        border={useColorModeValue(
          "1px solid rgba(255, 255, 255, 0.4)",
          "1px solid rgba(255, 255, 255, 0.2)"
        )}
        borderRadius="2xl"
        minH="95vh"
        m={4}
        p={6}
        boxShadow={useColorModeValue(
          "0 8px 32px rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
          "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
        )}
        style={{ 
          backdropFilter: "blur(20px) saturate(180%)",
          background: useColorModeValue(
            "linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.15) 100%)",
            "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)"
          ),
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        _hover={{
          boxShadow: useColorModeValue(
            "0 20px 60px rgba(31, 38, 135, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
            "0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
          ),
        }}
      >
        <SidebarContent />
      </Box>

      {/* mobile drawer with glassmorphism */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="sm">
        <DrawerOverlay backdropFilter="blur(10px)" />
        <DrawerContent
          bg={useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(36, 39, 54, 0.9)")}
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
        >
          <DrawerCloseButton />
          <DrawerBody p={6}>
            <SidebarContent onItemClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideBar;