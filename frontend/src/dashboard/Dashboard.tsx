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
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Flex,
  Spacer,
  Tooltip,
  Divider,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

type ChartData = { id: string; title: string; value: string; series: number[] };

const sampleInitialData = (): ChartData[] => {
  const makeSeries = (len = 12, max = 100) => Array.from({ length: len }, () => Math.round(Math.random() * max));
  return [
    { id: "c1", title: "Active Users", value: "1.2k", series: makeSeries(12, 120) },
    { id: "c2", title: "New Signups", value: "342", series: makeSeries(12, 80) },
    { id: "c3", title: "Errors", value: "4", series: makeSeries(12, 12) },
    { id: "c4", title: "Revenue", value: "$12.4k", series: makeSeries(12, 2000) },
    { id: "c5", title: "Conversion", value: "3.8%", series: makeSeries(12, 10) },
    { id: "c6", title: "API Latency", value: "120ms", series: makeSeries(12, 300) },
  ];
};

/* Improved Histogram - cleaner bars with subtle grid */
const Histogram: React.FC<{
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
}> = ({ data, labels = [], color = "#6B46C1", height = 100 }) => {
  const max = Math.max(...data) || 1;
  const formatNumber = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
    return String(v);
  };

  const xLabels = labels.length >= data.length ? labels.slice(-data.length) : data.map((_, i) => `T-${data.length - i}`);

  const gridColor = useColorModeValue("gray.400", "gray.600");
  const labelColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Box width="100%" position="relative">
      {/* Subtle grid lines */}
      <Box position="absolute" top="0" left="0" right="0" bottom="0" opacity={0.1}>
        {[0, 25, 50, 75, 100].map((pct) => (
          <Box key={pct} position="absolute" top={`${100 - pct}%`} left="0" right="0" height="1px" bg={gridColor} />
        ))}
      </Box>

      <Flex align="end" h={`${height}px`} gap={1} w="100%" position="relative" zIndex={1}>
        {data.map((v, i) => {
          const hPct = (v / max) * 100;
          const label = xLabels[i] ?? String(i);
          return (
            <Tooltip key={i} label={`${label}: ${formatNumber(v)}`} placement="top" hasArrow>
              <Box
                flex="1"
                h={`${hPct}%`}
                bg={color}
                borderRadius="2px"
                minH="4px"
                transition="all 200ms"
                _hover={{ bg: "#805AD5", transform: "scaleY(1.05)" }}
              />
            </Tooltip>
          );
        })}
      </Flex>

      {/* X labels */}
      <HStack spacing={1} mt={2} justify="space-between">
        {xLabels.map((l, i) => (
          <Text key={i} fontSize="xs" color={labelColor} textAlign="center" flex="1">
            {l}
          </Text>
        ))}
      </HStack>
    </Box>
  );
};

/* Cleaner Chart Tile */
const ChartTile: React.FC<{ data: ChartData; onRefresh?: (id: string) => void }> = ({ data, onRefresh }) => {
  const bg = useColorModeValue("white", "gray.800");
  const muted = useColorModeValue("gray.500", "gray.300");
  const statNumberColor = useColorModeValue("gray.800", "white");
  return (
    <Box bg={bg} borderRadius="lg" boxShadow="sm" p={5} minH="200px" display="flex" flexDirection="column">
      <HStack mb={3} align="center">
        <Stat>
          <StatLabel fontSize="sm" color={muted} fontWeight="500">
            {data.title}
          </StatLabel>
          <StatNumber fontSize="2xl" color={statNumberColor} fontWeight="bold">
            {data.value}
          </StatNumber>
        </Stat>
        <Spacer />
        <IconButton
          size="sm"
          aria-label="refresh"
          variant="ghost"
          icon={<RepeatIcon />}
          onClick={() => onRefresh?.(data.id)}
          _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
        />
      </HStack>

      <Divider mb={3} />

      <Box flex="1">
        <Histogram
          data={data.series.slice(-12)}
          labels={data.series.slice(-12).map((_, idx, arr) => `-${arr.length - idx}h`)}
          color="#6B46C1"
          height={100}
        />
      </Box>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const [charts, setCharts] = useState<ChartData[]>(() => sampleInitialData());
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshOne = (id: string) => {
    setCharts((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              value:
                typeof c.value === "string" && c.value.includes("$")
                  ? `$${(Math.random() * 20 + 10).toFixed(1)}k`
                  : typeof c.value === "string" && c.value.includes("%")
                  ? `${(Math.random() * 5 + 1).toFixed(1)}%`
                  : `${Math.round(Math.random() * 3000)}`,
              series: [...c.series.slice(1), Math.round(Math.random() * (c.id === "c4" ? 2000 : 150))],
            }
          : c
      )
    );
    setLastUpdated(new Date());
  };

  const refreshAll = () => {
    setCharts((prev) => prev.map((c) => ({ ...c, series: c.series.map(() => Math.round(Math.random() * (c.id === "c4" ? 2000 : 150))) })));
    setLastUpdated(new Date());
  };

  useEffect(() => {
    const t = setInterval(() => {
      setCharts((prev) => prev.map((c) => ({ ...c, series: [...c.series.slice(1), Math.round(Math.random() * 150)] })));
      setLastUpdated(new Date());
    }, 60_000); // Increased to 1 minute for less clutter
    return () => clearInterval(t);
  }, []);

  const info = useMemo(
    () => ({
      total: charts.length,
      updated: lastUpdated ? lastUpdated.toLocaleTimeString() : "never",
    }),
    [charts.length, lastUpdated]
  );

  const headingColor = useColorModeValue("gray.800", "gray.100"); // Add this for responsive text color

  return (
    <VStack align="stretch" spacing={6} p={6}>
      <HStack justify="space-between" align="center">
        <Heading size="lg" color={headingColor}>  
          Dashboard
        </Heading>
        <HStack spacing={3}>
          <Text color="gray.600" fontSize="sm">
            {info.total} metrics • updated: {info.updated}
          </Text>
          <Button size="sm" colorScheme="purple" onClick={refreshAll}>
            Refresh All
          </Button>
        </HStack>
      </HStack>

      {/* Reduced to 6 tiles for less clutter */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
        {charts.slice(0, 6).map((c) => (
          <ChartTile key={c.id} data={c} onRefresh={refreshOne} />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default Dashboard;
