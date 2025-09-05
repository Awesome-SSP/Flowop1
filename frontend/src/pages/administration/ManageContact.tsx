import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  Grid,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  FormErrorMessage,
  VStack,
  HStack,
  Container,
  useToast,
  Text,
  IconButton,
  Divider,
  Spacer,
} from "@chakra-ui/react"
import { CalendarIcon, AddIcon, DeleteIcon, ArrowBackIcon } from "@chakra-ui/icons"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

type User = {
  id: string
  name: string
  role: string
  code: string
  email: string
  contactStatus: "active" | "inactive" | string
  pipewayStatus: "connected" | "disconnected" | string
  emails?: string[]
  addresses?: { line1: string[]; line2: string; city: string; state: string; zip: string }[]
  children?: string[]
}

/* validation schema (improved with stricter rules for production) */
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
  suffix: yup.string().trim().max(10, "Suffix too long"),
  title: yup.string().trim().max(50, "Title too long"),
  status: yup.string().oneOf(["Active", "Inactive"], "Invalid status").required("Status is required"),
  goesBy: yup.string().trim().max(50, "Goes by too long"),
  pronouns: yup.string().oneOf(["he/him", "she/her", "they/them"], "Invalid pronouns"),
  emails: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .lowercase()
        .email("Invalid email format")
        .max(254, "Email too long")
    )
    .min(1, "At least one email is required")
    .max(5, "Maximum 5 emails allowed")
    .test("unique-emails", "Emails must be unique", function (value) {
      if (!value) return true
      const unique = new Set(value.map((email) => (email ?? "").toLowerCase()))
      return unique.size === value.length
    }),
  officeNumber: yup
    .string()
    .required("Office number is required")
    .matches(/^\d{7,15}$/, "Office number must be 7-15 digits (no spaces or special chars)"),
  cellNumber: yup
    .string()
    .required("Cell number is required")
    .matches(/^\d{7,15}$/, "Cell number must be 7-15 digits (no spaces or special chars)"),
  officeCountryCode: yup.string().required("Office country code is required"),
  cellCountryCode: yup.string().required("Cell country code is required"),
  addresses: yup
    .array()
    .of(
      yup.object({
        line1: yup
          .array()
          .of(
            yup
              .string()
              .trim()
              .required("Address line 1 is required")
              .min(5, "Address line 1 too short")
              .max(100, "Address line 1 too long")
          )
          .min(1, "At least one address line 1 is required")
          .max(3, "Maximum 3 address lines"),
        line2: yup.string().trim().max(100, "Address line 2 too long"),
        city: yup
          .string()
          .trim()
          .required("City is required")
          .min(2, "City too short")
          .max(50, "City too long")
          .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/, "City contains invalid characters"),
        state: yup.string().required("State is required"),
        zip: yup
          .string()
          .required("Zip is required")
          .matches(/^\d{5}(\d{4})?$/, "Zip must be 5 or 9 digits"),
      })
    )
    .min(1, "At least one address is required")
    .max(3, "Maximum 3 addresses"),
  dateOfBirth: yup
    .date()
    .optional()
    .max(new Date(), "Date of birth cannot be in the future")
    .min(new Date(1900, 0, 1), "Date of birth too old"),
  workAnniversary: yup
    .date()
    .optional()
    .max(new Date(), "Work anniversary cannot be in the future")
    .min(new Date(1900, 0, 1), "Work anniversary too old"),
  maritalStatus: yup.string().oneOf(["single", "married", "divorced"], "Invalid marital status"),
  spouseName: yup
    .string()
    .trim()
    .max(50, "Spouse name too long")
    .when("maritalStatus", function (maritalStatus, schema) {
      // maritalStatus can be provided as a single value or an array depending on yup typings,
      // normalize to a single value before comparing to avoid the any[] vs string type issue.
      const ms = Array.isArray(maritalStatus) ? maritalStatus[0] : maritalStatus
      return ms === "married"
        ? (schema as yup.StringSchema).required("Spouse name is required for married status")
        : schema
    }),
  children: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .max(50, "Child name too long")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/, "Child name contains invalid characters")
    )
    .max(10, "Maximum 10 children"),
  college: yup.string().trim().max(100, "College name too long"),
  degree: yup.string().trim().max(100, "Degree too long"),
  priorEmployer: yup.string().trim().max(100, "Prior employer too long"),
  endDate: yup.date().optional().max(new Date(), "End date cannot be in the future"),
  notes: yup.string().trim().max(500, "Notes too long"),
  sportsTeam: yup.string().trim().max(100, "Sports team too long"),
  favorites: yup.string().trim().max(200, "Favorites too long"),
  group: yup
    .string()
    .trim()
    .required("Group is required")
    .min(2, "Group too short")
    .max(50, "Group too long")
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9' -]+$/, "Group contains invalid characters"),
  report: yup.string(),
})

const initialValues = {
  type: "",
  existingContacts: "",
  firstName: "",
  lastName: "",
  suffix: "",
  title: "",
  status: "Active",
  goesBy: "",
  pronouns: "",
  emails: [""],
  officeNumber: "",
  cellNumber: "",
  officeCountryCode: "+1",
  cellCountryCode: "+1",
  addresses: [{ line1: [""], line2: "", city: "", state: "", zip: "" }],
  dateOfBirth: "",
  workAnniversary: "",
  maritalStatus: "",
  spouseName: "",
  children: [""],
  college: "",
  degree: "",
  priorEmployer: "",
  endDate: "",
  notes: "",
  sportsTeam: "",
  favorites: "",
  group: "",
  report: "",
}

type ContactFormValues = typeof initialValues

type ManageContactProps = {
  mode?: "view" | "edit" | "create"
  visible?: boolean
  data?: User
  onClose?: () => void
  onSave?: (u: User) => void
}

export default function ManageContact({ mode = "create", visible = true, data, onClose = () => {}, onSave = () => {} }: ManageContactProps) {
  const toast = useToast()
  const navigate = useNavigate()
  const [values, setValues] = useState<ContactFormValues>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // helper to map incoming User -> form values (used by useEffect and reset)
  const mapDataToValues = (d?: User): ContactFormValues => {
    if (!d) return initialValues
    const nameParts = d.name.split(" ")
    return {
      ...initialValues,
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      title: d.role,
      emails: d.emails || [d.email],
      status: d.contactStatus === "active" ? "Active" : "Inactive",
      addresses: d.addresses || [{ line1: [""], line2: "", city: "", state: "", zip: "" }],
      children: d.children || [""],
    }
  }

  // Sync form with data when data changes or modal opens
  useEffect(() => {
    if (data) {
      setValues(mapDataToValues(data))
    } else if (mode === "create") {
      setValues(initialValues)
    }
  }, [data, mode, visible])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Sanitize numeric-like fields
    if (name === "cellNumber" || name === "officeNumber") {
      setValues((v) => ({ ...v, [name]: value.replace(/\D/g, "") }))
    } else {
      setValues((v) => ({ ...v, [name]: value }))
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleEmailChange = (index: number, value: string) => {
    setValues((v) => ({
      ...v,
      emails: v.emails.map((email, i) => (i === index ? value : email)),
    }))
    setErrors((prev) => ({ ...prev, emails: undefined }))
  }

  const addEmail = () => {
    setValues((v) => ({ ...v, emails: [...v.emails, ""] }))
  }

  const removeEmail = (index: number) => {
    setValues((v) => ({
      ...v,
      emails: v.emails.filter((_, i) => i !== index),
    }))
  }

  const handleAddressChange = (index: number, field: string, value: string) => {
    setValues((v) => ({
      ...v,
      addresses: v.addresses.map((addr, i) =>
        i === index ? { ...addr, [field]: value } : addr
      ),
    }))
    setErrors((prev) => ({ ...prev, addresses: undefined }))
  }

  const handleAddressLine1Change = (addrIndex: number, lineIndex: number, value: string) => {
    setValues((v) => ({
      ...v,
      addresses: v.addresses.map((addr, i) =>
        i === addrIndex ? { ...addr, line1: addr.line1.map((line, j) => (j === lineIndex ? value : line)) } : addr
      ),
    }))
    setErrors((prev) => ({ ...prev, addresses: undefined }))
  }

  const addAddressLine1 = (addrIndex: number) => {
    setValues((v) => ({
      ...v,
      addresses: v.addresses.map((addr, i) =>
        i === addrIndex ? { ...addr, line1: [...addr.line1, ""] } : addr
      ),
    }))
  }

  const removeAddressLine1 = (addrIndex: number, lineIndex: number) => {
    setValues((v) => ( {
      ...v,
      addresses: v.addresses.map((addr, i) =>
        i === addrIndex ? { ...addr, line1: addr.line1.filter((_, j) => j !== lineIndex) } : addr
      ),
    }))
  }

  const removeAddress = (index: number) => {
    setValues((v) => ({
      ...v,
      addresses: v.addresses.filter((_, i) => i !== index),
    }))
  }

  const handleChildChange = (index: number, value: string) => {
    setValues((v) => ({
      ...v,
      children: v.children.map((child, i) => (i === index ? value : child)),
    }))
    setErrors((prev) => ({ ...prev, children: undefined }))
  }

  const addChild = () => {
    setValues((v) => ({ ...v, children: [...v.children, ""] }))
  }

  const handleDateChange = (name: string, date: Date | null) => {
    setValues((v) => ({ ...v, [name]: date ? date.toISOString().split('T')[0] : "" }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    setErrors({})

    try {
      await validationSchema.validate(values, { abortEarly: false })
    } catch (err: any) {
      const fieldErrors: Partial<Record<keyof ContactFormValues, string>> = {}
      if (err.inner && Array.isArray(err.inner)) {
        err.inner.forEach((vi: any) => {
          if (vi.path) fieldErrors[vi.path as keyof ContactFormValues] = vi.message
        })
      } else if (err.path) {
        fieldErrors[err.path as keyof ContactFormValues] = err.message
      }
      setErrors(fieldErrors)
      setIsSubmitting(false)
      return
    }

    if (mode === "create") {
      // For create, submit to API
      const payload = {
        type: values.type,
        existingContacts: values.existingContacts,
        firstName: values.firstName,
        lastName: values.lastName,
        emails: values.emails,
        confirmEmail: values.emails[0],
        phoneNo: `${values.cellCountryCode} ${values.cellNumber}`,
        officeNo: `${values.officeCountryCode} ${values.officeNumber}`,
        role: values.title || null,
        userGroup: values.group || "None Selected",
        addresses: values.addresses,
        dateOfBirth: values.dateOfBirth || null,
        workAnniversary: values.workAnniversary || null,
        notes: values.notes || null,
        children: values.children,
      }

      try {
        const res = await fetch("/api/form/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          toast({
            title: "Submission failed",
            description: data.error || "Server error",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        } else {
          toast({
            title: "Contact registered",
            description: "Contact registered successfully",
            status: "success",
            duration: 4000,
            isClosable: true,
          })
          setValues(initialValues)
          onClose()
        }
      } catch (err) {
        console.error(err)
        toast({
          title: "Network error",
          description: "Network error while submitting form",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // For edit, map back to User and call onSave
      const updatedUser: User = {
        id: data?.id || "",
        name: `${values.firstName} ${values.lastName}`.trim(),
        role: values.title || "User",
        code: data?.code || "",
        email: values.emails[0] || "",
        contactStatus: values.status === "Active" ? "active" : "inactive",
        pipewayStatus: data?.pipewayStatus || "connected",
        emails: values.emails,
        addresses: values.addresses,
        children: values.children,
      }
      onSave(updatedUser)
      onClose()
    }
  }

  const isReadOnly = mode === "view"

  const handleReset = () => {
    // Reset form values: if creating, clear to initial; otherwise restore from provided data
    if (mode === "create") {
      setValues(initialValues)
    } else {
      setValues(mapDataToValues(data))
    }
    setErrors({})
    setIsSubmitting(false)
  }

  const CustomDateInput = React.forwardRef<HTMLButtonElement, any>(({ value, onClick }, ref) => (
    <Button
      ref={ref}
      onClick={onClick}
      variant="outline"
      size="xs"
      rightIcon={<CalendarIcon />}
      isDisabled={isReadOnly}
      w="full"
    >
      {value || "Select date"}
    </Button>
  ))

  return (
    <Container maxW="5xl" py={1}>
      <Box mb={1}>
        <HStack>
          <Heading size="sm" textAlign="center" flex="1">
            CONTACT REGISTRATION
          </Heading>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/notices")}
          >
            Back
          </Button>
        </HStack>
      </Box>

      <Box bg="whiteAlpha.900" p={2} borderRadius="md" boxShadow="md">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (mode === "edit" || mode === "create") {
              handleSave()
            } else {
              onClose()
            }
          }}
        >
          <VStack spacing={1} align="stretch">
            <Text fontSize="sm" fontWeight="bold" color="gray.600">Basic Information</Text>
            <Divider />

            <Grid templateColumns="repeat(2, 1fr)" gap={1} alignItems="center">
              <FormControl isInvalid={!!errors.type}>
                <FormLabel fontSize="xs" fontWeight="semibold">Type <span style={{color: 'red'}}>*</span></FormLabel>
                <Select name="type" value={values.type} onChange={handleChange} placeholder="Select type" isDisabled={isReadOnly} size="xs">
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </Select>
                <FormErrorMessage fontSize="xs">{errors.type}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">Existing Contacts</FormLabel>
                <Select name="existingContacts" value={values.existingContacts} onChange={handleChange} placeholder="Select" isDisabled={isReadOnly} size="xs">
                  <option value="contact1">Contact 1</option>
                  <option value="contact2">Contact 2</option>
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns="repeat(3, 1fr)" gap={1} alignItems="center">
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">Pronouns</FormLabel>
                <Select name="pronouns" value={values.pronouns} onChange={handleChange} placeholder="Select" isDisabled={isReadOnly} size="xs">
                  <option value="he/him">He/Him</option>
                  <option value="she/her">She/Her</option>
                  <option value="they/them">They/Them</option>
                </Select>
              </FormControl>

              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel fontSize="xs" fontWeight="semibold">First Name <span style={{color: 'red'}}>*</span></FormLabel>
                <Input name="firstName" value={values.firstName} onChange={handleChange} placeholder="First Name" isReadOnly={isReadOnly} size="xs" />
                <FormErrorMessage fontSize="xs">{errors.firstName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel fontSize="xs" fontWeight="semibold">Last Name <span style={{color: 'red'}}>*</span></FormLabel>
                <Input name="lastName" value={values.lastName} onChange={handleChange} placeholder="Last Name" isReadOnly={isReadOnly} size="xs" />
                <FormErrorMessage fontSize="xs">{errors.lastName}</FormErrorMessage>
              </FormControl>
            </Grid>

            <Grid templateColumns="repeat(2, 1fr)" gap={1} alignItems="center">
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">Suffix</FormLabel>
                <Input name="suffix" value={values.suffix} onChange={handleChange} placeholder="Suffix" isReadOnly={isReadOnly} size="xs" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">Title</FormLabel>
                <Input name="title" value={values.title} onChange={handleChange} placeholder="Title" isReadOnly={isReadOnly} size="xs" />
              </FormControl>
            </Grid>

            <Text fontSize="sm" fontWeight="bold" color="gray.600" mt={2}>Contact Details</Text>
            <Divider />

            <FormControl isInvalid={!!errors.emails}>
              <FormLabel fontSize="xs" fontWeight="semibold">Email Addresses <span style={{color: 'red'}}>*</span></FormLabel>
              <VStack spacing={1} align="stretch">
                {values.emails.map((email, index) => (
                  <HStack key={index} spacing={1} align="center">
                    <Input value={email} onChange={(e) => handleEmailChange(index, e.target.value)} placeholder="Email" isReadOnly={isReadOnly} size="xs" flex={1} maxW="300px" />
                    {values.emails.length > 1 && (
                      <IconButton icon={<DeleteIcon />} onClick={() => removeEmail(index)} aria-label="Remove email" size="xs" />
                    )}
                    {index === values.emails.length - 1 && (
                      <IconButton icon={<AddIcon />} onClick={addEmail} aria-label="Add email" size="xs" />
                    )}
                  </HStack>
                ))}
              </VStack>
              <FormErrorMessage fontSize="xs">{errors.emails}</FormErrorMessage>
            </FormControl>

            <Grid templateColumns="repeat(3, 1fr)" gap={1} alignItems="center">
              <FormControl isInvalid={!!errors.officeNumber}>
                <FormLabel fontSize="xs" fontWeight="semibold">Office Number <span style={{color: 'red'}}>*</span></FormLabel>
                <HStack spacing={1} align="center">
                  <Select name="officeCountryCode" value={values.officeCountryCode} onChange={handleChange} isDisabled={isReadOnly} size="xs" w="80px">
                    <option value="+1">US +1</option>
                    <option value="+91">India +91</option>
                    <option value="+44">UK +44</option>
                    <option value="+61">Australia +61</option>
                    <option value="+81">Japan +81</option>
                  </Select>
                  <Input name="officeNumber" value={values.officeNumber} onChange={handleChange} placeholder="Office Number" maxLength={10} isReadOnly={isReadOnly} size="xs" flex={1} />
                </HStack>
                <FormErrorMessage fontSize="xs">{errors.officeNumber}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.cellNumber}>
                <FormLabel fontSize="xs" fontWeight="semibold">Cell Number <span style={{color: 'red'}}>*</span></FormLabel>
                <HStack spacing={1} align="center">
                  <Select name="cellCountryCode" value={values.cellCountryCode} onChange={handleChange} isDisabled={isReadOnly} size="xs" w="80px">
                    <option value="+1">US +1</option>
                    <option value="+91">India +91</option>
                    <option value="+44">UK +44</option>
                    <option value="+61">Australia +61</option>
                    <option value="+81">Japan +81</option>
                  </Select>
                  <Input name="cellNumber" value={values.cellNumber} onChange={handleChange} placeholder="Cell Number" maxLength={10} isReadOnly={isReadOnly} size="xs" flex={1} />
                </HStack>
                <FormErrorMessage fontSize="xs">{errors.cellNumber}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.group}>
                <FormLabel fontSize="xs" fontWeight="semibold">Group <span style={{color: 'red'}}>*</span></FormLabel>
                <Input name="group" value={values.group} onChange={handleChange} placeholder="Group" isReadOnly={isReadOnly} size="xs" />
                <FormErrorMessage fontSize="xs">{errors.group}</FormErrorMessage>
              </FormControl>
            </Grid>

            <Text fontSize="sm" fontWeight="bold" color="gray.600" mt={2}>Address Information</Text>
            <Divider />

            <FormControl isInvalid={!!errors.addresses}>
              <FormLabel fontSize="xs" fontWeight="semibold">Addresses <span style={{color: 'red'}}>*</span></FormLabel>
              <VStack spacing={1} align="stretch">
                {values.addresses.map((address, index) => (
                  <Box key={index} border="1px solid #e2e8f0" p={1} borderRadius="md" minHeight="150px">
                    <Grid templateColumns="repeat(2, 1fr)" gap={1} alignItems="center">
                      <FormControl>
                        <FormLabel fontSize="xs">Address Line 1</FormLabel>
                        <VStack spacing={1} align="stretch">
                          {address.line1.map((line, lineIndex) => (
                            <HStack key={lineIndex} spacing={1} align="center">
                              <Input value={line} onChange={(e) => handleAddressLine1Change(index, lineIndex, e.target.value)} placeholder="Address Line 1" isReadOnly={isReadOnly} size="xs" flex={1} maxW="400px" />
                              {address.line1.length > 1 && (
                                <IconButton icon={<DeleteIcon />} onClick={() => removeAddressLine1(index, lineIndex)} aria-label="Remove line" size="xs" />
                              )}
                              {lineIndex === address.line1.length - 1 && (
                                <IconButton icon={<AddIcon />} onClick={() => addAddressLine1(index)} aria-label="Add address line 1" size="xs" />
                              )}
                            </HStack>
                          ))}
                        </VStack>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="xs">Address Line 2</FormLabel>
                        <Input value={address.line2} onChange={(e) => handleAddressChange(index, "line2", e.target.value)} placeholder="Address 2" isReadOnly={isReadOnly} size="xs" />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="xs">City</FormLabel>
                        <Input value={address.city} onChange={(e) => handleAddressChange(index, "city", e.target.value)} placeholder="City" isReadOnly={isReadOnly} size="xs" />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="xs">State</FormLabel>
                        <Select value={address.state} onChange={(e) => handleAddressChange(index, "state", e.target.value)} placeholder="Select" isDisabled={isReadOnly} size="xs">
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="xs">Zip</FormLabel>
                        <Input value={address.zip} onChange={(e) => handleAddressChange(index, "zip", e.target.value.replace(/\D/g, ""))} placeholder="Zip" isReadOnly={isReadOnly} size="xs" />
                      </FormControl>
                    </Grid>
                    {values.addresses.length > 1 && (
                      <IconButton icon={<DeleteIcon />} onClick={() => removeAddress(index)} aria-label="Remove address" size="xs" mt={1} alignSelf="flex-end" />
                    )}
                  </Box>
                ))}
              </VStack>
              <FormErrorMessage fontSize="xs">{errors.addresses}</FormErrorMessage>
            </FormControl>

            <Text fontSize="sm" fontWeight="bold" color="gray.600" mt={2}>Additional Details</Text>
            <Divider />

            <Grid templateColumns="repeat(2, 1fr)" gap={1} alignItems="center">
              <FormControl isInvalid={!!errors.status}>
                <FormLabel fontSize="xs" fontWeight="semibold">Status <span style={{color: 'red'}}>*</span></FormLabel>
                <Select name="status" value={values.status} onChange={handleChange} isDisabled={isReadOnly} size="xs">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
                <FormErrorMessage fontSize="xs">{errors.status}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">Report</FormLabel>
                <Select name="report" value={values.report} onChange={handleChange} placeholder="Select" isDisabled={isReadOnly} size="xs">
                  <option value="report1">Report 1</option>
                  <option value="report2">Report 2</option>
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns="repeat(5, 1fr)" gap={3} alignItems="start" mb={4}>
              <FormControl isInvalid={!!errors.dateOfBirth}>
                <FormLabel fontSize="xs" fontWeight="semibold">Date Of Birth</FormLabel>
                <Box position="relative" zIndex={9999}>
                  <DatePicker
                    selected={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
                    onChange={(date) => handleDateChange("dateOfBirth", date)}
                    dateFormat="yyyy-MM-dd"
                    customInput={<CustomDateInput />}
                    disabled={isReadOnly}
                    popperPlacement="bottom-start"
                  />
                </Box>
                <FormErrorMessage fontSize="xs">{errors.dateOfBirth}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">Work Anniversary</FormLabel>
                <Box position="relative" zIndex={9998}>
                  <DatePicker
                    selected={values.workAnniversary ? new Date(values.workAnniversary) : null}
                    onChange={(date) => handleDateChange("workAnniversary", date)}
                    dateFormat="yyyy-MM-dd"
                    customInput={<CustomDateInput />}
                    disabled={isReadOnly}
                    popperPlacement="bottom-start"
                  />
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">Marital Status</FormLabel>
                <Select name="maritalStatus" value={values.maritalStatus} onChange={handleChange} placeholder="Select" isDisabled={isReadOnly} size="xs">
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">Spouse Name</FormLabel>
                <Input name="spouseName" value={values.spouseName} onChange={handleChange} placeholder="Spouse Name" isReadOnly={isReadOnly} size="xs" />
              </FormControl>

              <FormControl isInvalid={!!errors.children}>
                <FormLabel fontSize="xs" fontWeight="semibold">Children's Names</FormLabel>
                <VStack spacing={1} align="stretch">
                  {values.children.map((child, index) => (
                    <HStack key={index} spacing={1} align="center">
                      <Input value={child} onChange={(e) => handleChildChange(index, e.target.value)} placeholder="Child's Name" isReadOnly={isReadOnly} size="xs" flex={1} maxW="200px" />
                      {values.children.length > 1 && (
                        <IconButton icon={<DeleteIcon />} onClick={() => setValues((v) => ({ ...v, children: v.children.filter((_, i) => i !== index) })) } aria-label="Remove child" size="xs" />
                      )}
                      {index === values.children.length - 1 && (
                        <IconButton icon={<AddIcon />} onClick={addChild} aria-label="Add child" size="xs" />
                      )}
                    </HStack>
                  ))}
                </VStack>
                <FormErrorMessage fontSize="xs">{errors.children}</FormErrorMessage>
              </FormControl>
            </Grid>

            <Grid templateColumns="repeat(4, 1fr)" gap={1} alignItems="center">
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">College</FormLabel>
                <Input name="college" value={values.college} onChange={handleChange} placeholder="College" isReadOnly={isReadOnly} size="xs" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">Degree</FormLabel>
                <Input name="degree" value={values.degree} onChange={handleChange} placeholder="Degree" isReadOnly={isReadOnly} size="xs" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">Prior Employer</FormLabel>
                <Input name="priorEmployer" value={values.priorEmployer} onChange={handleChange} placeholder="Prior Employer" isReadOnly={isReadOnly} size="xs" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">End Date</FormLabel>
                <Box position="relative" zIndex={9997}>
                  <DatePicker
                    selected={values.endDate ? new Date(values.endDate) : null}
                    onChange={(date) => handleDateChange("endDate", date)}
                    dateFormat="yyyy-MM-dd"
                    customInput={<CustomDateInput />}
                    disabled={isReadOnly}
                    popperPlacement="bottom-start"
                  />
                </Box>
              </FormControl>
            </Grid>

            <Grid templateColumns="repeat(3, 1fr)" gap={1} alignItems="center">
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">Notes</FormLabel>
                <Textarea name="notes" value={values.notes} onChange={handleChange} rows={2} isReadOnly={isReadOnly} size="xs" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">Sports Team</FormLabel>
                <Input name="sportsTeam" value={values.sportsTeam} onChange={handleChange} placeholder="Sports Team" isReadOnly={isReadOnly} size="xs" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="semibold">Favorites</FormLabel>
                <Input name="favorites" value={values.favorites} onChange={handleChange} placeholder="Favorites" isReadOnly={isReadOnly} size="xs" />
              </FormControl>
            </Grid>

            <Box textAlign="center" pt={1}>
              <HStack spacing={2} justify="center">
                {/* Reset button */}
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  size="xs"
                >
                  Reset
                </Button>

                {/* Register/Save button */}
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="xs"
                  px={3}
                  isLoading={isSubmitting}
                >
                  {mode === "create" ? "Register" : "Save Changes"}
                </Button>
              </HStack>
            </Box>
          </VStack>
        </form>
      </Box>
    </Container>
  )
}
