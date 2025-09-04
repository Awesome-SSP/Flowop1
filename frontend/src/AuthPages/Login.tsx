import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg-image-2.webp';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  HStack,
  Text,
  VStack,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowRight } from 'react-icons/fi';
import * as yup from 'yup';

type FieldErrors = { email?: string; password?: string };

const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email')
    .test('no-trim', 'Email must not have leading or trailing spaces', (v) => v === v?.trim()),
  password: yup.string().required('Password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (opts: {
    title?: string;
    description?: string;
    status?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    isClosable?: boolean;
  }) => {
    const t = toaster as any;
    const fn = t?.push ?? t?.show ?? t?.add ?? t?.toast;
    if (typeof fn === 'function') {
      try {
        fn(opts);
      } catch {
        t?.push?.(opts.title ?? '', opts.description ?? '');
      }
    } else {
      console.log('toast', opts);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    try {
      await schema.validate({ email, password }, { abortEarly: false });
    } catch (err: any) {
      const next: FieldErrors = {};
      if (Array.isArray(err.inner)) {
        err.inner.forEach((vi: any) => {
          if (vi.path) next[vi.path as keyof FieldErrors] = vi.message;
        });
      } else if (err.path) {
        next[err.path as keyof FieldErrors] = err.message;
      }
      setErrors(next);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = null;
      }

      if (!res.ok) {
        const msg = json?.error ?? json?.message ?? res.statusText ?? 'Login failed';
        showToast({ title: 'Login failed', description: msg, status: 'error', duration: 4000, isClosable: true });
        setLoading(false);
        return;
      }

      if (json && json.ok === false) {
        showToast({ title: 'Login failed', description: json.error ?? 'Invalid credentials', status: 'error', duration: 4000, isClosable: true });
        setLoading(false);
        return;
      }

      if (json?.token) {
        try {
          localStorage.setItem('token', json.token);
          if (json.user) {
            localStorage.setItem('userInfo', JSON.stringify(json.user));
          }
        } catch {}
      }

      showToast({ title: 'Login successful', description: 'You are now signed in', status: 'success', duration: 2000, isClosable: true });
      setLoading(false);
      navigate('/dashboard', { replace: true });
      return;
    } catch (e) {
      setLoading(false);
      showToast({ title: 'Error', description: 'Unable to reach server', status: 'error', duration: 4000, isClosable: true });
    }
  };

  const isFormValid = email && password && !errors.email && !errors.password;

  return (
    <Flex minH="100vh" position="relative" overflow="hidden">
      {/* Animated Background */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        backgroundImage={`url(${bgImage})`}
        backgroundSize="cover"
        backgroundPosition="center"
        filter="brightness(0.7)"
        zIndex={1}
      />
      
      {/* Gradient Overlay */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgGradient={useColorModeValue(
          "linear(135deg, rgba(37,99,235,0.9) 0%, rgba(124,58,237,0.8) 50%, rgba(219,39,119,0.7) 100%)",
          "linear(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 50%, rgba(51,65,85,0.85) 100%)"
        )}
        zIndex={2}
      />
      
      {/* Floating Particles Effect */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity={0.3}
        zIndex={3}
        bgImage={`radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 50% 10%, rgba(124,58,237,0.3) 0%, transparent 40%),
                  radial-gradient(circle at 10% 80%, rgba(37,99,235,0.2) 0%, transparent 30%)`}
      />
      
      {/* Main Content */}
      <Flex
        w="100%"
        align="center"
        justify="center"
        position="relative"
        zIndex={10}
        px={{ base: 2, sm: 4, md: 8 }}
        py={{ base: 2, sm: 6, md: 12 }}
      >
        <Box
          w={{ base: "100%", sm: "340px", md: "360px", lg: "380px" }}
          bg={useColorModeValue("whiteAlpha.900", "gray.900")}
          boxShadow="0 4px 16px rgba(102,126,234,0.10)"
          borderRadius="2xl"
          p={{ base: 3, sm: 6, md: 8 }}
          m={{ base: 0, sm: 2, md: 4 }}
        >
          {/* Header Section */}
          <VStack spacing={4} mb={6}>
            {/* Logo */}
            <Flex align="center" justify="center">
              <Box
                w={12}
                h={12}
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                borderRadius="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 4px 12px rgba(102,126,234,0.3)"
              >
                <Icon as={FiShield} boxSize={6} color="white" />
              </Box>
            </Flex>

            {/* Title */}
            <VStack spacing={1}>
              <Heading
                as="h1"
                fontSize={{ base: "2xl", sm: "3xl" }}
                fontWeight="800"
                bgGradient="linear(135deg, #667eea 0%, #764ba2 100%)"
                bgClip="text"
                textAlign="center"
                letterSpacing="-0.02em"
              >
                Flowops
              </Heading>
              <Text
                fontSize={{ base: "sm", sm: "md" }}
                color={useColorModeValue("gray.600", "gray.400")}
                textAlign="center"
                fontWeight="500"
              >
                Welcome back to your dashboard
              </Text>
            </VStack>
          </VStack>

          {/* Form Section */}
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              {/* Email Field */}
              <FormControl isRequired isInvalid={Boolean(errors.email)}>
                <FormLabel
                  fontSize="sm"
                  color={useColorModeValue("gray.700", "gray.300")}
                  fontWeight="600"
                  mb={2}
                >
                  Email Address
                </FormLabel>
                <InputGroup size="md">
                  <InputLeftElement pointerEvents="none">
                    <Icon
                      as={FiMail}
                      color={errors.email ? "red.400" : useColorModeValue("gray.400", "gray.500")}
                      boxSize={4}
                    />
                  </InputLeftElement>
                  <Input
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    bg={useColorModeValue("white", "gray.800")}
                    border="2px solid"
                    borderColor={errors.email ? "red.400" : useColorModeValue("gray.200", "gray.600")}
                    borderRadius="lg"
                    color={useColorModeValue("gray.900", "white")}
                    fontSize="sm"
                    _placeholder={{
                      color: useColorModeValue("gray.500", "gray.400")
                    }}
                    _focus={{
                      borderColor: errors.email ? "red.400" : "#667eea",
                      boxShadow: errors.email ? "0 0 0 3px rgba(239,68,68,0.1)" : "0 0 0 3px rgba(102,126,234,0.1)",
                    }}
                    pl={10}
                    py={4}
                    transition="all 0.2s ease"
                  />
                </InputGroup>
                <FormErrorMessage mt={1} fontSize="xs">{errors.email}</FormErrorMessage>
              </FormControl>

              {/* Password Field */}
              <FormControl isRequired isInvalid={Boolean(errors.password)}>
                <FormLabel
                  fontSize="sm"
                  color={useColorModeValue("gray.700", "gray.300")}
                  fontWeight="600"
                  mb={2}
                >
                  Password
                </FormLabel>
                <InputGroup size="md">
                  <InputLeftElement pointerEvents="none">
                    <Icon
                      as={FiLock}
                      color={errors.password ? "red.400" : useColorModeValue("gray.400", "gray.500")}
                      boxSize={4}
                    />
                  </InputLeftElement>
                  <Input
                    name="password"
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    bg={useColorModeValue("white", "gray.800")}
                    border="2px solid"
                    borderColor={errors.password ? "red.400" : useColorModeValue("gray.200", "gray.600")}
                    borderRadius="lg"
                    color={useColorModeValue("gray.900", "white")}
                    fontSize="sm"
                    _placeholder={{
                      color: useColorModeValue("gray.500", "gray.400")
                    }}
                    _focus={{
                      borderColor: errors.password ? "red.400" : "#667eea",
                      boxShadow: errors.password ? "0 0 0 3px rgba(239,68,68,0.1)" : "0 0 0 3px rgba(102,126,234,0.1)",
                    }}
                    pl={10}
                    pr={10}
                    py={4}
                    transition="all 0.2s ease"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      icon={<Icon as={showPassword ? FiEyeOff : FiEye} boxSize={4} />}
                      variant="ghost"
                      color={useColorModeValue("gray.500", "gray.400")}
                      _hover={{
                        color: useColorModeValue("gray.700", "gray.200"),
                        bg: "transparent"
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage mt={1} fontSize="xs">{errors.password}</FormErrorMessage>
              </FormControl>

              {/* Forgot Password Link */}
              <Flex justify="flex-end">
                <Link
                  fontSize="xs"
                  color="#667eea"
                  fontWeight="500"
                  _hover={{
                    color: "#764ba2",
                    textDecoration: "none"
                  }}
                >
                  Forgot password?
                </Link>
              </Flex>

              {/* Login Button */}
              <Button
                type="submit"
                isLoading={loading}
                disabled={!isFormValid}
                size="md"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
                width="full"
                borderRadius="lg"
                py={4}
                fontSize="sm"
                fontWeight="600"
                rightIcon={<Icon as={FiArrowRight} boxSize={4} />}
                _hover={{
                  bg: "linear-gradient(135deg, #5a6fd8 0%, #6b46a3 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(102,126,234,0.2)"
                }}
                _active={{
                  transform: "translateY(0px)"
                }}
                _disabled={{
                  opacity: 0.6,
                  cursor: "not-allowed",
                  _hover: {
                    transform: "none",
                    boxShadow: "none"
                  }
                }}
                transition="all 0.2s ease"
                boxShadow="0 2px 8px rgba(102,126,234,0.15)"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              {/* Security Notice */}
              <Box
                bg={useColorModeValue("blue.50", "blue.900")}
                borderRadius="md"
                p={3}
                border="1px solid"
                borderColor={useColorModeValue("blue.200", "blue.700")}
                mt={2}
              >
                <HStack spacing={2}>
                  <Icon as={FiShield} color="blue.500" boxSize={4} />
                  <VStack align="start" spacing={0}>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color={useColorModeValue("blue.800", "blue.200")}
                    >
                      Secure Access
                    </Text>
                    <Text
                      fontSize="xs"
                      color={useColorModeValue("blue.600", "blue.300")}
                    >
                      Your connection is encrypted and secure
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </VStack>
          </form>
        </Box>
      </Flex>
      
      <Toaster />
    </Flex>
  );
};

export default Login;
