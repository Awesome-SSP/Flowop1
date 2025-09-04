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

  return (
    <Box width="100%" position="relative">
      {/* Subtle grid lines */}
      <Box position="absolute" top="0" left="0" right="0" bottom="0" opacity={0.1}>
        {[0, 25, 50, 75, 100].map((pct) => (
          <Box key={pct} position="absolute" top={`${100 - pct}%`} left="0" right="0" height="1px" bg="gray.400" />
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
          <Text key={i} fontSize="xs" color="gray.500" textAlign="center" flex="1">
            {l}
          </Text>
        ))}
      </HStack>
    </Box>
  );
};

/* Heroic Glassmorphism Chart Tile */
const ChartTile: React.FC<{ data: ChartData; onRefresh?: (id: string) => void }> = ({ data, onRefresh }) => {
  const muted = useColorModeValue("gray.500", "gray.300");
  return (
    <Box 
      bg={useColorModeValue(
        "rgba(255, 255, 255, 0.25)", 
        "rgba(255, 255, 255, 0.08)"
      )}
      border={useColorModeValue(
        "1px solid rgba(255, 255, 255, 0.4)",
        "1px solid rgba(255, 255, 255, 0.2)"
      )}
      borderRadius="2xl" 
      boxShadow={useColorModeValue(
        "0 8px 32px rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
        "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
      )}
      p={6} 
      minH="220px" 
      display="flex" 
      flexDirection="column"
      style={{ 
        backdropFilter: "blur(20px) saturate(180%)",
        background: useColorModeValue(
          "linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.15) 100%)",
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)"
        ),
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      _hover={{
        boxShadow: useColorModeValue(
          "0 20px 60px rgba(31, 38, 135, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
          "0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
        ),
        transform: "translateY(-4px) scale(1.02)",
      }}
    >
      <HStack mb={4} align="center">
        <Stat>
          <StatLabel fontSize="sm" color={muted} fontWeight="600" letterSpacing="0.05em">
            {data.title}
          </StatLabel>
          <StatNumber 
            fontSize="3xl" 
            color={useColorModeValue("gray.800", "white")} 
            fontWeight="800"
            bgGradient={useColorModeValue(
              "linear(to-r, #667eea, #764ba2)",
              "linear(to-r, #ffb300, #ff6b6b)"
            )}
            bgClip="text"
          >
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
          bg={useColorModeValue("rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)")}
          _hover={{ 
            bg: useColorModeValue("rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.2)"),
            transform: "rotate(180deg)"
          }}
          borderRadius="xl"
          backdropFilter="blur(10px)"
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        />
      </HStack>

      <Divider mb={4} opacity={0.3} />

      <Box flex="1">
        <Histogram
          data={data.series.slice(-12)}
          labels={data.series.slice(-12).map((_, idx, arr) => `-${arr.length - idx}h`)}
          color={useColorModeValue("#667eea", "#ffb300")}
          height={120}
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
    <VStack align="stretch" spacing={8} p={8}>
      {/* Header with UGLY glassmorphism */}
      <Box
        bg="repeating-conic-gradient(from 0deg at 50% 50%, #ff1493 0deg, #9acd32 60deg, #ff4500 120deg, #8a2be2 180deg, #dc143c 240deg, #00ffff 300deg)"
        border="8px ridge #ff00ff"
        borderRadius="0px"
        p={8}
        boxShadow="inset 0 0 100px rgba(255, 0, 0, 0.9), 0 0 200px rgba(255, 255, 0, 0.8), 0 0 300px rgba(255, 0, 255, 0.7)"
        style={{ 
          backdropFilter: "blur(0px) saturate(1000%) contrast(500%)",
          background: "repeating-linear-gradient(0deg, #ff0000 0%, #00ff00 10%, #0000ff 20%, #ffff00 30%, #ff00ff 40%, #00ffff 50%)",
          fontFamily: "Impact, 'Arial Black', sans-serif",
          textTransform: "uppercase",
        }}
        animation="header-nightmare 0.5s ease-in-out infinite alternate"
        sx={{
          '@keyframes header-nightmare': {
            '0%': { 
              backgroundColor: '#ff1493',
              borderColor: '#00ff00',
              filter: 'brightness(200%) contrast(300%)',
            },
            '100%': { 
              backgroundColor: '#00ffff',
              borderColor: '#ff0000',
              filter: 'brightness(400%) contrast(500%)',
            },
          },
        }}
      >
        <HStack justify="space-between" align="center">
          <Heading 
            size="2xl" 
            color="#ff0000"
            textShadow="0 0 20px #ff00ff, 0 0 40px #00ffff, 0 0 60px #ffff00"
            fontWeight="900"
            style={{
              fontFamily: "Comic Sans MS, cursive",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
            }}
            animation="title-chaos 0.2s linear infinite alternate"
            sx={{
              '@keyframes title-chaos': {
                '0%': { 
                  color: '#ff0000',
                  textShadow: '0 0 20px #ff00ff',
                  transform: 'scale(1) rotate(0deg)',
                },
                '50%': { 
                  color: '#00ff00',
                  textShadow: '0 0 20px #ffff00',
                  transform: 'scale(1.1) rotate(2deg)',
                },
                '100%': { 
                  color: '#0000ff',
                  textShadow: '0 0 20px #ff0000',
                  transform: 'scale(0.9) rotate(-2deg)',
                },
              },
            }}
          >  
            💀 DASHBOARD OF DOOM 💀
          </Heading>
          <HStack spacing={4}>
            <Text color="#ffff00" fontSize="lg" fontWeight="900" textShadow="0 0 10px #ff00ff" style={{ fontFamily: "Impact, sans-serif" }}>
              🔥 {info.total} UGLY METRICS • DESTROYED: {info.updated} 🔥
            </Text>
            <Button 
              size="lg" 
              bg="repeating-linear-gradient(45deg, #ff0000, #ffff00 10px, #00ff00 20px, #00ffff 30px, #ff00ff 40px)"
              color="#ffffff"
              onClick={refreshAll}
              borderRadius="0px"
              border="5px solid #ff0000"
              _hover={{ 
                bg: "repeating-radial-gradient(circle, #ff1493, #9acd32 20px, #ff4500 40px)",
                transform: "scale(1.2) rotate(10deg)",
                boxShadow: "0 0 100px rgba(255, 0, 0, 1)"
              }}
              transition="all 0.1s linear"
              fontWeight="900"
              style={{
                fontFamily: "Impact, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
              }}
              animation="button-insanity 0.3s ease-in-out infinite alternate"
              sx={{
                '@keyframes button-insanity': {
                  '0%': { 
                    backgroundColor: '#ff0000',
                    borderColor: '#00ff00',
                  },
                  '100%': { 
                    backgroundColor: '#ff00ff',
                    borderColor: '#ffff00',
                  },
                },
              }}
            >
              🤢 REFRESH HELL 🤮
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Glassmorphism grid container */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={8}>
        {charts.slice(0, 6).map((c) => (
          <ChartTile key={c.id} data={c} onRefresh={refreshOne} />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default Dashboard;
