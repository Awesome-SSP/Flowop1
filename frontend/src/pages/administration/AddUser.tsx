import React, { useState } from "react"
import {
  Box,
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  HStack,
  Text,
  useToast,
  Grid,
  Container,
  Flex,
} from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"

const validationSchema = yup.object().shape({
  type: yup.string().oneOf(["individual", "company"], "Invalid type").required("Type is required"),
  existingContacts: yup.string(),
  firstName: yup
    .string()
    .trim()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/, "First name contains invalid characters (letters, spaces, hyphens, apostrophes only)"),
  lastName: yup
    .string()
    .trim()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/, "Last name contains invalid characters (letters, spaces, hyphens, apostrophes only)")
    .test("not-equal-first", "First and last name cannot be the same", function (value) {
      const { firstName } = this.parent
      if (!firstName || !value) return true
      return firstName.trim().toLowerCase() !== value.trim().toLowerCase()
    }),
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Enter a valid email address")
    .max(254, "Email too long")
    .required("Email is required"),
  confirmEmail: yup
    .string()
    .trim()
    .lowercase()
    .oneOf([yup.ref("email")], "Emails must match")
    .required("Confirm email is required"),
  countryCode: yup.string().required("Country code is required"),
  phoneNo: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^\d{7,15}$/, "Phone number must be 7-15 digits (no spaces or special chars)")
    .min(7, "Phone number too short")
    .max(10, "Phone number too long"),
  role: yup.string().oneOf(["admin", "manager", "user"], "Invalid role").required("Role is required"),
  userGroup: yup
    .string()
    .trim()
    .required("User group is required")
    .min(2, "User group too short")
    .max(100, "User group too long")
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9' -]+$/, "User group contains invalid characters"),
})

export default function AddUser({ onClose }: { onClose?: () => void }) {
  const toast = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    type: "",
    existingContacts: "",
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    countryCode: "+1", // default to US
    phoneNo: "",
    role: "",
    userGroup: "None Selected",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
    setErrors((p) => ({ ...p, [name]: undefined }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((p) => ({ ...p, [name]: value }))
    setErrors((p) => ({ ...p, [name]: undefined }))
  }

  const handleReset = () => {
    setFormData({
      type: "",
      existingContacts: "",
      firstName: "",
      lastName: "",
      email: "",
      confirmEmail: "",
      countryCode: "+1",
      phoneNo: "",
      role: "",
      userGroup: "None Selected",
    })
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      await validationSchema.validate(formData, { abortEarly: false })
      toast({ title: "User registered successfully", status: "success", duration: 3000, isClosable: true })
      handleReset()
      onClose?.()
    } catch (err: any) {
      const fieldErrors: Partial<Record<keyof typeof formData, string>> = {}
      if (err.inner && Array.isArray(err.inner)) {
        err.inner.forEach((vi: any) => {
          if (vi.path) fieldErrors[vi.path as keyof typeof formData] = vi.message
        })
      } else if (err.path) {
        fieldErrors[err.path as keyof typeof formData] = err.message
      }
      setErrors(fieldErrors)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container maxW="7xl" py={6}>
      <Box bg="white" borderRadius="md" p={{ base: 4, md: 6 }} boxShadow="md">
        {/* Header */}
        <Flex align="center" justify="space-between" mb={6}>
          <Text fontSize="xl" fontWeight="bold">
            Add New User
          </Text>
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/notices")}
          >
            Back
          </Button>
        </Flex>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <VStack spacing={5} align="stretch">
            {/* Row 1 */}
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={5} alignItems="center">
              <FormControl isInvalid={!!errors.type}>
                <FormLabel fontSize="sm">
                  Type <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={(e) => handleSelectChange("type", e.target.value)}
                  size="sm"
                  h="40px"
                >
                  <option value="">Select</option>
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </Select>
                <FormErrorMessage>{errors.type}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Existing Contacts</FormLabel>
                <Select
                  name="existingContacts"
                  value={formData.existingContacts}
                  onChange={(e) => handleSelectChange("existingContacts", e.target.value)}
                  size="sm"
                  h="40px"
                >
                  <option value="">Select</option>
                  <option value="contact1">Contact 1</option>
                  <option value="contact2">Contact 2</option>
                </Select>
              </FormControl>

              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel fontSize="sm">
                  First Name <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  size="sm"
                  h="40px"
                />
                <FormErrorMessage>{errors.firstName}</FormErrorMessage>
              </FormControl>
            </Grid>

            {/* Row 2 */}
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={5} alignItems="center">
              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel fontSize="sm">
                  Last Name <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} size="sm" h="40px" />
                <FormErrorMessage>{errors.lastName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontSize="sm">
                  Email <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} size="sm" h="40px" />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmEmail}>
                <FormLabel fontSize="sm">
                  Confirm Email <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Input name="confirmEmail" type="email" placeholder="Confirm Email" value={formData.confirmEmail} onChange={handleChange} size="sm" h="40px" />
                <FormErrorMessage>{errors.confirmEmail}</FormErrorMessage>
              </FormControl>
            </Grid>

            {/* Row 3 */}
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={5} alignItems="center">
              <FormControl isInvalid={!!errors.phoneNo || !!errors.countryCode}>
                <FormLabel fontSize="sm">
                  Phone No <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <HStack spacing={2}>
                  <Select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={(e) => handleSelectChange("countryCode", e.target.value)}
                    size="sm"
                    h="40px"
                    w="80px"
                  >
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+91">+91</option>
                    {/* Add more as needed */}
                  </Select>
                  <Input
                    name="phoneNo"
                    placeholder="e.g. 7700123456"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    size="sm"
                    h="40px"
                    flex="1"
                  />
                </HStack>
                <FormErrorMessage>{errors.countryCode || errors.phoneNo}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.role}>
                <FormLabel fontSize="sm">
                  Role <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Select name="role" value={formData.role} onChange={(e) => handleSelectChange("role", e.target.value)} size="sm" h="40px">
                  <option value="">Select</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </Select>
                <FormErrorMessage>{errors.role}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">User Group</FormLabel>
                <Input value={formData.userGroup} isReadOnly bg="gray.50" size="sm" h="40px" />
              </FormControl>
            </Grid>

            {/* Buttons */}
            <HStack justify="center" spacing={6} pt={4}>
              <Button
                type="submit"
                colorScheme="blue"
                bg="blue.900"
                _hover={{ bg: "blue.800" }}
                px={8}
                isLoading={isSubmitting}
                size="sm"
              >
                Register
              </Button>
              <Button
                type="button"
                variant="outline"
                colorScheme="red"
                onClick={handleReset}
                px={8}
                size="sm"
              >
                Reset
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Container>
  )
}
