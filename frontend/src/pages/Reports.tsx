import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  HStack,
  Text,
  Button,
  useColorModeValue,
  IconButton,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { RepeatIcon, DownloadIcon, SearchIcon } from "@chakra-ui/icons";
import { FiBarChart2, FiDollarSign, FiAlertTriangle, FiDownload } from "react-icons/fi";

type ReportData = {
  id: string;
  title: string;
  value: string;
  description: string;
  lastUpdated: string;
  icon: React.ElementType;
  color: string;
};

// Mock data - replace with API call in future
const mockReports: ReportData[] = [
  {
    id: "r1",
    title: "User Activity",
    value: "1.2k",
    description: "Total active users this month",
    lastUpdated: "2 hours ago",
    icon: FiBarChart2,
    color: "#2563EB"
  },
  {
    id: "r2",
    title: "Revenue",
    value: "$45.6k",
    description: "Monthly revenue generated",
    lastUpdated: "1 day ago",
    icon: FiDollarSign,
    color: "#10B981"
  },
  {
    id: "r3",
    title: "System Errors",
    value: "12",
    description: "System errors reported",
    lastUpdated: "30 minutes ago",
    icon: FiAlertTriangle,
    color: "#EF4444"
  },
  {
    id: "r4",
    title: "Downloads",
    value: "3.4k",
    description: "Files downloaded",
    lastUpdated: "5 hours ago",
    icon: FiDownload,
    color: "#F59E0B"
  },
];

const Reports: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>(mockReports);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const cardBg = useColorModeValue("rgba(255,255,255,0.9)", "rgba(26,26,46,0.9)");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const muted = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)");

  // Simulate dynamic loading - replace with real API
  useEffect(() => {
    // Future: fetchReports(filter, searchQuery).then(setReports);
  }, [filter, searchQuery]);

  const refreshReports = () => {
    // Future: API call to refresh reports
    setReports([...mockReports]);
  };

  const downloadReport = (id: string) => {
    // Future: Download logic
    alert(`Downloading report ${id}`);
  };

  const filteredReports = reports.filter(report =>
    (filter === "all" || report.title.toLowerCase().includes(filter.toLowerCase())) &&
    (searchQuery === "" || report.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box h="100%" display="flex" flexDirection="column" p={6} overflowY="auto">
      {/* Fixed Header */}
      <Box mb={6} flexShrink={0}>
        <Heading
          size="xl"
          color={textColor}
          mb={2}
          bgGradient="linear(to-r, #2563EB, #10B981)"
          bgClip="text"
          fontWeight="bold"
        >
          Reports & Analytics
        </Heading>
        <Text color={muted} fontSize="lg">
          Monitor your business performance and generate insights
        </Text>
      </Box>

      {/* Fixed Controls */}
      <Box mb={6} flexShrink={0}>
        <Box
          bg={cardBg}
          p={6}
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(0,0,0,0.1)"
          border="1px solid"
          borderColor={borderColor}
          backdropFilter="blur(20px)"
        >
          <HStack justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Report Controls
            </Text>
            <HStack spacing={3}>
              <IconButton
                aria-label="Refresh"
                icon={<RepeatIcon />}
                size="md"
                variant="ghost"
                onClick={refreshReports}
                borderRadius="xl"
                _hover={{
                  bg: useColorModeValue("gray.100", "gray.700")
                }}
              />
              <Button
                leftIcon={<DownloadIcon />}
                bg="linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
                color="white"
                borderRadius="xl"
                px={6}
                _hover={{
                  boxShadow: "0 8px 25px rgba(37, 99, 235, 0.25)"
                }}
              >
                Export All
              </Button>
            </HStack>
          </HStack>

          <HStack spacing={4} wrap="wrap">
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color={muted} />
              </InputLeftElement>
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderRadius="xl"
                borderColor={useColorModeValue("gray.300", "gray.600")}
                _focus={{
                  borderColor: "#2563EB",
                  boxShadow: "0 0 0 1px #2563EB"
                }}
              />
            </InputGroup>
            <Select
              placeholder="Filter reports"
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
              <option value="all">All Reports</option>
              <option value="user">User Reports</option>
              <option value="revenue">Revenue Reports</option>
              <option value="system">System Reports</option>
            </Select>
          </HStack>
        </Box>
      </Box>

      {/* Fixed Stats Grid */}
      <Box mb={6} flexShrink={0}>
        <Grid templateColumns={{ base: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
          {filteredReports.map((report) => (
            <GridItem key={report.id}>
              <Box
                bg={cardBg}
                p={4}
                borderRadius="2xl"
                boxShadow="0 8px 32px rgba(0,0,0,0.1)"
                border="1px solid"
                borderColor={borderColor}
                backdropFilter="blur(20px)"
                h="140px"
                display="flex"
                flexDirection="column"
                position="relative"
              >
                <HStack justify="space-between" align="flex-start" mb={3}>
                  <HStack spacing={2}>
                    <Box
                      p={2}
                      borderRadius="lg"
                      bg={`${report.color}20`}
                      color={report.color}
                    >
                      <report.icon size={18} />
                    </Box>
                    <Box flex="1">
                      <Text fontSize="sm" fontWeight="medium" color={muted} noOfLines={1}>
                        {report.title}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color={textColor} lineHeight="1">
                        {report.value}
                      </Text>
                    </Box>
                  </HStack>
                  <IconButton
                    aria-label="Download"
                    icon={<DownloadIcon />}
                    size="sm"
                    variant="ghost"
                    borderRadius="lg"
                    onClick={() => downloadReport(report.id)}
                    _hover={{
                      bg: useColorModeValue("gray.100", "gray.700")
                    }}
                  />
                </HStack>

                <Box mt="auto">
                  <Text fontSize="xs" color={muted} noOfLines={2} mb={2}>
                    {report.description}
                  </Text>
                  <Text fontSize="xs" color="green.500" fontWeight="medium">
                    Updated {report.lastUpdated}
                  </Text>
                </Box>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>

      {/* Chart/Graph Area */}
      <Box
        bg={cardBg}
        borderRadius="2xl"
        boxShadow="0 8px 32px rgba(0,0,0,0.1)"
        border="1px solid"
        borderColor={borderColor}
        backdropFilter="blur(20px)"
        flex="1"
        minH="300px"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <Box p={6} borderBottom="1px solid" borderColor={borderColor} flexShrink={0}>
          <Text fontSize="lg" fontWeight="semibold" color={textColor}>
            Performance Overview
          </Text>
          <Text fontSize="sm" color={muted}>
            Visual representation of your business metrics
          </Text>
        </Box>

        <Box flex="1" p={6} display="flex" alignItems="center" justifyContent="center">
          <Box textAlign="center">
            <Text fontSize="6xl" opacity="0.3" mb={4}>📊</Text>
            <Text color={muted} fontSize="lg">
              Interactive charts and graphs will be displayed here
            </Text>
            <Text color={muted} fontSize="sm" mt={2}>
              Connect to your data source to see real-time analytics
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;
