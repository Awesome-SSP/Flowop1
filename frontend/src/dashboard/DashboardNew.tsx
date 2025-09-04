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
            title: "Documents",
            value: "2,341",
            change: -2.4,
            changeText: "vs last month",
            series: makeSeries(12, 120),
            icon: FiFileText,
            color: "#F59E0B"
        },
        {
            id: "c4",
            title: "Revenue",
            value: "$847,291",
            change: 15.8,
            changeText: "vs last month",
            series: makeSeries(12, 2000),
            icon: FiDollarSign,
            color: "#059669"
        },
    ];
};

/* Modern Histogram Component */
const Histogram: React.FC<{
    data: number[];
    labels?: string[];
    color?: string;
    height?: number;
}> = ({ data, labels = [], color = "#2563EB", height = 80 }) => {
    const max = Math.max(...data) || 1;
    const formatNumber = (v: number) => {
        if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
        if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
        return String(v);
    };

    const xLabels = labels.length >= data.length ? labels.slice(-data.length) : data.map((_, i) => `${i + 1}`);

    return (
        <Box width="100%" position="relative">
            <Flex align="end" h={`${height}px`} gap={1} w="100%" position="relative" zIndex={1}>
                {data.map((v, i) => {
                    const hPct = (v / max) * 100;
                    const label = xLabels[i] ?? String(i);
                    return (
                        <Tooltip key={i} label={`${label}: ${formatNumber(v)}`} placement="top" hasArrow>
                            <Box
                                flex="1"
                                h={`${Math.max(hPct, 2)}%`}
                                bg={color}
                                borderRadius="2px"
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{ opacity: 0.8 }}
                                opacity={0.9}
                            />
                        </Tooltip>
                    );
                })}
            </Flex>
        </Box>
    );
};

/* Modern Enterprise Dashboard Card */
const DashboardCard: React.FC<{
    data: ChartData;
    onRefresh?: (id: string) => void;
}> = ({ data, onRefresh }) => {
    const bg = useColorModeValue("white", "#1F2937");
    const borderColor = useColorModeValue("#E5E7EB", "#374151");
    const textColor = useColorModeValue("#374151", "#F9FAFB");
    const mutedColor = useColorModeValue("#6B7280", "#9CA3AF");

    return (
        <Box
            bg={bg}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            p={6}
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            transition="all 0.2s"
            _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
            }}
            backdropFilter="blur(8px)"
            position="relative"
            overflow="hidden"
        >
            {/* Background gradient overlay */}
            <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                height="4px"
                bgGradient={`linear(to-r, ${data.color}, ${data.color}80)`}
            />

            <VStack align="stretch" spacing={4}>
                <HStack justify="space-between" align="flex-start">
                    <VStack align="flex-start" spacing={1}>
                        <HStack spacing={3}>
                            <Box
                                p={2}
                                borderRadius="lg"
                                bg={`${data.color}15`}
                            >
                                <data.icon size={20} color={data.color} />
                            </Box>
                            <Text fontSize="sm" color={mutedColor} fontWeight="500">
                                {data.title}
                            </Text>
                        </HStack>
                        <Text fontSize="3xl" fontWeight="700" color={textColor} lineHeight="1">
                            {data.value}
                        </Text>
                        <HStack spacing={2}>
                            <Box
                                px={2}
                                py={1}
                                borderRadius="md"
                                bg={data.change >= 0 ? "#10B98115" : "#EF444415"}
                            >
                                <HStack spacing={1}>
                                    <Text
                                        fontSize="xs"
                                        fontWeight="600"
                                        color={data.change >= 0 ? "#059669" : "#DC2626"}
                                    >
                                        {data.change >= 0 ? "+" : ""}{data.change}%
                                    </Text>
                                </HStack>
                            </Box>
                            <Text fontSize="xs" color={mutedColor}>
                                {data.changeText}
                            </Text>
                        </HStack>
                    </VStack>

                    <IconButton
                        size="sm"
                        aria-label="refresh"
                        variant="ghost"
                        icon={<RepeatIcon />}
                        onClick={() => onRefresh?.(data.id)}
                        borderRadius="lg"
                    />
                </HStack>

                <Box h="80px">
                    <Histogram
                        data={data.series.slice(-12)}
                        labels={data.series.slice(-12).map((_, idx, arr) => `${arr.length - idx}d ago`)}
                        color={data.color}
                        height={80}
                    />
                </Box>
            </VStack>
        </Box>
    );
};

const Dashboard: React.FC = () => {
    const [charts, setCharts] = useState<ChartData[]>(() => sampleInitialData());
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const bg = useColorModeValue("#F9FAFB", "#111827");
    const textColor = useColorModeValue("#1F2937", "#F9FAFB");
    const mutedColor = useColorModeValue("#6B7280", "#9CA3AF");

    const refreshOne = (id: string) => {
        setCharts((prev) =>
            prev.map((c) =>
                c.id === id
                    ? {
                        ...c,
                        value:
                            c.title.includes("Revenue")
                                ? `$${(Math.random() * 900000 + 500000).toLocaleString()}`
                                : c.title.includes("Clients")
                                    ? `${Math.round(Math.random() * 500 + 1000).toLocaleString()}`
                                    : c.title.includes("Projects")
                                        ? `${Math.round(Math.random() * 50 + 50)}`
                                        : `${Math.round(Math.random() * 1000 + 2000).toLocaleString()}`,
                        change: (Math.random() - 0.3) * 25,
                        series: [...c.series.slice(1), Math.round(Math.random() * (c.title.includes("Revenue") ? 2000 : 150))],
                    }
                    : c
            )
        );
        setLastUpdated(new Date());
    };

    const refreshAll = () => {
        charts.forEach((c) => refreshOne(c.id));
    };

    const refreshLabel = useMemo(() => {
        if (!lastUpdated) return "Never updated";
        const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
        if (seconds < 60) return `Updated ${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        return `Updated ${minutes}m ago`;
    }, [lastUpdated]);

    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated((prev) => prev); // trigger recompute
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box bg={bg} minH="100vh" p={8}>
            <VStack align="stretch" spacing={8}>
                {/* Header */}
                <Flex justify="space-between" align="center">
                    <VStack align="flex-start" spacing={1}>
                        <Heading size="xl" color={textColor} fontWeight="700">
                            Dashboard Overview
                        </Heading>
                        <Text color={mutedColor} fontSize="md">
                            Welcome back! Here's what's happening with your business.
                        </Text>
                    </VStack>

                    <VStack align="flex-end" spacing={2}>
                        <Button
                            leftIcon={<RepeatIcon />}
                            onClick={refreshAll}
                            colorScheme="blue"
                            variant="solid"
                            borderRadius="xl"
                            fontWeight="600"
                        >
                            Refresh All
                        </Button>
                        <Text fontSize="xs" color={mutedColor}>
                            {refreshLabel}
                        </Text>
                    </VStack>
                </Flex>

                {/* Stats Grid */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                    {charts.map((data) => (
                        <DashboardCard key={data.id} data={data} onRefresh={refreshOne} />
                    ))}
                </SimpleGrid>

                {/* Additional Content Area */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    {/* Recent Activity */}
                    <Box
                        bg={useColorModeValue("white", "#1F2937")}
                        borderRadius="2xl"
                        border="1px solid"
                        borderColor={useColorModeValue("#E5E7EB", "#374151")}
                        p={6}
                        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    >
                        <VStack align="stretch" spacing={4}>
                            <Heading size="md" color={textColor} fontWeight="600">
                                Recent Activity
                            </Heading>
                            <VStack align="stretch" spacing={3}>
                                {[
                                    { action: "New client onboarded", time: "2 hours ago", type: "success" },
                                    { action: "Document uploaded", time: "4 hours ago", type: "info" },
                                    { action: "Project completed", time: "6 hours ago", type: "success" },
                                    { action: "Meeting scheduled", time: "1 day ago", type: "warning" },
                                ].map((activity, index) => (
                                    <HStack key={index} spacing={3} p={3} borderRadius="lg" bg={useColorModeValue("#F9FAFB", "#374151")}>
                                        <Box
                                            w={2}
                                            h={2}
                                            borderRadius="full"
                                            bg={
                                                activity.type === "success" ? "#10B981" :
                                                    activity.type === "warning" ? "#F59E0B" : "#3B82F6"
                                            }
                                        />
                                        <VStack align="flex-start" spacing={0} flex="1">
                                            <Text fontSize="sm" color={textColor} fontWeight="500">
                                                {activity.action}
                                            </Text>
                                            <Text fontSize="xs" color={mutedColor}>
                                                {activity.time}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                ))}
                            </VStack>
                        </VStack>
                    </Box>

                    {/* Quick Actions */}
                    <Box
                        bg={useColorModeValue("white", "#1F2937")}
                        borderRadius="2xl"
                        border="1px solid"
                        borderColor={useColorModeValue("#E5E7EB", "#374151")}
                        p={6}
                        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    >
                        <VStack align="stretch" spacing={4}>
                            <Heading size="md" color={textColor} fontWeight="600">
                                Quick Actions
                            </Heading>
                            <SimpleGrid columns={2} spacing={3}>
                                {[
                                    { label: "Add Contact", icon: FiUsers, color: "#3B82F6" },
                                    { label: "Upload Document", icon: FiFileText, color: "#10B981" },
                                    { label: "View Reports", icon: FiTrendingUp, color: "#F59E0B" },
                                    { label: "Settings", icon: FiTarget, color: "#8B5CF6" },
                                ].map((action, index) => (
                                    <Button
                                        key={index}
                                        leftIcon={<action.icon />}
                                        variant="ghost"
                                        justifyContent="flex-start"
                                        borderRadius="xl"
                                        p={4}
                                        h="auto"
                                        color={action.color}
                                        _hover={{ bg: `${action.color}15` }}
                                    >
                                        <Text fontSize="sm" fontWeight="500">
                                            {action.label}
                                        </Text>
                                    </Button>
                                ))}
                            </SimpleGrid>
                        </VStack>
                    </Box>
                </SimpleGrid>
            </VStack>
        </Box>
    );
};

export default Dashboard;
