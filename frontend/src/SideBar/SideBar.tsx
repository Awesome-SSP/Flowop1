import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Link,
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
  FiDownload,
  FiFileText,
  FiTrendingUp,
} from "react-icons/fi";

type NavItem = {
  label: string;
  to?: string;
  icon: React.ElementType;
  children?: { label: string; to: string }[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: FiHome },
  { label: "Contacts", to: "/admin/contacts", icon: FiUsers },
  { label: "Reports", to: "/reports", icon: FiBarChart2 },
  { label: "Analytics", to: "/data", icon: FiTrendingUp },
  {
    label: "Documents",
    icon: FiFileText,
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

const SideBar: React.FC<SideBarProps> = ({ 
  isOpen: controlledIsOpen, 
  onOpen: controlledOnOpen, 
  onClose: controlledOnClose 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Enterprise colors: Primary blue (#2563EB), neutral grays, accents green/amber
  const bg = useColorModeValue("white", "#1F2937");
  const activeBg = useColorModeValue("#EBF8FF", "#1E40AF");
  const activeColor = "#2563EB";
  const textColor = useColorModeValue("#374151", "#F9FAFB");
  const borderColor = useColorModeValue("#E5E7EB", "#374151");
  const hoverBg = useColorModeValue("#F3F4F6", "#374151");

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
    onClose();
    navigate("/", { replace: true });
  };

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <VStack align="stretch" spacing={6} h="100%" px={4} py={6}>
      {/* Logo Section */}
      <Box mb={6}>
        <HStack spacing={3} align="center">
          <Box
            w={10}
            h={10}
            bg={activeColor}
            borderRadius="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="lg" fontWeight="bold" color="white">
              F
            </Text>
          </Box>
          <Text fontSize="xl" fontWeight="700" color={activeColor}>
            Flowops
          </Text>
        </HStack>
      </Box>

      <Divider borderColor={borderColor} />

      {/* Navigation Items */}
      <VStack spacing={2} align="stretch" flex="1">
        {navItems.map((item) =>
          item.children ? (
            <Box key={item.label}>
              <HStack
                px={4}
                py={3}
                borderRadius="xl"
                cursor="pointer"
                onClick={() => setOpen((s) => ({ ...s, [item.label]: !s[item.label] }))}
                _hover={{ bg: hoverBg }}
                align="center"
                justify="space-between"
                transition="all 0.2s"
              >
                <HStack spacing={3}>
                  <Icon as={item.icon} boxSize={5} color={activeColor} />
                  <Text fontSize="sm" color={textColor} fontWeight={600}>
                    {item.label}
                  </Text>
                </HStack>
                <IconButton
                  aria-label={`${open[item.label] ? "collapse" : "expand"} ${item.label}`}
                  icon={open[item.label] ? <FiChevronDown /> : <FiChevronRight />}
                  size="sm"
                  variant="ghost"
                  color={textColor}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen((s) => ({ ...s, [item.label]: !s[item.label] }));
                  }}
                />
              </HStack>

              <Collapse in={Boolean(open[item.label])} animateOpacity>
                <VStack align="stretch" spacing={1} mt={2} pl={8}>
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={() => onItemClick?.()}
                    >
                      {({ isActive }) => (
                        <Link
                          px={3}
                          py={2}
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          fontWeight={500}
                          color={isActive ? activeColor : textColor}
                          bg={isActive ? activeBg : "transparent"}
                          _hover={{ 
                            textDecoration: "none", 
                            bg: isActive ? activeBg : hoverBg 
                          }}
                          transition="all 0.2s"
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
              onClick={() => onItemClick?.()}
            >
              {({ isActive }) => (
                <Link
                  px={4}
                  py={3}
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  fontWeight={600}
                  color={isActive ? activeColor : textColor}
                  bg={isActive ? activeBg : "transparent"}
                  _hover={{ 
                    textDecoration: "none", 
                    bg: isActive ? activeBg : hoverBg 
                  }}
                  transition="all 0.2s"
                >
                  <Icon as={item.icon} boxSize={5} mr={3} color={activeColor} />
                  <Text fontSize="sm">{item.label}</Text>
                </Link>
              )}
            </NavLink>
          )
        )}
      </VStack>

      {/* Logout Button */}
      <Box mt="auto" pt={4}>
        <Divider borderColor={borderColor} mb={4} />
        <Button
          leftIcon={<FiLogOut />}
          onClick={handleLogout}
          variant="ghost"
          colorScheme="red"
          justifyContent="flex-start"
          w="full"
          borderRadius="xl"
          fontWeight={600}
          _hover={{ bg: "red.50" }}
        >
          Logout
        </Button>
      </Box>
    </VStack>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <IconButton
        aria-label="Open menu"
        icon={<FiMenu />}
        position="fixed"
        top={4}
        left={4}
        zIndex={60}
        display={{ base: "inline-flex", md: "none" }}
        onClick={onOpen}
        bg={bg}
        borderRadius="xl"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
        _hover={{ bg: hoverBg }}
      />

      {/* Desktop sidebar */}
      <Box
        as="aside"
        w={{ base: "0", md: "280px" }}
        display={{ base: "none", md: "block" }}
        bg={bg}
        borderRight="1px solid"
        borderColor={borderColor}
        minH="100vh"
        position="sticky"
        top="0"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.05)"
      >
        <SidebarContent />
      </Box>

      {/* Mobile drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="sm">
        <DrawerOverlay bg="blackAlpha.600" />
        <DrawerContent borderRadius="0 2xl 2xl 0" bg={bg}>
          <DrawerCloseButton />
          <DrawerBody p={0}>
            <SidebarContent onItemClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideBar;
