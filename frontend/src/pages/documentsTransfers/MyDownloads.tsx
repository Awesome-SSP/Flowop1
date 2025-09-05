import React, { useMemo, useState } from "react"
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
  Button,
  VStack,
  Text,
  IconButton,
  HStack,
  Input,
  Select,
  Badge,
  Spacer,
  Tooltip,
  useToast,
  Center,
  useColorModeValue,
  Flex,
  Divider,
} from "@chakra-ui/react"
import { DownloadIcon, ExternalLinkIcon, DeleteIcon } from "@chakra-ui/icons"

type DownloadItem = {
  id: number
  name: string
  date: string
  size: string
  url?: string
  tags?: string[]
}

const initialDownloads: DownloadItem[] = [
  { id: 1, name: "Document1.pdf", date: "2023-10-01", size: "2 MB", url: undefined, tags: ["report"] },
  { id: 2, name: "Image2.jpg", date: "2023-10-02", size: "1.5 MB", url: undefined, tags: ["image"] },
  { id: 3, name: "Report3.docx", date: "2023-10-03", size: "0.5 MB", url: undefined, tags: ["doc"] },
  { id: 4, name: "Presentation.pptx", date: "2023-09-20", size: "4.2 MB", url: undefined, tags: ["slides"] },
  { id: 5, name: "Invoice.pdf", date: "2023-08-15", size: "120 KB", url: undefined, tags: ["finance"] },
  { id: 6, name: "Specs.xlsx", date: "2023-07-01", size: "800 KB", url: undefined, tags: ["data"] },
]

const MyDownloads: React.FC = () => {
  const toast = useToast()
  const [downloads, setDownloads] = useState<DownloadItem[]>(initialDownloads)
  const [query, setQuery] = useState("")
  const [tagFilter, setTagFilter] = useState<string>("all")
  const [pageSize, setPageSize] = useState<number>(5)
  const [page, setPage] = useState<number>(1)
  const [sortBy, setSortBy] = useState<"date" | "name">("date")

  // Purple background + complementary teal accent — subtle grayish matte look
  const pageGradient = useColorModeValue(
    "linear(to-b, purple.50, gray.50)",
    "linear(to-b, purple.900, gray.900)"
  )
  const cardGradient = useColorModeValue(
    "linear(to-b, white, purple.25)",
    "linear(to-b, gray.800, purple.800)"
  )
  const cardBorder = useColorModeValue("purple.100", "purple.700")
  const headingColor = useColorModeValue("purple.700", "purple.200")
  const textColor = useColorModeValue("gray.600", "gray.300")
  const thBg = useColorModeValue("purple.25", "rgba(255,255,255,0.03)")
  const accent = useColorModeValue("teal.500", "teal.300")
  const subtleBadge = useColorModeValue("gray", "gray")

  const tags = useMemo(() => {
    const s = new Set<string>()
    downloads.forEach((d) => d.tags?.forEach((t) => s.add(t)))
    return ["all", ...Array.from(s)]
  }, [downloads])

  const filtered = useMemo(() => {
    let list = downloads.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
    if (tagFilter !== "all") list = list.filter((d) => d.tags?.includes(tagFilter))
    list = list.sort((a, b) => {
      if (sortBy === "date") return b.date.localeCompare(a.date)
      return a.name.localeCompare(b.name)
    })
    return list
  }, [downloads, query, tagFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = filtered.slice((page - 1) * pageSize, page * pageSize)

  const handleDownload = (item: DownloadItem) => {
    const blob = new Blob([`This is a dummy file for ${item.name}`], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = item.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    toast({ title: `${item.name} downloaded`, status: "success", duration: 2500, isClosable: true })
  }

  const handlePreview = (item: DownloadItem) => {
    const blob = new Blob([`Preview of ${item.name}`], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  }

  const handleRemove = (id: number) => {
    if (!window.confirm("Remove this file from list?")) return
    setDownloads((d) => d.filter((x) => x.id !== id))
    toast({ title: "Removed", status: "info", duration: 2000, isClosable: true })
  }

  return (
    <Container maxW="7xl" py={6}>
      <Box
        bgGradient={pageGradient}
        p={{ base: 4, md: 6 }}
        borderRadius="lg"
      >
        <VStack spacing={4} align="stretch">
          <Heading size="lg" textAlign="center" color={headingColor}>
            My Downloads
          </Heading>

          <Text fontSize="sm" color={textColor} textAlign="center">
            View and manage files you've downloaded.
          </Text>

          <Box
            bgGradient={cardGradient}
            p={3}
            borderRadius="lg"
            borderWidth={1}
            borderColor={cardBorder}
            boxShadow={useColorModeValue("sm", "none")}
          >
            <HStack spacing={3} flexWrap="wrap">
              <Input
                placeholder="Search files..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                maxW={{ base: "100%", md: "360px" }}
                size="sm"
                bg={useColorModeValue("white", "gray.800")}
                _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
                borderColor={useColorModeValue("gray.200", "gray.700")}
              />
              <Select
                value={tagFilter}
                onChange={(e) => {
                  setTagFilter(e.target.value)
                  setPage(1)
                }}
                size="sm"
                maxW="160px"
                bg={useColorModeValue("white", "gray.800")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
              >
                {tags.map((t) => (
                  <option key={t} value={t}>
                    {t === "all" ? "All tags" : t}
                  </option>
                ))}
              </Select>

              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "name")}
                size="sm"
                maxW="140px"
                bg={useColorModeValue("white", "gray.800")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
              >
                <option value="date">Sort: Newest</option>
                <option value="name">Sort: Name</option>
              </Select>

              <Select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
                size="sm"
                maxW="120px"
                bg={useColorModeValue("white", "gray.800")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
              </Select>

              <Spacer />
              <Button size="sm" variant="ghost" onClick={() => { setQuery(""); setTagFilter("all"); setSortBy("date"); setPage(1) }}>
                Reset
              </Button>
            </HStack>
          </Box>

          <Box
            overflowX="auto"
            borderRadius="lg"
            borderWidth={1}
            borderColor={cardBorder}
            bg={useColorModeValue("white", "gray.800")}
            boxShadow={useColorModeValue("sm", "none")}
          >
            <Table variant="simple" size="sm">
              <Thead>
                <Tr bg={thBg}>
                  <Th>File Name</Th>
                  <Th>Downloaded</Th>
                  <Th>Size</Th>
                  <Th>Tags</Th>
                  <Th textAlign="right">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {current.length === 0 ? (
                  <Tr>
                    <Td colSpan={5}>
                      <Center py={6}>
                        <VStack spacing={2}>
                          <Text color={textColor}>No files found</Text>
                          <Text fontSize="xs" color={useColorModeValue("gray.400", "gray.500")}>
                            Try changing filters or add files to your downloads.
                          </Text>
                        </VStack>
                      </Center>
                    </Td>
                  </Tr>
                ) : (
                  current.map((d) => (
                    <Tr
                      key={d.id}
                      _hover={{ bg: useColorModeValue("gray.50", "rgba(255,255,255,0.02)") }}
                      transition="background .12s"
                    >
                      <Td maxW="320px">
                        <Text isTruncated maxW="320px" fontWeight="medium" color={headingColor}>
                          {d.name}
                        </Text>
                      </Td>
                      <Td color={textColor}>{d.date}</Td>
                      <Td color={textColor}>{d.size}</Td>
                      <Td>
                        <HStack spacing={2}>
                          {(d.tags || []).slice(0, 3).map((t) => (
                            <Badge key={t} colorScheme={subtleBadge} variant="subtle" px={2} py={0.5} borderRadius="md">
                              {t}
                            </Badge>
                          ))}
                        </HStack>
                      </Td>
                      <Td>
                        <Flex justify="flex-end" gap={2}>
                          <Tooltip label="Download">
                            <IconButton aria-label="download" icon={<DownloadIcon />} size="sm" colorScheme={accent} onClick={() => handleDownload(d)} />
                          </Tooltip>
                          <Tooltip label="Preview">
                            <IconButton aria-label="preview" icon={<ExternalLinkIcon />} size="sm" colorScheme="gray" onClick={() => handlePreview(d)} />
                          </Tooltip>
                          <Tooltip label="Remove">
                            <IconButton aria-label="remove" icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleRemove(d.id)} />
                          </Tooltip>
                        </Flex>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>

          <HStack justify="space-between" px={2}>
            <Text fontSize="sm" color={textColor}>
              Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} -{" "}
              {Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </Text>

            <HStack>
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                isDisabled={page <= 1}
                variant="outline"
                borderColor={useColorModeValue("purple.100", "purple.700")}
              >
                Prev
              </Button>
              <Text fontSize="sm" color={textColor}>{page} / {totalPages}</Text>
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                isDisabled={page >= totalPages}
                variant="outline"
                borderColor={useColorModeValue("purple.100", "purple.700")}
              >
                Next
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </Container>
  )
}

export default MyDownloads