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
} from "@chakra-ui/react"
import { CalendarIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons"
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

/* validation schema (improved with more rules) */
const validationSchema = yup.object().shape({
  type: yup.string().required("Type is required"),
  firstName: yup.string().trim().required("First name is required").min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .trim()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .test("not-equal-first", "First and last name cannot be the same", function (value) {
      const { firstName } = this.parent
      if (!firstName || !value) return true
      return firstName.trim().toLowerCase() !== value.trim().toLowerCase()
    }),
  status: yup.string().required("Status is required"),
  group: yup.string().trim().required("Group is required"),
  emails: yup.array().of(yup.string().email("Invalid email")).min(1, "At least one email is required"),
  officeNumber: yup
    .string()
    .required("Office number is required")
    .matches(/^\d{10}$/, "Office number must be exactly 10 digits"),
  cellNumber: yup
    .string()
    .required("Cell number is required")
    .matches(/^\d{10}$/, "Cell number must be exactly 10 digits"),
  addresses: yup.array().of(
    yup.object({
      line1: yup.array().of(yup.string().required("Address line 1 is required")).min(1, "At least one address line 1 is required"),
      line2: yup.string(),
      city: yup.string().required("City is required"),
      state: yup.string().required("State is required"),
      zip: yup.string().matches(/^\d{5}(\d{4})?$/, "Zip must be 5 or 9 digits").required("Zip is required"),
    })
  ).min(1, "At least one address is required"),
  children: yup.array().of(yup.string()),
  dateOfBirth: yup.date().optional().max(new Date(), "Date of birth cannot be in the future"),
  workAnniversary: yup.date().optional(),
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
  mode: "view" | "edit" | "create"
  visible: boolean
  data?: User
  onClose: () => void
  onSave: (u: User) => void
}

export default function ManageContact({ mode, visible, data, onClose, onSave }: ManageContactProps) {
  const toast = useToast()
  const [values, setValues] = useState<ContactFormValues>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync form with data when data changes or modal opens
  useEffect(() => {
    if (data) {
      // Map User data to ContactFormValues
      const nameParts = data.name.split(" ")
      setValues({
        ...initialValues,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        title: data.role,
        emails: data.emails || [data.email],
        status: data.contactStatus === "active" ? "Active" : "Inactive",
        addresses: data.addresses || [{ line1: [""], line2: "", city: "", state: "", zip: "" }],
        children: data.children || [""],
        // Map other fields if available, otherwise keep initial
      })
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
    setValues((v) => ({
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
        phoneNo: values.cellNumber,
        officeNo: values.officeNumber,
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

  const CustomDateInput = React.forwardRef<HTMLButtonElement, any>(({ value, onClick }, ref) => (
    <Button
      ref={ref}
      onClick={onClick}
      variant="outline"
      size="md"
      rightIcon={<CalendarIcon />}
      isDisabled={isReadOnly}
      w="full"
    >
      {value || "Select date"}
    </Button>
  ))

  return (
    <Container maxW="7xl" py={8}>
      <Box mb={6}>
        <Heading size="lg" textAlign="center">CONTACT REGISTRATION</Heading>
      </Box>

      <Box bg="whiteAlpha.900" p={8} borderRadius="lg" boxShadow="lg">
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
          <VStack spacing={8} align="stretch">
            <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }} gap={6}>
              <FormControl isInvalid={!!errors.type}>
                <FormLabel fontSize="md" fontWeight="semibold">Type <span style={{color: 'red'}}>*</span></FormLabel>
                <Select name="type" value={values.type} onChange={handleChange} placeholder="Select type" isDisabled={isReadOnly} size="md">
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </Select>
                <FormErrorMessage>{errors.type}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold">Existing Contacts</FormLabel>
                <Select name="existingContacts" value={values.existingContacts} onChange={handleChange} placeholder="Select" isDisabled={isReadOnly} size="md">
                  <option value="contact1">Contact 1</option>
                  <option value="contact2">Contact 2</option>
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "repeat(3,1fr)" }} gap={6}>
              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold">Pronouns</FormLabel>
                <Select name="pronouns" value={values.pronouns} onChange={handleChange} placeholder="Select" isDisabled={isReadOnly} size="md">
                  <option value="he/him">He/Him</option>
                  <option value="she/her">She/Her</option>
                  <option value="they/them">They/Them</option>
                </Select>
              </FormControl>

              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel fontSize="md" fontWeight="semibold">First Name <span style={{color: 'red'}}>*</span></FormLabel>
                <Input name="firstName" value={values.firstName} onChange={handleChange} placeholder="First Name" isReadOnly={isReadOnly} size="md" />
                <FormErrorMessage>{errors.firstName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel fontSize="md" fontWeight="semibold">Last Name <span style={{color: 'red'}}>*</span></FormLabel>
                <Input name="lastName" value={values.lastName} onChange={handleChange} placeholder="Last Name" isReadOnly={isReadOnly} size="md" />
                <FormErrorMessage>{errors.lastName}</FormErrorMessage>
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }} gap={6}>
              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold">Suffix</FormLabel>
                <Input name="suffix" value={values.suffix} onChange={handleChange} placeholder="Suffix" isReadOnly={isReadOnly} size="md" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold">Title</FormLabel>
                <Input name="title" value={values.title} onChange={handleChange} placeholder="Title" isReadOnly={isReadOnly} size="md" />
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "repeat(4,1fr)" }} gap={6}>
              <FormControl isInvalid={!!errors.emails}>
                <FormLabel fontSize="md" fontWeight="semibold">Email Addresses <span style={{color: 'red'}}>*</span></FormLabel>
                <VStack spacing={3} align="stretch">
                  {values.emails.map((email, index) => (
                    <HStack key={index} spacing={3}>
                      <Input value={email} onChange={(e) => handleEmailChange(index, e.target.value)} placeholder="Email" isReadOnly={isReadOnly} size="md" flex={1} />
                      {values.emails.length > 1 && (
                        <IconButton icon={<DeleteIcon />} onClick={() => removeEmail(index)} aria-label="Remove email" size="md" />
                      )}
                    </HStack>
                  ))}
                  <IconButton icon={<AddIcon />} onClick={addEmail} aria-label="Add email" size="sm" alignSelf="flex-start" />
                </VStack>
                <FormErrorMessage>{errors.emails}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.officeNumber}>
                <FormLabel fontSize="md" fontWeight="semibold">Office Number <span style={{color: 'red'}}>*</span></FormLabel>
                <Input name="officeNumber" value={values.officeNumber} onChange={handleChange} placeholder="Office Number" maxLength={10} isReadOnly={isReadOnly} size="md" />
                <FormErrorMessage>{errors.officeNumber}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.cellNumber}>
                <FormLabel fontSize="md" fontWeight="semibold">Cell Number <span style={{color: 'red'}}>*</span></FormLabel>
                <Input name="cellNumber" value={values.cellNumber} onChange={handleChange} placeholder="Cell Number" maxLength={10} isReadOnly={isReadOnly} size="md" />
                <FormErrorMessage>{errors.cellNumber}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.group}>
                <FormLabel fontSize="md" fontWeight="semibold">Group <span style={{color: 'red'}}>*</span></FormLabel>
                <Input name="group" value={values.group} onChange={handleChange} placeholder="Group" isReadOnly={isReadOnly} size="md" />
                <FormErrorMessage>{errors.group}</FormErrorMessage>
              </FormControl>
            </Grid>

            <FormControl isInvalid={!!errors.addresses}>
              <FormLabel fontSize="md" fontWeight="semibold">Addresses <span style={{color: 'red'}}>*</span></FormLabel>
              <VStack spacing={4} align="stretch">
                {values.addresses.map((address, index) => (
                  <Box key={index} border="1px solid #e2e8f0" p={6} borderRadius="md">
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }} gap={4}>
                      <FormControl>
                        <FormLabel fontSize="sm">Address Line 1</FormLabel>
                        <VStack spacing={2} align="stretch">
                          {address.line1.map((line, lineIndex) => (
                            <HStack key={lineIndex} spacing={2}>
                              <Input value={line} onChange={(e) => handleAddressLine1Change(index, lineIndex, e.target.value)} placeholder="Address Line 1" isReadOnly={isReadOnly} size="md" flex={1} />
                              {address.line1.length > 1 && (
                                <IconButton icon={<DeleteIcon />} onClick={() => removeAddressLine1(index, lineIndex)} aria-label="Remove line" size="sm" />
                              )}
                            </HStack>
                          ))}
                          <IconButton icon={<AddIcon />} onClick={() => addAddressLine1(index)} aria-label="Add address line 1" size="sm" alignSelf="flex-start" />
                        </VStack>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">Address Line 2</FormLabel>
                        <Input value={address.line2} onChange={(e) => handleAddressChange(index, "line2", e.target.value)} placeholder="Address 2" isReadOnly={isReadOnly} size="md" />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">City</FormLabel>
                        <Input value={address.city} onChange={(e) => handleAddressChange(index, "city", e.target.value)} placeholder="City" isReadOnly={isReadOnly} size="md" />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">State</FormLabel>
                        <Select value={address.state} onChange={(e) => handleAddressChange(index, "state", e.target.value)} placeholder="Select" isDisabled={isReadOnly} size="md">
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">Zip</FormLabel>
                        <Input value={address.zip} onChange={(e) => handleAddressChange(index, "zip", e.target.value.replace(/\D/g, ""))} placeholder="Zip" isReadOnly={isReadOnly} size="md" />
                      </FormControl>
                    </Grid>
                    {values.addresses.length > 1 && (
                      <IconButton icon={<DeleteIcon />} onClick={() => removeAddress(index)} aria-label="Remove address" size="md" mt={4} alignSelf="flex-end" />
                    )}
                  </Box>
                ))}
              </VStack>
              <FormErrorMessage>{errors.addresses}</FormErrorMessage>
            </FormControl>

            <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }} gap={6}>
              <FormControl isInvalid={!!errors.status}>
                <FormLabel fontSize="md" fontWeight="semibold">Status <span style={{color: 'red'}}>*</span></FormLabel>
                <Select name="status" value={values.status} onChange={handleChange} isDisabled={isReadOnly} size="md">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
                <FormErrorMessage>{errors.status}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold">Report</FormLabel>
                <Select name="report" value={values.report} onChange={handleChange} placeholder="Select" isDisabled={isReadOnly} size="md">
                  <option value="report1">Report 1</option>
                  <option value="report2">Report 2</option>
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "repeat(3,1fr)" }} gap={6}>
              <FormControl isInvalid={!!errors.dateOfBirth}>
                <FormLabel fontSize="md" fontWeight="semibold">Date Of Birth</FormLabel>
                <DatePicker
                  selected={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
                  onChange={(date) => handleDateChange("dateOfBirth", date)}
                  dateFormat="yyyy-MM-dd"
                  customInput={<CustomDateInput />}
                  disabled={isReadOnly}
                />
                <FormErrorMessage>{errors.dateOfBirth}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold">Work Anniversary</FormLabel>
                <DatePicker
                  selected={values.workAnniversary ? new Date(values.workAnniversary) : null}
                  onChange={(date) => handleDateChange("workAnniversary", date)}
                  dateFormat="yyyy-MM-dd"
                  customInput={<CustomDateInput />}
                  disabled={isReadOnly}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold">Marital Status</FormLabel>
                <Select name="maritalStatus" value={values.maritalStatus} onChange={handleChange} placeholder="Select" isDisabled={isReadOnly} size="md">
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }} gap={6}>
              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold">Spouse Name</FormLabel>
                <Input name="spouseName" value={values.spouseName} onChange={handleChange} placeholder="Spouse Name" isReadOnly={isReadOnly} size="md" />
              </FormControl>

              <FormControl isInvalid={!!errors.children}>
                <FormLabel fontSize="md" fontWeight="semibold">Children's Names</FormLabel>
                <VStack spacing={3} align="stretch">
                  {values.children.map((child, index) => (
                    <HStack key={index} spacing={3}>
                      <Input value={child} onChange={(e) => handleChildChange(index, e.target.value)} placeholder="Child's Name" isReadOnly={isReadOnly} size="md" flex={1} />
                      {values.children.length > 1 && (
                        <IconButton icon={<DeleteIcon />} onClick={() => setValues((v) => ({ ...v, children: v.children.filter((_, i) => i !== index) })) } aria-label="Remove child" size="md" />
                      )}
                    </HStack>
                  ))}
                  <IconButton icon={<AddIcon />} onClick={addChild} aria-label="Add child" size="sm" alignSelf="flex-start" />
                </VStack>
                <FormErrorMessage>{errors.children}</FormErrorMessage>
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "repeat(4,1fr)" }} gap={6}>
              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold">College</FormLabel>
                <Input name="college" value={values.college} onChange={handleChange} placeholder="College" isReadOnly={isReadOnly} size="md" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold">Degree</FormLabel>
                <Input name="degree" value={values.degree} onChange={handleChange} placeholder="Degree" isReadOnly={isReadOnly} size="md" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold">Prior Employer</FormLabel>
                <Input name="priorEmployer" value={values.priorEmployer} onChange={handleChange} placeholder="Prior Employer" isReadOnly={isReadOnly} size="md" />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold">End Date</FormLabel>
                <DatePicker
                  selected={values.endDate ? new Date(values.endDate) : null}
                  onChange={(date) => handleDateChange("endDate", date)}
                  dateFormat="yyyy-MM-dd"
                  customInput={<CustomDateInput />}
                  disabled={isReadOnly}
                />
              </FormControl>
            </Grid>

            <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }} gap={8}>
              <FormControl>
                <FormLabel fontSize="md" fontWeight="semibold">Notes</FormLabel>
                <Textarea name="notes" value={values.notes} onChange={handleChange} rows={4} isReadOnly={isReadOnly} size="md" />
              </FormControl>

              <VStack align="stretch" spacing={4}>
                <FormControl>
                  <FormLabel fontSize="md" fontWeight="semibold">Sports Team</FormLabel>
                  <Input name="sportsTeam" value={values.sportsTeam} onChange={handleChange} placeholder="Sports Team" isReadOnly={isReadOnly} size="md" />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="md" fontWeight="semibold">Favorites</FormLabel>
                  <Input name="favorites" value={values.favorites} onChange={handleChange} placeholder="Favorites" isReadOnly={isReadOnly} size="md" />
                </FormControl>
              </VStack>
            </Grid>

            <Box textAlign="center" pt={6}>
              <HStack spacing={4} justify="center">
                <Button variant="outline" onClick={onClose} size="lg">
                  Cancel
                </Button>
                {(mode === "edit" || mode === "create") && (
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    px={10}
                    isLoading={isSubmitting}
                    _hover={{ transform: "translateY(-1px)" }}
                  >
                    {mode === "create" ? "Register Contact" : "Save Changes"}
                  </Button>
                )}
              </HStack>
            </Box>
          </VStack>
        </form>
      </Box>
    </Container>
  )
}
