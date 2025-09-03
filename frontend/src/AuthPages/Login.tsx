import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg-image-1.webp';
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
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
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

      // store token and user info if provided, then navigate to dashboard
      if (json?.token) {
        try {
          localStorage.setItem('token', json.token);
          // store user info if available in response
          if (json.user) {
            localStorage.setItem('userInfo', JSON.stringify({
              firstName: json.user.firstName || 'Admin',
              lastName: json.user.lastName || 'User', 
              email: json.user.email || email,
              role: json.user.role || 'Administrator'
            }));
          }
        } catch {
          // ignore storage errors
        }
      }

      showToast({ title: 'Login successful', description: 'You are now signed in', status: 'success', duration: 2000, isClosable: true });
      setLoading(false);
      navigate('/auth', { replace: true });
      return;
    } catch (e) {
      setLoading(false);
      showToast({ title: 'Error', description: 'Unable to reach server', status: 'error', duration: 4000, isClosable: true });
    }
  };

  const isFormValid = email && password && !errors.email && !errors.password;

  return (
    <Flex minH="100vh" align="stretch">
      {/* Left: Login Panel */}
      <Box
        w={{ base: '100%', md: '30%' }}
        bg="white"
        boxShadow="sm"
        borderRightWidth={{ md: '1px' }}
        borderColor="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={10}
        py={14}
      >
        <Box w="full" maxW="320px">
          <Heading
            as="h1"
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="bold"
            color="gray.900"
            mb={3}
            textAlign="center"
          >
            Flowops
          </Heading>

          <Text
            fontSize={{ base: 'sm', md: 'md' }}
            color="gray.800"
            mb={8}
            textAlign="center"
            fontWeight="500"
          >
            Admin Login
          </Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={3} align="stretch">
              {/* Email */}
              <FormControl isRequired isInvalid={Boolean(errors.email)}>
                <FormLabel fontSize="sm" color="gray.800" fontWeight="500">
                  Email
                </FormLabel>
                <Input
                  name="email"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  size="md"
                  variant="flushed"
                  color="gray.900"
                  borderBottom="1px solid"
                  borderColor={errors.email ? 'red.600' : 'gray.300'}
                  _placeholder={{ color: 'gray.500' }}
                  _focus={{
                    borderColor: errors.email ? 'red.600' : 'blue.600',
                    boxShadow: 'none',
                    py: 1,
                  }}
                  py={2}
                  fontSize="sm"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              {/* Password */}
              <FormControl isRequired isInvalid={Boolean(errors.password)}>
                <FormLabel fontSize="sm" color="gray.800" fontWeight="500">
                  Password
                </FormLabel>
                <HStack spacing={4}>
                  <Input
                    name="password"
                    placeholder="Your password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    size="md"
                    variant="flushed"
                    color="gray.900"
                    borderBottom="1px solid"
                    borderColor={errors.password ? 'red.600' : 'gray.300'}
                    _placeholder={{ color: 'gray.500' }}
                    _focus={{
                      borderColor: errors.password ? 'red.600' : 'blue.600',
                      boxShadow: 'none',
                      py: 1,
                    }}
                    py={2}
                    fontSize="sm"
                    flex={1}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    color="gray.700"
                    _hover={{ color: 'purple.500', bg: 'transparent' }}
                    px={2}
                    h="auto"
                    minW="auto"
                    fontSize="sm"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </HStack>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                isLoading={loading}
                disabled={!isFormValid}
                size="lg"
                colorScheme="purple"
                width="full"
                mt={4}
                py={5}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>

      {/* Right: Image Panel */}
      <Box
        w={{ base: 0, md: '70%' }}
        display={{ base: 'none', md: 'block' }}
        backgroundImage={`url(${bgImage})`}
        backgroundSize="cover"
        backgroundPosition="center"
        position="relative"
      />
      <Toaster />
    </Flex>
  );
};

export default Login;
