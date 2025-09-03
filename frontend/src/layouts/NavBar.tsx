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
} from "@chakra-ui/react";
import { FiBell, FiUser, FiSettings, FiLogOut, FiRefreshCw, FiTrendingUp } from "react-icons/fi";  // Changed FiZap to FiTrendingUp for a more professional icon
import { useNavigate } from "react-router-dom";

type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
};

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();  // Added for theme toggle
  // Updated colors to match SideBar's toggle: orange in light mode, purple in dark mode
  const bg = useColorModeValue("orange.100", "purple.800");
  const border = useColorModeValue("orange.100", "purple.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  // Brand gradient: orange in light mode, purple in dark mode
  const brandGradient = useColorModeValue(
    "linear(to-r, orange.400, orange.600)",
    "linear(to-r, purple.300, purple.500)"
  );

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
    } catch {}
    navigate("/", { replace: true });
  };

  const handleSwitchUser = () => {
    console.log("Switch user clicked");
  };

  const fullName = `${userInfo.firstName} ${userInfo.lastName}`;

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="full"
      px={{ base: 3, md: 6 }}
      py={3}
      bg={bg}
      borderColor={border}
      position="sticky"
      top="0"
      zIndex={40}
      pl={{ base: 10, md: 0 }}
      boxShadow="sm"  // Added subtle shadow for depth
    >
      <HStack spacing={3} align="center">
        <Box>
          <HStack spacing={2} align="center">
            <Icon as={FiTrendingUp} boxSize={5} color={useColorModeValue("orange.500", "purple.500")} />  // Orange in light, purple in dark
            <Heading
              size={{ base: "sm", md: "lg" }}
              lineHeight="1"
              fontWeight="700"  // Made bolder for brand feel
              bgGradient={brandGradient}
              bgClip="text"  // Clip to text
              color="transparent"  // Make text transparent to show gradient
            >
              Flowops
            </Heading>
          </HStack>
        </Box>
      </HStack>

      <HStack spacing={4} align="center">
        {/* switch user button */}
        <Tooltip label="Switch User" placement="bottom">
          <IconButton
            aria-label="Switch user"
            icon={<FiRefreshCw />}
            size="sm"
            variant="ghost"
            onClick={handleSwitchUser}
          />
        </Tooltip>

        {/* notifications */}
        <Menu>
          <MenuButton as={IconButton} aria-label="Notifications" icon={<FiBell />} size="sm" variant="ghost" position="relative">
            <Badge
              colorScheme="red"
              borderRadius="full"
              boxSize="18px"
              fontSize="xs"
              position="absolute"
              top="-2px"
              right="-2px"
            >
              3
            </Badge>
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Box>
                <Text fontSize="sm" fontWeight="600">New document uploaded</Text>
                <Text fontSize="xs" color="gray.500">2 minutes ago</Text>
              </Box>
            </MenuItem>
            <MenuItem>
              <Box>
                <Text fontSize="sm" fontWeight="600">System maintenance scheduled</Text>
                <Text fontSize="xs" color="gray.500">1 hour ago</Text>
              </Box>
            </MenuItem>
            <MenuItem>
              <Box>
                <Text fontSize="sm" fontWeight="600">Contact updated</Text>
                <Text fontSize="xs" color="gray.500">3 hours ago</Text>
              </Box>
            </MenuItem>
          </MenuList>
        </Menu>

        {/* admin menu with dynamic user info */}
        <Menu>
          <MenuButton>
            <HStack spacing={2} cursor="pointer" px={2} py={1} borderRadius="md" _hover={{ bg: useColorModeValue("orange.100", "purple.700") }}>
              <Avatar size="sm" name={fullName} bg={useColorModeValue("orange.500", "purple.500")} color="white" />  // Added complementary bg: orange in light, purple in dark
              <Box display={{ base: "none", md: "block" }}>
                <Text fontSize="sm" fontWeight="600" color={textColor}>
                  {fullName}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {userInfo.email}
                </Text>
              </Box>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FiUser />}>
              <Box>
                <Text fontSize="sm">{fullName}</Text>
                <Text fontSize="xs" color="gray.500">{userInfo.email}</Text>
                <Text fontSize="xs" color="gray.400">{userInfo.role}</Text>
              </Box>
            </MenuItem>
            <MenuItem icon={<FiSettings />}>
              <Text fontSize="sm">Settings</Text>
            </MenuItem>
            <MenuItem>
              <FormControl display="flex" alignItems="center" justifyContent="space-between" w="full">
                <FormLabel htmlFor="dark-mode" mb="0" fontSize="sm">
                  Dark Mode
                </FormLabel>
                <Switch
                  id="dark-mode"
                  size="sm"
                  isChecked={colorMode === "dark"}
                  onChange={toggleColorMode}  // Functional theme toggle
                />
              </FormControl>
            </MenuItem>
            <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
              <Text fontSize="sm">Logout</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default NavBar;