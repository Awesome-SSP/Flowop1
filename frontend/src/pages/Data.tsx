import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  IconButton,
  Input,
  Select,
  Badge,
  Grid,
  GridItem,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { RepeatIcon, AddIcon, EditIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { FiDatabase, FiFileText, FiActivity, FiClock } from "react-icons/fi";

type DataEntry = {
  id: string;
  name: string;
  type: string;
  status: string;
  lastModified: string;
};

// Mock data - replace with API call in future
const mockData: DataEntry[] = [
  { id: "d1", name: "User Data 1", type: "JSON", status: "Active", lastModified: "2023-10-01" },
  { id: "d2", name: "Report Data 2", type: "CSV", status: "Inactive", lastModified: "2023-09-28" },
  { id: "d3", name: "Analytics Data 3", type: "XML", status: "Active", lastModified: "2023-10-05" },
  { id: "d4", name: "Backup Data 4", type: "SQL", status: "Pending", lastModified: "2023-09-30" },
];

const Data: React.FC = () => {
  const [data, setData] = useState<DataEntry[]>(mockData);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

  const cardBg = useColorModeValue("rgba(255,255,255,0.9)", "rgba(26,26,46,0.9)");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const muted = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)");

  // Simulate dynamic loading - replace with real API
  useEffect(() => {
    // Future: fetchData(search, filter).then(setData);
  }, [search, filter]);

  const refreshData = () => {
    setData(mockData.map(d => ({ ...d, lastModified: new Date().toISOString().split('T')[0] })));
  };

  const addData = () => {
    alert("Add data functionality coming soon!");
  };

  const editData = (id: string) => {
    alert(`Edit data ${id} coming soon!`);
  };

  const deleteData = (id: string) => {
    setData(data.filter(d => d.id !== id));
  };

  const filteredData = data.filter(d =>
    (filter === "all" || d.status === filter) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "green";
      case "Inactive": return "red";
      case "Pending": return "yellow";
      default: return "gray";
    }
  };

  // Calculate stats
  const totalEntries = data.length;
  const activeEntries = data.filter(d => d.status === "Active").length;
  const pendingEntries = data.filter(d => d.status === "Pending").length;
  const inactiveEntries = data.filter(d => d.status === "Inactive").length;

  return (
    <Box h="100%" display="flex" flexDirection="column" p={6}>
      {/* Fixed Header Section */}
      <Box mb={6} flexShrink={0}>
        <Heading 
          size="xl" 
          color={textColor} 
          mb={2}
          bgGradient="linear(to-r, #2563EB, #10B981)"
          bgClip="text"
          fontWeight="bold"
        >
          Data Management
        </Heading>
        <Text color={muted} fontSize="lg">
          Manage and monitor your data sources and files
        </Text>
      </Box>

      {/* Fixed Stats Cards */}
      <Box mb={6} flexShrink={0}>
        <Grid templateColumns={{ base: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
          <GridItem>
            <Box
              bg={cardBg}
              p={4}
              borderRadius="2xl"
              boxShadow="0 8px 32px rgba(0,0,0,0.1)"
              border="1px solid"
              borderColor={borderColor}
              backdropFilter="blur(20px)"
              h="120px"
              display="flex"
              alignItems="center"
            >
              <HStack spacing={3} w="100%">
                <Box
                  p={2}
                  borderRadius="xl"
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  color="white"
                  flexShrink={0}
                >
                  <FiDatabase size={20} />
                </Box>
                <Box flex="1" minW="0">
                  <Text color={muted} fontSize="sm" fontWeight="medium">Total</Text>
                  <Text color={textColor} fontSize="2xl" fontWeight="bold">{totalEntries}</Text>
                  <Text color="green.500" fontSize="xs">+12% growth</Text>
                </Box>
              </HStack>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              bg={cardBg}
              p={4}
              borderRadius="2xl"
              boxShadow="0 8px 32px rgba(0,0,0,0.1)"
              border="1px solid"
              borderColor={borderColor}
              backdropFilter="blur(20px)"
              h="120px"
              display="flex"
              alignItems="center"
            >
              <HStack spacing={3} w="100%">
                <Box
                  p={2}
                  borderRadius="xl"
                  bg="linear-gradient(135deg, #10B981 0%, #059669 100%)"
                  color="white"
                  flexShrink={0}
                >
                  <FiActivity size={20} />
                </Box>
                <Box flex="1" minW="0">
                  <Text color={muted} fontSize="sm" fontWeight="medium">Active</Text>
                  <Text color={textColor} fontSize="2xl" fontWeight="bold">{activeEntries}</Text>
                  <Text color="green.500" fontSize="xs">Online</Text>
                </Box>
              </HStack>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              bg={cardBg}
              p={4}
              borderRadius="2xl"
              boxShadow="0 8px 32px rgba(0,0,0,0.1)"
              border="1px solid"
              borderColor={borderColor}
              backdropFilter="blur(20px)"
              h="120px"
              display="flex"
              alignItems="center"
            >
              <HStack spacing={3} w="100%">
                <Box
                  p={2}
                  borderRadius="xl"
                  bg="linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
                  color="white"
                  flexShrink={0}
                >
                  <FiClock size={20} />
                </Box>
                <Box flex="1" minW="0">
                  <Text color={muted} fontSize="sm" fontWeight="medium">Pending</Text>
                  <Text color={textColor} fontSize="2xl" fontWeight="bold">{pendingEntries}</Text>
                  <Text color="yellow.500" fontSize="xs">Processing</Text>
                </Box>
              </HStack>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              bg={cardBg}
              p={4}
              borderRadius="2xl"
              boxShadow="0 8px 32px rgba(0,0,0,0.1)"
              border="1px solid"
              borderColor={borderColor}
              backdropFilter="blur(20px)"
              h="120px"
              display="flex"
              alignItems="center"
            >
              <HStack spacing={3} w="100%">
                <Box
                  p={2}
                  borderRadius="xl"
                  bg="linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
                  color="white"
                  flexShrink={0}
                >
                  <FiFileText size={20} />
                </Box>
                <Box flex="1" minW="0">
                  <Text color={muted} fontSize="sm" fontWeight="medium">Inactive</Text>
                  <Text color={textColor} fontSize="2xl" fontWeight="bold">{inactiveEntries}</Text>
                  <Text color="red.500" fontSize="xs">Offline</Text>
                </Box>
              </HStack>
            </Box>
          </GridItem>
        </Grid>
      </Box>

      {/* Flexible Table Container */}
      <Box
        bg={cardBg}
        borderRadius="2xl"
        boxShadow="0 8px 32px rgba(0,0,0,0.1)"
        border="1px solid"
        borderColor={borderColor}
        backdropFilter="blur(20px)"
        flex="1"
        minH="0"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Fixed Controls Header */}
        <Box p={6} borderBottom="1px solid" borderColor={borderColor} flexShrink={0}>
          <HStack justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Data Entries
            </Text>
            <HStack spacing={3}>
              <IconButton
                aria-label="Refresh"
                icon={<RepeatIcon />}
                size="md"
                variant="ghost"
                onClick={refreshData}
                borderRadius="xl"
                _hover={{
                  bg: useColorModeValue("gray.100", "gray.700")
                }}
              />
              <Button 
                leftIcon={<AddIcon />} 
                bg="linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
                color="white"
                onClick={addData}
                borderRadius="xl"
                px={6}
                _hover={{
                  boxShadow: "0 8px 25px rgba(37, 99, 235, 0.25)"
                }}
              >
                Add Data
              </Button>
            </HStack>
          </HStack>

          {/* Fixed Filters */}
          <HStack spacing={4} wrap="wrap">
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color={muted} />
              </InputLeftElement>
              <Input
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                borderRadius="xl"
                borderColor={useColorModeValue("gray.300", "gray.600")}
                _focus={{
                  borderColor: "#2563EB",
                  boxShadow: "0 0 0 1px #2563EB"
                }}
              />
            </InputGroup>
            <Select 
              placeholder="Filter by status" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)} 
              maxW="200px"
              borderRadius="xl"
              borderColor={useColorModeValue("gray.300", "gray.600")}
              _focus={{
                borderColor: "#2563EB",
                boxShadow: "0 0 0 1px #2563EB"
              }}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </Select>
          </HStack>
        </Box>

        {/* Scrollable Table Content */}
        <Box 
          flex="1" 
          overflow="auto"
          minH="0"
        >
          <Table variant="simple" size="md">
            <Thead bg={useColorModeValue("gray.50", "gray.700")} position="sticky" top="0" zIndex={1}>
              <Tr>
                <Th color={textColor} fontWeight="semibold">Name</Th>
                <Th color={textColor} fontWeight="semibold">Type</Th>
                <Th color={textColor} fontWeight="semibold">Status</Th>
                <Th color={textColor} fontWeight="semibold">Last Modified</Th>
                <Th color={textColor} fontWeight="semibold">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((entry) => (
                <Tr 
                  key={entry.id} 
                  _hover={{
                    bg: useColorModeValue("blue.50", "blue.900")
                  }}
                >
                  <Td color={textColor} fontWeight="medium">{entry.name}</Td>
                  <Td color={muted}>
                    <Badge variant="subtle" colorScheme="gray" borderRadius="lg">
                      {entry.type}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge 
                      colorScheme={getStatusColor(entry.status)} 
                      borderRadius="lg"
                      px={3}
                      py={1}
                    >
                      {entry.status}
                    </Badge>
                  </Td>
                  <Td color={muted}>{entry.lastModified}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        borderRadius="lg"
                        onClick={() => editData(entry.id)}
                        _hover={{
                          bg: useColorModeValue("blue.100", "blue.800")
                        }}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        borderRadius="lg"
                        onClick={() => deleteData(entry.id)}
                        _hover={{
                          bg: useColorModeValue("red.100", "red.800"),
                          color: "red.500"
                        }}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default Data;
