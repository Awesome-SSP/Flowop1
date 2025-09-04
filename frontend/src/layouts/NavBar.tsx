import React, { useState, useEffect } from "react";
import {
  Flex,
  Avatar,
  HStack,
  useColorModeValue,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Switch,
  FormControl,
  FormLabel,
  Tooltip,
  IconButton,
  Heading,
  useColorMode,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { FiBell, FiUser, FiSettings, FiLogOut, FiSearch, FiSun, FiMoon } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
};

interface NavBarProps {
  // No mobile menu props needed - static layout only
}

const NavBar: React.FC<NavBarProps> = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const [searchQuery, setSearchQuery] = useState("");

  // Enterprise-style colors: Primary blue (#2563EB), neutral grays, accents green/amber
  const bg = useColorModeValue("white", "#1F2937");
  const borderColor = useColorModeValue("#E5E7EB", "#374151");
  const textColor = useColorModeValue("#1F2937", "#F9FAFB");
  const brandColor = "#2563EB";
  const searchBg = useColorModeValue("#F9FAFB", "#374151");

  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "Admin",
    lastName: "User",
    email: "admin@flowops.com",
    role: "Administrator",
  });

  useEffect(() => {
    // fetch user info from localStorage or API
    const fetchUserInfo = () => {
      try {
        const storedUser = localStorage.getItem("userInfo");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserInfo({
            firstName: parsed.firstName || "Admin",
            lastName: parsed.lastName || "User",
            email: parsed.email || "admin@flowops.com",
            role: parsed.role || "Administrator",
          });
        }
      } catch {
        setUserInfo({
          firstName: "Admin",
          lastName: "User",
          email: "admin@flowops.com",
          role: "Administrator",
        });
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    } catch { }
    navigate("/", { replace: true });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Implement search logic here
    }
  };

  const fullName = `${userInfo.firstName} ${userInfo.lastName}`;

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="full"
      px={{ base: 4, md: 8 }}
      py={4}
      bg={bg}
      borderBottom="1px solid"
      borderColor={borderColor}
      position="sticky"
      top="0"
      zIndex={50}
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
      backdropFilter="blur(8px)"
      overflowY="auto"
    >
      {/* Left: Company Logo + Name */}
      <HStack spacing={3} align="center" minW="200px">
        <Box
          w={10}
          h={10}
          bg={brandColor}
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="lg" fontWeight="bold" color="white">
            F
          </Text>
        </Box>
        <Heading
          size="lg"
          fontWeight="700"
          color={brandColor}
          letterSpacing="-0.025em"
        >
          Flowops
        </Heading>
      </HStack>

      {/* Center: Global Search Bar */}
      <Box flex="1" maxW="600px" mx={8} display={{ base: "none", md: "block" }}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search contacts, documents, or reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            bg={searchBg}
            border="1px solid"
            borderColor={useColorModeValue("#D1D5DB", "#4B5563")}
            borderRadius="xl"
            _focus={{
              borderColor: brandColor,
              boxShadow: `0 0 0 3px ${brandColor}20`,
            }}
            _hover={{
              borderColor: useColorModeValue("#9CA3AF", "#6B7280"),
            }}
          />
          <InputRightElement>
            <Button
              size="sm"
              colorScheme="blue"
              borderRadius="lg"
              onClick={handleSearch}
            >
              Search
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>

      {/* Right: Notifications, Theme Toggle, User Menu */}
      <HStack spacing={4} align="center">
        {/* Notifications */}
        <Menu>
          <MenuButton as={Box} position="relative" cursor="pointer">
            <Tooltip label="Notifications" placement="bottom">
              <IconButton
                aria-label="Notifications"
                icon={<FiBell />}
                size="md"
                variant="ghost"
                borderRadius="xl"
                _hover={{ bg: useColorModeValue("#F3F4F6", "#374151") }}
              />
            </Tooltip>
            <Badge
              colorScheme="red"
              borderRadius="full"
              boxSize="18px"
              fontSize="xs"
              position="absolute"
              top="2px"
              right="2px"
            >
              3
            </Badge>
          </MenuButton>
          <MenuList borderRadius="xl" border="1px solid" borderColor={borderColor}>
            <MenuItem borderRadius="lg" mb={1}>
              <Box>
                <Text fontSize="sm" fontWeight="600">New contact added</Text>
                <Text fontSize="xs" color="gray.500">2 minutes ago</Text>
              </Box>
            </MenuItem>
            <MenuItem borderRadius="lg" mb={1}>
              <Box>
                <Text fontSize="sm" fontWeight="600">Document uploaded</Text>
                <Text fontSize="xs" color="gray.500">1 hour ago</Text>
              </Box>
            </MenuItem>
            <MenuItem borderRadius="lg">
              <Box>
                <Text fontSize="sm" fontWeight="600">System update</Text>
                <Text fontSize="xs" color="gray.500">3 hours ago</Text>
              </Box>
            </MenuItem>
          </MenuList>
        </Menu>

        {/* Theme Toggle */}
        <Tooltip label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`} placement="bottom">
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            size="md"
            variant="ghost"
            borderRadius="xl"
            onClick={toggleColorMode}
            _hover={{ bg: useColorModeValue("#F3F4F6", "#374151") }}
          />
        </Tooltip>

        {/* User Menu */}
        <Menu>
          <MenuButton>
            <HStack
              spacing={3}
              cursor="pointer"
              px={3}
              py={2}
              borderRadius="xl"
              _hover={{ bg: useColorModeValue("#F3F4F6", "#374151") }}
              transition="all 0.2s"
            >
              <Avatar
                size="sm"
                name={fullName}
                bg={brandColor}
                color="white"
                fontWeight="600"
              />
              <Box display={{ base: "none", lg: "block" }}>
                <Text fontSize="sm" fontWeight="600" color={textColor}>
                  {fullName}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {userInfo.role}
                </Text>
              </Box>
            </HStack>
          </MenuButton>
          <MenuList borderRadius="xl" border="1px solid" borderColor={borderColor}>
            <MenuItem icon={<FiUser />} borderRadius="lg" mb={1}>
              <Box>
                <Text fontSize="sm" fontWeight="600">{fullName}</Text>
                <Text fontSize="xs" color="gray.500">{userInfo.email}</Text>
                <Text fontSize="xs" color="gray.400">{userInfo.role}</Text>
              </Box>
            </MenuItem>
            <MenuItem icon={<FiSettings />} borderRadius="lg" mb={1}>
              <Text fontSize="sm">Settings</Text>
            </MenuItem>
            <MenuItem borderRadius="lg" mb={1}>
              <FormControl display="flex" alignItems="center" justifyContent="space-between" w="full">
                <FormLabel htmlFor="dark-mode" mb="0" fontSize="sm">
                  Dark Mode
                </FormLabel>
                <Switch
                  id="dark-mode"
                  size="sm"
                  colorScheme="blue"
                  isChecked={colorMode === "dark"}
                  onChange={toggleColorMode}
                />
              </FormControl>
            </MenuItem>
            <MenuItem icon={<FiLogOut />} onClick={handleLogout} borderRadius="lg" color="red.500">
              <Text fontSize="sm">Logout</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default NavBar;