import React, { useRef, useState } from "react"
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Text,
  Badge,
  Button,
  Input,
  Progress,
  HStack,
  IconButton,
  useToast,
  Stack,
  Flex,
  Spacer,
  Avatar,
  Tooltip,
  List,
  ListItem,
  Divider,
} from "@chakra-ui/react"
import { ArrowUpIcon, DeleteIcon, SmallCloseIcon } from "@chakra-ui/icons"

interface UploadItem {
  id: number
  name: string
  date: string
  size: string
  status: "Completed" | "Pending" | "Failed" | "Uploading"
}

interface StagedFile {
  id: number
  file: File
  progress: number
  status: "Ready" | "Uploading" | "Completed" | "Failed"
}

const bytesToMB = (b: number) => `${(b / 1024 / 1024).toFixed(2)} MB`

const MyUploads: React.FC = () => {
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [uploads, setUploads] = useState<UploadItem[]>(
    [
      { id: 1, name: "Upload1.pdf", date: "2023-10-01", size: "2 MB", status: "Completed" },
      { id: 2, name: "Upload2.jpg", date: "2023-10-02", size: "1.5 MB", status: "Pending" },
      { id: 3, name: "Upload3.docx", date: "2023-10-03", size: "0.50 MB", status: "Failed" },
    ]
  )

  const [staged, setStaged] = useState<StagedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onChooseFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const next: StagedFile[] = Array.from(files).map((f, i) => ({
      id: Date.now() + i,
      file: f,
      progress: 0,
      status: "Ready",
    }))
    setStaged((s) => [...s, ...next])
    // reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeStaged = (id: number) => {
    setStaged((s) => s.filter((f) => f.id !== id))
  }

  const clearStaged = () => setStaged([])

  const handleUpload = async () => {
    if (staged.length === 0) {
      toast({ title: "No files selected", status: "warning", isClosable: true })
      return
    }

    setIsUploading(true)
    // Simulate per-file upload with separate timers
    const updatedStaged: StagedFile[] = staged.map((s) => ({
      ...s,
      status: "Uploading" as StagedFile["status"],
      progress: 0,
    }))
    setStaged(updatedStaged)

    await Promise.all(
      updatedStaged.map(
        (sf) =>
          new Promise<void>((resolve) => {
            const totalTicks = 12 + Math.floor(Math.random() * 8)
            let tick = 0
            const interval = setInterval(() => {
              tick++
              const progress = Math.min(100, Math.round((tick / totalTicks) * 100))
              setStaged((prev) =>
                prev.map((p) =>
                  p.id === sf.id
                    ? {
                        ...p,
                        status: progress >= 100 ? ("Completed" as StagedFile["status"]) : ("Uploading" as StagedFile["status"]),
                        progress,
                      }
                    : p
                )
              )
              if (progress >= 100) {
                clearInterval(interval)
                // append to uploads list
                setUploads((prev) => [
                  ...prev,
                  {
                    id: prev.length ? prev[prev.length - 1].id + 1 : 1,
                    name: sf.file.name,
                    date: new Date().toISOString().split("T")[0],
                    size: bytesToMB(sf.file.size),
                    status: "Completed",
                  },
                ])
                resolve()
              }
            }, 150 + Math.floor(Math.random() * 150))
          })
      )
    )

    setIsUploading(false)
    setStaged([])
    toast({ title: "Files uploaded successfully", status: "success", duration: 3000, isClosable: true })
  }

  const handleDeleteUpload = (id: number) => {
    setUploads((prev) => prev.filter((u) => u.id !== id))
    toast({ title: "Upload removed", status: "info", duration: 2000, isClosable: true })
  }

  return (
    <Container maxW="7xl" py={6}>
      <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="md" boxShadow="md">
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center" color="gray.700">
            My Uploads
          </Heading>

          {/* uploader card */}
          <Box borderWidth={1} borderColor="gray.100" p={4} borderRadius="md" bg="gray.50">
            <Stack direction={{ base: "column", md: "row" }} spacing={4} align="center">
              <Box flex="1">
                <Heading size="sm" mb={1} color="gray.600">
                  Upload New Files
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Select files to upload. Supported: pdf, jpg, png, docx.
                </Text>
                <HStack mt={3} spacing={3}>
                  <Input
                    ref={fileInputRef}
                    onChange={onChooseFiles}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    display="none"
                    id="file-input"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<ArrowUpIcon />}
                    colorScheme="blue"
                    size="md"
                  >
                    Choose Files
                  </Button>

                  <Button
                    onClick={handleUpload}
                    colorScheme="teal"
                    size="md"
                    isDisabled={staged.length === 0 || isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>

                  <Button variant="ghost" size="md" onClick={clearStaged} isDisabled={staged.length === 0 || isUploading}>
                    Clear
                  </Button>
                  <Spacer />
                  <Text fontSize="sm" color="gray.500">
                    {staged.length} selected
                  </Text>
                </HStack>
              </Box>

              {/* staged list */}
              <Box minW={{ base: "100%", md: "320px" }} maxW="420px">
                <Heading size="xs" mb={2} color="gray.600">
                  Selected Files
                </Heading>
                <Box bg="white" borderRadius="md" borderWidth={1} borderColor="gray.100" p={2}>
                  {staged.length === 0 ? (
                    <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                      No files selected
                    </Text>
                  ) : (
                    <List spacing={2}>
                      {staged.map((s) => (
                        <ListItem key={s.id}>
                          <Flex align="center" gap={2}>
                            <Avatar name={s.file.name} size="sm" />
                            <Box minW={0}>
                              <Text fontSize="sm" fontWeight="medium" isTruncated maxW="220px">
                                {s.file.name}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {bytesToMB(s.file.size)}
                              </Text>
                              {s.status !== "Ready" && <Progress size="xs" value={s.progress} mt={2} />}
                            </Box>
                            <Spacer />
                            <Tooltip label="Remove">
                              <IconButton
                                aria-label="remove-file"
                                icon={<SmallCloseIcon />}
                                size="sm"
                                variant="ghost"
                                onClick={() => removeStaged(s.id)}
                                isDisabled={isUploading}
                              />
                            </Tooltip>
                          </Flex>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Upload history */}
          <Box>
            <Heading size="md" mb={2} color="gray.600">
              Upload History
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={3}>
              Recent uploads are shown below.
            </Text>

            <Box overflowX="auto">
              <Table variant="striped" size="sm" colorScheme="gray">
                <Thead>
                  <Tr bg="gray.100">
                    <Th>File Name</Th>
                    <Th>Upload Date</Th>
                    <Th>Size</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {uploads.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} textAlign="center" py={6}>
                        <Text color="gray.500">No uploads yet</Text>
                      </Td>
                    </Tr>
                  ) : (
                    uploads.map((u) => (
                      <Tr key={u.id}>
                        <Td maxW="300px">
                          <Text isTruncated maxW="300px">
                            {u.name}
                          </Text>
                        </Td>
                        <Td>{u.date}</Td>
                        <Td>{u.size}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              u.status === "Completed" ? "green" : u.status === "Pending" ? "yellow" : "red"
                            }
                          >
                            {u.status}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="Delete"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              onClick={() => handleDeleteUpload(u.id)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    )))
                  }
                </Tbody>
              </Table>
            </Box>
          </Box>
        </VStack>
      </Box>
    </Container>
  )
}

export default MyUploads