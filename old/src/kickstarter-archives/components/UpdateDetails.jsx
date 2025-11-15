import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Icon,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const UpdateDetails = ({
  updateId,
  filteredUpdates,
  isLoading,
  isError,
  error,
}) => {
  const [update, prevUpdate, nextUpdate] = useMemo(() => {
    const index = filteredUpdates.findIndex((x) => x.item.id === updateId)
    if (index < 0) return [null, null, null]
    const next = index - 1 >= 0 ? filteredUpdates[index - 1]?.item : null
    const prev =
      index + 1 < filteredUpdates.length
        ? filteredUpdates[index + 1]?.item
        : null

    return [filteredUpdates[index].item, prev, next]
  }, [filteredUpdates, updateId])

  function dangerousHtml() {
    return { __html: update.html }
  }

  return (
    <>
      {isLoading || update === null ? (
        <Center>Loading!</Center>
      ) : isError ? (
        <Center>Error: {error.message}</Center>
      ) : (
        <Container
          marginX="auto"
          width={{
            base: '320px',
            sm: '660px',
            md: '1000px',
            lg: '1340px',
            xl: '1680px',
            '2xl': '2020px',
          }}
        >
          <Flex
            justifyContent={
              filteredUpdates.length >= 3 && prevUpdate
                ? 'space-between'
                : 'flex-end'
            }
          >
            {filteredUpdates.length >= 3 && prevUpdate ? (
              <Link to={`./${prevUpdate?.id}`}>
                <Button
                  leftIcon={<Icon as={HiChevronLeft} />}
                  roundedTop={0}
                  size="sm"
                >
                  {prevUpdate?.publishedAt.substring(0, 10)}
                </Button>
              </Link>
            ) : (
              <></>
            )}
            {filteredUpdates.length >= 2 && nextUpdate ? (
              <Link to={`./${nextUpdate?.id}`}>
                <Button
                  rightIcon={<Icon as={HiChevronRight} />}
                  roundedTop={0}
                  size="sm"
                >
                  {nextUpdate?.publishedAt.substring(0, 10)}
                </Button>
              </Link>
            ) : (
              <></>
            )}
          </Flex>
          {/* {isLoading ? (
        <VStack px="4" py="6" spacing="4" align="stretch">
          <Skeleton>
            <Heading size="2xl">Update title goes here.</Heading>
          </Skeleton>
          <Skeleton>
            <Text>YYYY-MM-DD</Text>
          </Skeleton>
          <Skeleton
            rounded="md"
            overflow="hidden"
            shadow="base"
            mb="20px"
            height="700px"
          />
        </VStack>
      ) : isError ? (
        <span>Error: {error.message}</span>
      ) : ( */}
          <VStack py="6" spacing="4" align="stretch">
            <Heading size="2xl">{update.title}</Heading>
            <Text>{update.publishedAt.substring(0, 10)}</Text>
            <Box
              rounded="md"
              overflow="hidden"
              shadow="base"
              bg={{ base: 'white', _dark: 'gray.800' }}
              mb="20px"
              px="4"
              py="4"
            >
              <div
                dangerouslySetInnerHTML={dangerousHtml()}
                className="kickstarter-update"
              />
            </Box>
          </VStack>
          {/* )} */}
        </Container>
      )}
    </>
  )
}

export default UpdateDetails
