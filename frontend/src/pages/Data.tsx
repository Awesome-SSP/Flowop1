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
  Divider,
  IconButton,
  Input,
  Select,
  Flex,
  Spacer,
  Badge,
} from "@chakra-ui/react";
import { RepeatIcon, AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";

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

  const bg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const muted = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("orange.500", "purple.500");
  const tableBg = useColorModeValue("gray.50", "gray.600");

  // Simulate dynamic loading - replace with real API
  useEffect(() => {
    // Future: fetchData(search, filter).then(setData);
  }, [search, filter]);

  const refreshData = () => {
    // Future: API call to refresh data
    setData(mockData.map(d => ({ ...d, lastModified: new Date().toISOString().split('T')[0] })));
  };

  const addData = () => {
    // Future: Open modal or navigate to add form
    alert("Add data functionality coming soon!");
  };

  const editData = (id: string) => {
    // Future: Open edit modal
    alert(`Edit data ${id} coming soon!`);
  };

  const deleteData = (id: string) => {
    // Future: Confirm and delete
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

  return (
    <VStack align="stretch" spacing={6} p={6}>
      <HStack justify="space-between" align="center">
        <Heading size="lg" color={textColor}>
          Data Management
        </Heading>
        <HStack spacing={3}>
          <IconButton
            aria-label="Refresh"
            icon={<RepeatIcon />}
            size="sm"
            variant="ghost"
            onClick={refreshData}
            _hover={{ bg: useColorModeValue("orange.100", "purple.700") }}
          />
          <Button size="sm" leftIcon={<AddIcon />} colorScheme="orange" onClick={addData}>
            Add Data
          </Button>
        </HStack>
      </HStack>

      <Divider />

      {/* Filters */}
      <HStack spacing={4} wrap="wrap">
        <Input
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="sm"
          w="250px"
        />
        <Select placeholder="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)} size="sm" w="200px">
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
        </Select>
      </HStack>

      {/* Data Table */}
      <Box bg={bg} borderRadius="lg" boxShadow="sm" overflow="hidden">
        <Table variant="simple" size="sm">
          <Thead bg={tableBg}>
            <Tr>
              <Th color={textColor}>Name</Th>
              <Th color={textColor}>Type</Th>
              <Th color={textColor}>Status</Th>
              <Th color={textColor}>Last Modified</Th>
              <Th color={textColor}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((entry) => (
              <Tr key={entry.id} _hover={{ bg: useColorModeValue("orange.50", "purple.700") }}>
                <Td color={textColor}>{entry.name}</Td>
                <Td color={muted}>{entry.type}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(entry.status)}>{entry.status}</Badge>
                </Td>
                <Td color={muted}>{entry.lastModified}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Edit"
                      icon={<EditIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => editData(entry.id)}
                      _hover={{ bg: useColorModeValue("orange.100", "purple.700") }}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteData(entry.id)}
                      _hover={{ bg: useColorModeValue("red.100", "red.700") }}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default Data;