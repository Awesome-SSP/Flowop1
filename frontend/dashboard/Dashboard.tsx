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
  Tooltip, // added
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
    { id: "c7", title: "Orders", value: "892", series: makeSeries(12, 500) },
    { id: "c8", title: "Sessions", value: "2.3k", series: makeSeries(12, 150) },
    { id: "c9", title: "Bounce Rate", value: "22%", series: makeSeries(12, 100) },
  ];
};

/* Histogram - bar chart with axes and tooltips */
const Histogram: React.FC<{
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  yTicks?: number;
}> = ({ data, labels = [], color = "#6B46C1", height = 96, yTicks = 4 }) => {
  const max = Math.max(...data) || 1;

  const formatNumber = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
    return String(v);
  };

  // build Y tick values (from max down to 0)
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => {
    const pct = (yTicks - i) / yTicks; // descending
    return { pct, value: Math.round(pct * max) };
  });

  // prepare x labels for bars (pad if missing)
  const xLabels = labels.length >= data.length ? labels.slice(-data.length) : data.map((_, i) => labels[i] ?? `T-${data.length - i}`);

  return (
    <Box width="100%">
      <Flex align="stretch">
        {/* Y axis (left) */}
        <VStack spacing={0} align="end" mr={3} minW="48px" height={`${height}px`} justifyContent="space-between">
          {ticks.map((t, idx) => (
            <Text key={idx} fontSize="xs" color="gray.500" userSelect="none">
              {formatNumber(t.value)}
            </Text>
          ))}
        </VStack>

        {/* Bars area */}
        <Box flex="1">
          <Flex align="end" h={`${height}px`} gap={2} w="100%" aria-hidden>
            {data.map((v, i) => {
              const hPct = (v / max) * 100;
              const label = xLabels[i] ?? String(i);
              return (
                <Tooltip key={i} label={`${label} — ${formatNumber(v)}`} placement="top" hasArrow openDelay={100}>
                  <Box
                    flex="1"
                    h={`${hPct}%`}
                    bg={color}
                    borderRadius="4px"
                    opacity={0.95}
                    transition="all 120ms"
                    _hover={{ transform: "translateY(-4px)", opacity: 1 }}
                    aria-label={`${label}: ${v}`}
                  />
                </Tooltip>
              );
            })}
          </Flex>

          {/* X axis labels */}
          <HStack spacing={2} mt={2} justify="space-between" align="center" px={0}>
            {xLabels.map((l, i) => (
              <Text key={i} fontSize="xs" color="gray.500" textAlign="center" flex="1" noOfLines={1}>
                {l}
              </Text>
            ))}
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
};

/* Tile that shows only the histogram (no sparkline) */
const ChartTile: React.FC<{ data: ChartData; onRefresh?: (id: string) => void }> = ({ data, onRefresh }) => {
  const bg = useColorModeValue("white", "gray.700");
  const muted = useColorModeValue("gray.500", "gray.300");
  return (
    <Box bg={bg} borderRadius="md" boxShadow="sm" p={4} minH="160px" display="flex" flexDirection="column" justifyContent="space-between">
      <HStack mb={2} align="start">
        <VStack align="start" spacing={0}>
          <Stat>
            <StatLabel fontSize="xs" color={muted}>
              {data.title}
            </StatLabel>
            <StatNumber fontSize="lg" color="gray.800">
              {data.value}
            </StatNumber>
          </Stat>
        </VStack>
        <Spacer />
        <IconButton
          size="sm"
          aria-label="refresh"
          variant="ghost"
          icon={<RepeatIcon />}
          onClick={() => onRefresh?.(data.id)}
        />
      </HStack>

      {/* ONLY histogram visual */}
      <Box mt={2} flex="1" display="flex" flexDirection="column" justifyContent="flex-end">
        <Histogram
          data={data.series.slice(-12)}
          labels={data.series.slice(-12).map((_, idx, arr) => `-${arr.length - idx}h`)} // simple relative labels
          color="#6B46C1"
          height={96}
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
    }, 30_000);
    return () => clearInterval(t);
  }, []);

  const info = useMemo(
    () => ({
      total: charts.length,
      updated: lastUpdated ? lastUpdated.toLocaleTimeString() : "never",
    }),
    [charts.length, lastUpdated]
  );

  return (
    <VStack align="stretch" spacing={6} p={6}>
      <HStack justify="space-between" align="center">
        <Heading size="lg">Dashboard</Heading>
        <HStack spacing={3}>
          <Text color="gray.600" fontSize="sm">
            {info.total} charts • updated: {info.updated}
          </Text>
          <Button size="sm" onClick={refreshAll}>
            Refresh all
          </Button>
        </HStack>
      </HStack>

      {/* show 9 histogram-only tiles */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
        {charts.slice(0, 9).map((c) => (
          <ChartTile key={c.id} data={c} onRefresh={refreshOne} />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default Dashboard;
