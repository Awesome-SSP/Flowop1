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
  const bg = useColorModeValue("white", "gray.800");
  const activeBg = useColorModeValue("purple.50", "purple.700");
  const activeColor = useColorModeValue("purple.700", "purple.200");
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
      <HStack spacing={3} align="center">
        <Avatar size="sm" name="Flowops" bg="purple.500" color="white" />
        <Text fontWeight="600" color={textColor}>
          Flowops
        </Text>
      </HStack>

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
                _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
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
                          _hover={{ textDecoration: "none", bg: useColorModeValue("gray.50", "gray.700") }}
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
                  _hover={{ textDecoration: "none", bg: useColorModeValue("gray.50", "gray.700") }}
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
      {/* mobile hamburger - fixed position, adjusted for better alignment */}
      <IconButton
        aria-label="Open menu"
        icon={<FiMenu />}
        position="fixed"
        top={0}
        left={0}
        zIndex={60}
        display={{ base: "inline-flex", md: "none" }}
        onClick={onOpen}
        bg="purple.100"  // Changed to purple.100 for both light and dark modes
        borderRadius="md"
        _hover={{ bg: "purple.200" }}  // Updated hover to a slightly darker purple
      />

      {/* desktop sidebar */}
      <Box
        as="aside"
        w={{ base: "0", md: "220px" }}
        display={{ base: "none", md: "block" }}
        bg={bg}
        borderRight="1px solid"
        borderColor={useColorModeValue("gray.100", "gray.700")}
        minH="100vh"
        p={4}
      >
        <SidebarContent />
      </Box>

      {/* mobile drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody p={4}>
            <SidebarContent onItemClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideBar;