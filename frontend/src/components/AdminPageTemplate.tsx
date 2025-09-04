import React from "react";
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

interface AdminPageProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const AdminPageTemplate: React.FC<AdminPageProps> = ({ title, description, children }) => {
  const textColor = useColorModeValue("gray.700", "gray.200");
  const muted = useColorModeValue("gray.500", "gray.400");
  const cardBg = useColorModeValue("rgba(255,255,255,0.9)", "rgba(26,26,46,0.9)");
  const borderColor = useColorModeValue("rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)");

  return (
    <Box h="100%" display="flex" flexDirection="column" p={6}>
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
          {title}
        </Heading>
        <Text color={muted} fontSize="lg">
          {description}
        </Text>
      </Box>

      {/* Content Container */}
      <Box
        bg={cardBg}
        borderRadius="2xl"
        boxShadow="0 8px 32px rgba(0,0,0,0.1)"
        border="1px solid"
        borderColor={borderColor}
        backdropFilter="blur(20px)"
        flex="1"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <Box flex="1" overflow="auto" p={6}>
          {children || (
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              h="100%" 
              textAlign="center"
            >
              <Box>
                <Text fontSize="6xl" opacity="0.3" mb={4}>🚧</Text>
                <Text color={muted} fontSize="lg">
                  This page is under construction
                </Text>
                <Text color={muted} fontSize="sm" mt={2}>
                  Content will be available soon
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPageTemplate;
