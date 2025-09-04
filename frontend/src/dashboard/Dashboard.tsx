import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { FiTrendingUp, FiUsers, FiFileText, FiDollarSign, FiTarget } from "react-icons/fi";

type ChartData = {
  id: string;
  title: string;
  value: string;
  change: number;
  changeText: string;
  series: number[];
  icon: React.ElementType;
  color: string;
};

const sampleInitialData = (): ChartData[] => {
  const makeSeries = (len = 12, max = 100) => Array.from({ length: len }, () => Math.round(Math.random() * max));
  return [
    {
      id: "c1",
      title: "Total Clients",
      value: "1,247",
      change: 12.5,
      changeText: "vs last month",
      series: makeSeries(12, 120),
      icon: FiUsers,
      color: "#2563EB"
    },
    {
      id: "c2",
      title: "Active Projects",
      value: "89",
      change: 8.2,
      changeText: "vs last month",
      series: makeSeries(12, 80),
      icon: FiTarget,
      color: "#10B981"
    },
    {
      id: "c3",
      title: "Revenue",
      value: "$142.8K",
      change: -2.4,
      changeText: "vs last month",
      series: makeSeries(12, 150),
      icon: FiDollarSign,
      color: "#F59E0B"
    },
    {
      id: "c4",
      title: "Documents",
      value: "2,847",
      change: 18.6,
      changeText: "vs last month",
      series: makeSeries(12, 200),
      icon: FiFileText,
      color: "#EF4444"
    },
  ];
};

// Simple histogram component
const Histogram: React.FC<{
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
}> = ({ data, labels = [], color = "#2563EB", height = 80 }) => {
  const max = Math.max(...data);

  return (
    <Box width="100%" position="relative">
      <Flex align="end" h={`${height}px`} gap={1} w="100%" position="relative" zIndex={1}>
        {data.map((value, index) => {
          const hPct = max > 0 ? (value / max) * 100 : 0;
          return (
            <Tooltip key={index} label={`${labels[index] || `#${index + 1}`}: ${value}`} placement="top">
              <Box
                bg={color}
                h={`${Math.max(hPct, 2)}%`}
                flex="1"
                borderRadius="2px"
                minH="2px"
                opacity={0.8}
                _hover={{ opacity: 1 }}
                cursor="pointer"
              />
            </Tooltip>
          );
        })}
      </Flex>
    </Box>
  );
};

// Dashboard card component
const DashboardCard: React.FC<{ data: ChartData }> = ({ data }) => {
  const cardBg = useColorModeValue("rgba(255,255,255,0.9)", "rgba(26,26,46,0.9)");
  const textColor = useColorModeValue("#1F2937", "#F9FAFB");
  const mutedColor = useColorModeValue("#6B7280", "#9CA3AF");
  const borderColor = useColorModeValue("rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)");

  return (
    <Box
      bg={cardBg}
      borderRadius="2xl"
      border="1px solid"
      borderColor={borderColor}
      p={6}
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      _hover={{
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      }}
      backdropFilter="blur(8px)"
      position="relative"
      overflow="hidden"
      h="220px" // Fixed height
      display="flex"
      flexDirection="column"
    >
      <Box
        position="absolute"
        top="0"
        right="0"
        w="40%"
        h="100%"
        bgGradient={`linear(45deg, transparent 0%, ${data.color}10 100%)`}
        borderRadius="0 2xl 2xl 0"
      />

      <VStack align="stretch" spacing={4} flex="1">
        <HStack justify="space-between" align="flex-start">
          <VStack align="flex-start" spacing={1}>
            <HStack spacing={2} align="center">
              <Box color={data.color}>
                <data.icon size={20} />
              </Box>
              <Text fontSize="sm" color={mutedColor} fontWeight="500">
                {data.title}
              </Text>
            </HStack>
            <Text fontSize="3xl" fontWeight="700" color={textColor} lineHeight="1">
              {data.value}
            </Text>
          </VStack>
        </HStack>

        <VStack align="flex-start" spacing={2} flex="1">
          <HStack spacing={2} align="center">
            <Box color={data.change >= 0 ? "#10B981" : "#EF4444"}>
              <FiTrendingUp size={16} />
            </Box>
            <Text
              fontSize="sm"
              color={data.change >= 0 ? "#10B981" : "#EF4444"}
              fontWeight="600"
            >
              {data.change >= 0 ? "+" : ""}{data.change}%
            </Text>
            <Text fontSize="sm" color={mutedColor}>
              {data.changeText}
            </Text>
          </HStack>
        </VStack>

        <Box h="60px" mt="auto">
          <Histogram
            data={data.series}
            color={data.color}
            height={60}
          />
        </Box>
      </VStack>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const [charts, setCharts] = useState<ChartData[]>(sampleInitialData());
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const textColor = useColorModeValue("#1F2937", "#F9FAFB");
  const mutedColor = useColorModeValue("#6B7280", "#9CA3AF");

  const refreshAll = () => {
    setCharts(sampleInitialData());
    setLastUpdated(new Date());
  };

  const refreshLabel = useMemo(() => {
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (diffSeconds < 60) return "Just updated";
    if (diffSeconds < 3600) return `Updated ${Math.floor(diffSeconds / 60)}m ago`;
    return `Updated ${Math.floor(diffSeconds / 3600)}h ago`;
  }, [lastUpdated]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated((prev) => prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box h="100%" display="flex" flexDirection="column" p={6}>
      {/* Fixed Header */}
      <Box mb={6} flexShrink={0}>
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="xl" color={textColor} fontWeight="700">
              Dashboard Overview
            </Heading>
            <Text color={mutedColor} fontSize="md">
              Welcome back! Here's what's happening with your business.
            </Text>
          </Box>

          <VStack align="flex-end" spacing={2}>
            <Button
              leftIcon={<RepeatIcon />}
              onClick={refreshAll}
              bg="linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)"
              color="white"
              variant="solid"
              borderRadius="xl"
              fontWeight="600"
              _hover={{
                boxShadow: "0 8px 25px rgba(37, 99, 235, 0.25)"
              }}
            >
              Refresh All
            </Button>
            <Text fontSize="xs" color={mutedColor}>
              {refreshLabel}
            </Text>
          </VStack>
        </Flex>
      </Box>

      {/* Fixed Stats Grid */}
      <Box flex="1" overflow="auto">
        <SimpleGrid columns={{ base: 1, lg: 2, xl: 4 }} spacing={6} mb={8}>
          {charts.map((data) => (
            <DashboardCard key={data.id} data={data} />
          ))}
        </SimpleGrid>

        {/* Recent Activity Section */}
        <Box
          bg={useColorModeValue("rgba(255,255,255,0.9)", "rgba(26,26,46,0.9)")}
          borderRadius="2xl"
          border="1px solid"
          borderColor={useColorModeValue("rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)")}
          p={6}
          boxShadow="0 8px 32px rgba(0,0,0,0.1)"
          backdropFilter="blur(20px)"
        >
          <Text fontSize="lg" fontWeight="semibold" color={textColor} mb={4}>
            Recent Activity
          </Text>
          <VStack align="stretch" spacing={3}>
            {[
              "New client onboarded: Acme Corp",
              "Project completed: Website redesign",
              "Invoice sent: $5,200 to TechStart Inc",
              "Document uploaded: Q3 Report.pdf",
              "Meeting scheduled: Client review tomorrow",
            ].map((activity, index) => (
              <HStack key={index} spacing={3} p={3} borderRadius="lg" bg={useColorModeValue("gray.50", "gray.800")}>
                <Box w={2} h={2} bg="#2563EB" borderRadius="full" flexShrink={0} />
                <Text color={textColor} fontSize="sm">{activity}</Text>
                <Text color={mutedColor} fontSize="xs" ml="auto">{index + 1}h ago</Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
