import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Divider,
  IconButton,
  Select,
  Input,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { RepeatIcon, DownloadIcon } from "@chakra-ui/icons";

type ReportData = {
  id: string;
  title: string;
  value: string;
  description: string;
  lastUpdated: string;
};

// Mock data - replace with API call in future
const mockReports: ReportData[] = [
  { id: "r1", title: "User Activity", value: "1.2k", description: "Total active users this month", lastUpdated: "2 hours ago" },
  { id: "r2", title: "Revenue", value: "$45.6k", description: "Monthly revenue generated", lastUpdated: "1 day ago" },
  { id: "r3", title: "Errors", value: "12", description: "System errors reported", lastUpdated: "30 minutes ago" },
  { id: "r4", title: "Downloads", value: "3.4k", description: "Files downloaded", lastUpdated: "5 hours ago" },
];

const Reports: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>(mockReports);
  const [filter, setFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("");

  const bg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const muted = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("orange.500", "purple.500");

  // Simulate dynamic loading - replace with real API
  useEffect(() => {
    // Future: fetchReports(filter, dateRange).then(setReports);
  }, [filter, dateRange]);

  const refreshReports = () => {
    // Future: API call to refresh data
    setReports(mockReports.map(r => ({ ...r, lastUpdated: "Just now" })));
  };

  const exportReports = () => {
    // Future: Export logic
    alert("Export functionality coming soon!");
  };

  const filteredReports = reports.filter(r => filter === "all" || r.id.includes(filter));

  return (
    <VStack align="stretch" spacing={6} p={6}>
      <HStack justify="space-between" align="center">
        <Heading size="lg" color={textColor}>
          Reports
        </Heading>
        <HStack spacing={3}>
          <IconButton
            aria-label="Refresh"
            icon={<RepeatIcon />}
            size="sm"
            variant="ghost"
            onClick={refreshReports}
            _hover={{ bg: useColorModeValue("orange.100", "purple.700") }}
          />
          <Button size="sm" leftIcon={<DownloadIcon />} colorScheme="orange" onClick={exportReports}>
            Export
          </Button>
        </HStack>
      </HStack>

      <Divider />

      {/* Filters */}
      <HStack spacing={4} wrap="wrap">
        <Select placeholder="Filter by type" value={filter} onChange={(e) => setFilter(e.target.value)} size="sm" w="200px">
          <option value="all">All Reports</option>
          <option value="r1">User Activity</option>
          <option value="r2">Revenue</option>
          <option value="r3">Errors</option>
          <option value="r4">Downloads</option>
        </Select>
        <Input
          placeholder="Date range (e.g., 2023-01-01 to 2023-12-31)"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          size="sm"
          w="300px"
        />
      </HStack>

      {/* Reports Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 2 }} spacing={6}>
        {filteredReports.map((report) => (
          <Box key={report.id} bg={bg} borderRadius="lg" boxShadow="sm" p={5} border="1px solid" borderColor={useColorModeValue("orange.100", "purple.700")}>
            <Stat>
              <StatLabel fontSize="sm" color={muted} fontWeight="500">
                {report.title}
              </StatLabel>
              <StatNumber fontSize="3xl" color={accentColor} fontWeight="bold">
                {report.value}
              </StatNumber>
              <Text fontSize="sm" color={muted} mt={2}>
                {report.description}
              </Text>
              <Text fontSize="xs" color={muted} mt={1}>
                Last updated: {report.lastUpdated}
              </Text>
            </Stat>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default Reports;