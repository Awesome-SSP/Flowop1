import { useState } from "react"
import {
  Box,
  Button,
  Input,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  HStack,
  VStack,
  Flex,
  Container,
  Grid,
  IconButton,
  // Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, // removed
} from "@chakra-ui/react"
import { SearchIcon, CloseIcon } from "@chakra-ui/icons"
// import AddUser from "./AddUser" // removed (page will be routed)
import { useNavigate } from "react-router-dom"

interface User {
  id: number
  name: string
  email: string
  phoneNo: string
  userType: string
  userGroup: string
  code: string
  companyStatus: "Active" | "Inactive"
  userStatus: "Active" | "Inactive"
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "Siddharth Chacha",
    email: "niles.karanjkar@goclean.tech",
    phoneNo: "9839991938",
    userType: "CONV",
    userGroup: "Accounting,Client Guide,Compliance,FAQ,Legal,MIS,IT,Notice",
    code: "ALL",
    companyStatus: "Active",
    userStatus: "Active",
  },
  {
    id: 2,
    name: "Sachin Kumar",
    email: "sachin.kumari@goclean.tech",
    phoneNo: "1234567890",
    userType: "Firm",
    userGroup: "Accounting,Client Guide,Compliance,FAQ,Legal,MIS,IT,Notice",
    code: "BLIT",
    companyStatus: "Active",
    userStatus: "Active",
  },
  {
    id: 3,
    name: "Anand singh",
    email: "ananddev.singh@goclean.tech",
    phoneNo: "9839991938",
    userType: "Firm",
    userGroup: "Accounting,Client Guide,Compliance,FAQ,Legal,MIS,IT,Notice",
    code: "ANAD",
    companyStatus: "Active",
    userStatus: "Active",
  },
  {
    id: 4,
    name: "nitin kumar",
    email: "nitin.kumar@goclean.tech",
    phoneNo: "9839991938",
    userType: "Firm",
    userGroup: "Accounting,Client Guide,Compliance,FAQ,Legal,MIS,IT,Notice",
    code: "NITI",
    companyStatus: "Active",
    userStatus: "Active",
  },
  {
    id: 5,
    name: "Kirit Upadhyay",
    email: "kirit.upadhyay@goclean.tech",
    phoneNo: "9839991938",
    userType: "Client",
    userGroup: "Accounting,Client Guide,Compliance,FAQ,Legal,MIS,IT,Notice",
    code: "ALL",
    companyStatus: "Active",
    userStatus: "Active",
  },
  {
    id: 6,
    name: "Anwar Hussain",
    email: "Anwar.hussain@goclean.tech",
    phoneNo: "9999999999",
    userType: "ALL",
    userGroup: "Compliance,Accounting,MIS,IT,Legal,Client Guide,FAQ,Notice",
    code: "ALL",
    companyStatus: "Active",
    userStatus: "Active",
  },
  {
    id: 7,
    name: "ananddev singh",
    email: "ananddev.singh@goclean.tech",
    phoneNo: "9999999999",
    userType: "CONV",
    userGroup: "Compliance,Accounting,MIS,IT,Legal,Client Guide,FAQ,Notice",
    code: "ALL",
    companyStatus: "Active",
    userStatus: "Active",
  },
]

export default function ManageNotice() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  // const { isOpen, onOpen, onClose } = useDisclosure() // removed

  const navigate = useNavigate()

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortColumn) return 0
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }
    return 0
  })

  // Sorting handler
  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = sortedUsers.slice(startIndex, endIndex)

  return (
    <Container maxW="7xl" py={2}>
      <Box mb={2}>
        <Text fontSize="lg" fontWeight="bold" textAlign="center" color="gray.700">
          USER MANAGEMENT
        </Text>
      </Box>

      <Box bg="white" p={4} borderRadius="lg" boxShadow="lg">
        <VStack spacing={4} align="stretch">
          <Text fontSize="md" fontWeight="semibold" color="gray.600">
            User List
          </Text>

          <Grid templateColumns="repeat(2, 1fr)" gap={4} alignItems="center">
            <Box position="relative">
              <SearchIcon position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                pl={10}
                size="md"
                borderRadius="md"
              />
              {searchTerm && (
                <IconButton
                  icon={<CloseIcon />}
                  size="sm"
                  position="absolute"
                  right={2}
                  top="50%"
                  transform="translateY(-50%)"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  variant="ghost"
                />
              )}
            </Box>
            <Flex justify="flex-end">
              <Button
                colorScheme="blue"
                bg="blue.600"
                _hover={{ bg: "blue.700" }}
                onClick={() => navigate("/admin/add-user")}
                size="md"
              >
                Add User
              </Button>
            </Flex>
          </Grid>

          <Box overflowX="auto">
            <Table variant="striped" size="sm" colorScheme="gray">
              <Thead>
                <Tr bg="gray.600">
                  <Th color="white" textAlign="center" fontSize="xs" w="12">#</Th>
                  <Th
                    color="white"
                    cursor="pointer"
                    fontSize="xs"
                    onClick={() => handleSort("name")}
                  >
                    Name {sortColumn === "name" && (sortDirection === "asc" ? "▲" : "▼")}
                  </Th>
                  <Th
                    color="white"
                    cursor="pointer"
                    fontSize="xs"
                    onClick={() => handleSort("email")}
                  >
                    Email {sortColumn === "email" && (sortDirection === "asc" ? "▲" : "▼")}
                  </Th>
                  <Th
                    color="white"
                    textAlign="center"
                    cursor="pointer"
                    fontSize="xs"
                    onClick={() => handleSort("phoneNo")}
                  >
                    Phone No. {sortColumn === "phoneNo" && (sortDirection === "asc" ? "▲" : "▼")}
                  </Th>
                  <Th
                    color="white"
                    textAlign="center"
                    cursor="pointer"
                    fontSize="xs"
                    onClick={() => handleSort("userType")}
                  >
                    User Type {sortColumn === "userType" && (sortDirection === "asc" ? "▲" : "▼")}
                  </Th>
                  <Th
                    color="white"
                    cursor="pointer"
                    fontSize="xs"
                    onClick={() => handleSort("userGroup")}
                  >
                    User Group {sortColumn === "userGroup" && (sortDirection === "asc" ? "▲" : "▼")}
                  </Th>
                  <Th
                    color="white"
                    textAlign="center"
                    cursor="pointer"
                    fontSize="xs"
                    onClick={() => handleSort("code")}
                  >
                    Code {sortColumn === "code" && (sortDirection === "asc" ? "▲" : "▼")}
                  </Th>
                  <Th
                    color="white"
                    textAlign="center"
                    cursor="pointer"
                    fontSize="xs"
                    onClick={() => handleSort("companyStatus")}
                  >
                    Company Status {sortColumn === "companyStatus" && (sortDirection === "asc" ? "▲" : "▼")}
                  </Th>
                  <Th
                    color="white"
                    textAlign="center"
                    cursor="pointer"
                    fontSize="xs"
                    onClick={() => handleSort("userStatus")}
                  >
                    User Status {sortColumn === "userStatus" && (sortDirection === "asc" ? "▲" : "▼")}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentUsers.map((user, index) => (
                  <Tr key={user.id} cursor="pointer" _hover={{ bg: "gray.50" }} onClick={() => navigate(`/administration/add-user?userId=${user.id}`)}>
                    <Td textAlign="center" fontSize="xs">{startIndex + index + 1}</Td>
                    <Td fontSize="xs" fontWeight="medium">{user.name}</Td>
                    <Td fontSize="xs">{user.email}</Td>
                    <Td textAlign="center" fontSize="xs">{user.phoneNo}</Td>
                    <Td textAlign="center" fontSize="xs">{user.userType}</Td>
                    <Td maxW="xs" overflow="hidden" textOverflow="ellipsis" title={user.userGroup} fontSize="xs">
                      {user.userGroup}
                    </Td>
                    <Td textAlign="center" fontSize="xs">{user.code}</Td>
                    <Td textAlign="center">
                      <Badge
                        colorScheme={user.companyStatus === "Active" ? "green" : "gray"}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {user.companyStatus}
                      </Badge>
                    </Td>
                    <Td textAlign="center">
                      <Badge
                        colorScheme={user.userStatus === "Active" ? "green" : "gray"}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {user.userStatus}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {/* Pagination */}
          <Flex justify="space-between" align="center" pt={4}>
            <Text fontSize="xs" color="gray.600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
            </Text>
            <HStack spacing={2}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                isDisabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant={currentPage === 1 ? "solid" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(1)}
                colorScheme={currentPage === 1 ? "blue" : undefined}
              >
                1
              </Button>
              {totalPages > 1 && (
                <>
                  <Button
                    variant={currentPage === 2 ? "solid" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(2)}
                    colorScheme={currentPage === 2 ? "blue" : undefined}
                  >
                    2
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    isDisabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </>
              )}
            </HStack>
          </Flex>
        </VStack>
      </Box>

      {/* Modal removed — navigation to /administration/add-user is used instead */}
    </Container>
  )
}
