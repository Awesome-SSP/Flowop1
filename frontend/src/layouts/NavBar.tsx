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
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("gray.700", "gray.200");

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
      py={4}
      bg="repeating-linear-gradient(45deg, #ff1493 0px, #00ff00 15px, #ffff00 30px, #ff4500 45px)"
      border="10px dotted #ff00ff"
      borderRadius="0px"
      position="sticky"
      top="0"
      zIndex={50}
      pl={{ base: 10, md: 6 }}
      mx={{ base: 2, md: 4 }}
      mt={2}
      boxShadow="0 0 50px #ff0000, inset 0 0 50px #00ffff, 0 0 100px #ffff00"
      style={{ 
        backdropFilter: "blur(0.5px) saturate(500%) contrast(300%)",
        background: "conic-gradient(from 0deg at 50% 50%, #ff1493, #9acd32, #ff4500, #8a2be2, #dc143c, #ff1493)",
        transition: "all 0.1s linear",
        fontFamily: "Impact, 'Arial Black', sans-serif",
        textTransform: "uppercase",
      }}
      animation="navbar-crazy 1s ease-in-out infinite alternate"
      _hover={{
        boxShadow: "0 0 100px #ff00ff, inset 0 0 100px #00ff00, 0 0 200px #ff0000",
        transform: "translateY(-5px) rotateZ(2deg)",
        filter: "brightness(300%) contrast(400%)",
      }}
      sx={{
        '@keyframes navbar-crazy': {
          '0%': { 
            backgroundColor: '#ff1493',
            borderColor: '#00ff00',
          },
          '100%': { 
            backgroundColor: '#00ffff',
            borderColor: '#ff0000',
          },
        },
      }}
    >
      <HStack spacing={3} align="center">
        <Box>
          <HStack spacing={2} align="center">
            <Icon as={FiTrendingUp} boxSize={8} color="#ff0000" animation="spin 0.5s linear infinite" />
            <Heading
              size={{ base: "md", md: "lg" }}
              lineHeight="1"
              fontWeight="900"
              color="#ffff00"
              textShadow="0 0 10px #ff00ff, 0 0 20px #00ffff, 0 0 30px #ff0000"
              style={{
                fontFamily: "Comic Sans MS, cursive",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}
              animation="text-flash 0.3s linear infinite alternate"
              sx={{
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
                '@keyframes text-flash': {
                  '0%': { 
                    color: '#ff0000',
                    textShadow: '0 0 10px #ff00ff',
                  },
                  '50%': { 
                    color: '#00ff00',
                    textShadow: '0 0 10px #ffff00',
                  },
                  '100%': { 
                    color: '#0000ff',
                    textShadow: '0 0 10px #ff0000',
                  },
                },
              }}
            >
              🤮 FLOWOPS 🤢
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
            bg={useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)")}
            _hover={{ bg: useColorModeValue("rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.2)") }}
            borderRadius="xl"
            backdropFilter="blur(10px)"
          />
        </Tooltip>

        {/* notifications */}
        <Menu>
          <MenuButton 
            as={IconButton} 
            aria-label="Notifications" 
            icon={<FiBell />} 
            size="sm" 
            variant="ghost" 
            position="relative"
            bg={useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)")}
            _hover={{ bg: useColorModeValue("rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.2)") }}
            borderRadius="xl"
            backdropFilter="blur(10px)"
          >
            <Badge
              colorScheme="red"
              borderRadius="full"
              boxSize="18px"
              fontSize="xs"
              position="absolute"
              top="-2px"
              right="-2px"
              bg="linear-gradient(135deg, #ff6b6b, #ee5a24)"
              color="white"
            >
              3
            </Badge>
          </MenuButton>
          <MenuList
            bg={useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(36, 39, 54, 0.9)")}
            backdropFilter="blur(20px)"
            border="1px solid rgba(255, 255, 255, 0.2)"
            borderRadius="xl"
            boxShadow="0 8px 32px rgba(31, 38, 135, 0.37)"
          >
            <MenuItem bg="transparent" _hover={{ bg: useColorModeValue("rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.1)") }}>
              <Box>
                <Text fontSize="sm" fontWeight="600">New document uploaded</Text>
                <Text fontSize="xs" color="gray.500">2 minutes ago</Text>
              </Box>
            </MenuItem>
            <MenuItem bg="transparent" _hover={{ bg: useColorModeValue("rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.1)") }}>
              <Box>
                <Text fontSize="sm" fontWeight="600">System maintenance scheduled</Text>
                <Text fontSize="xs" color="gray.500">1 hour ago</Text>
              </Box>
            </MenuItem>
            <MenuItem bg="transparent" _hover={{ bg: useColorModeValue("rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.1)") }}>
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
            <HStack 
              spacing={2} 
              cursor="pointer" 
              px={3} 
              py={2} 
              borderRadius="xl" 
              bg={useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)")}
              _hover={{ 
                bg: useColorModeValue("rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.2)"),
                transform: "translateY(-1px)" 
              }}
              backdropFilter="blur(10px)"
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            >
              <Avatar 
                size="sm" 
                name={fullName} 
                bg="linear-gradient(135deg, #667eea, #764ba2)" 
                color="white"
                border="2px solid rgba(255, 255, 255, 0.3)"
              />
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
          <MenuList
            bg={useColorModeValue("rgba(255, 255, 255, 0.9)", "rgba(36, 39, 54, 0.9)")}
            backdropFilter="blur(20px)"
            border="1px solid rgba(255, 255, 255, 0.2)"
            borderRadius="xl"
            boxShadow="0 8px 32px rgba(31, 38, 135, 0.37)"
          >
            <MenuItem bg="transparent" _hover={{ bg: useColorModeValue("rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.1)") }} icon={<FiUser />}>
              <Box>
                <Text fontSize="sm">{fullName}</Text>
                <Text fontSize="xs" color="gray.500">{userInfo.email}</Text>
                <Text fontSize="xs" color="gray.400">{userInfo.role}</Text>
              </Box>
            </MenuItem>
            <MenuItem bg="transparent" _hover={{ bg: useColorModeValue("rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.1)") }} icon={<FiSettings />}>
              <Text fontSize="sm">Settings</Text>
            </MenuItem>
            <MenuItem bg="transparent">
              <FormControl display="flex" alignItems="center" justifyContent="space-between" w="full">
                <FormLabel htmlFor="dark-mode" mb="0" fontSize="sm">
                  Dark Mode
                </FormLabel>
                <Switch
                  id="dark-mode"
                  size="sm"
                  isChecked={colorMode === "dark"}
                  onChange={toggleColorMode}
                  colorScheme="purple"
                />
              </FormControl>
            </MenuItem>
            <MenuItem bg="transparent" _hover={{ bg: useColorModeValue("rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.1)") }} icon={<FiLogOut />} onClick={handleLogout}>
              <Text fontSize="sm">Logout</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};

export default NavBar;