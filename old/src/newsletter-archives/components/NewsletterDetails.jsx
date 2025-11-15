import {
  Box,
  Button,
  Container,
  Flex,
  Icon,
  Heading,
  Skeleton,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import api from '../../services/api'

const NewsletterDetails = ({ newsletterId, filteredNewsletters }) => {
  const {
    isLoading,
    isError,
    data: newsletter,
    error,
  } = useQuery({
    queryKey: ['newsletter', newsletterId],
    queryFn: async () => {
      const { data } = await api.get(`/newsletter/${newsletterId}`)
      return data
    },
  })

  function dangerousHtml() {
    return { __html: newsletter.html }
  }

  const [prevNewsletter, nextNewsletter] = useMemo(() => {
    const index = filteredNewsletters.findIndex(
      (newsletter) => newsletter.item.id === newsletterId,
    )
    const next = index - 1 >= 0 ? filteredNewsletters[index - 1]?.item : null
    const prev =
      index + 1 < filteredNewsletters.length
        ? filteredNewsletters[index + 1]?.item
        : null

    return [prev, next]
  }, [filteredNewsletters, newsletterId])

  return (
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
          filteredNewsletters.length >= 3 && prevNewsletter
            ? 'space-between'
            : 'flex-end'
        }
      >
        {filteredNewsletters.length >= 3 && prevNewsletter ? (
          <Link to={`./${prevNewsletter?.id}`}>
            <Button
              leftIcon={<Icon as={HiChevronLeft} />}
              roundedTop={0}
              size="sm"
            >
              {prevNewsletter?.sentAt.substring(0, 10)}
            </Button>
          </Link>
        ) : (
          <></>
        )}
        {filteredNewsletters.length >= 2 && nextNewsletter ? (
          <Link to={`./${nextNewsletter?.id}`}>
            <Button
              rightIcon={<Icon as={HiChevronRight} />}
              roundedTop={0}
              size="sm"
            >
              {nextNewsletter?.sentAt.substring(0, 10)}
            </Button>
          </Link>
        ) : (
          <></>
        )}
      </Flex>

      {isLoading ? (
        <VStack py="6" spacing="4" align="stretch">
          <Skeleton>
            <Heading size="2xl">Email title goes here.</Heading>
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
      ) : (
        <VStack py="6" spacing="4" align="stretch">
          <Heading size="2xl">{newsletter.title}</Heading>
          <Text>{newsletter.sentAt.substring(0, 10)}</Text>
          <Box rounded="md" overflow="hidden" shadow="base" mb="20px">
            <div dangerouslySetInnerHTML={dangerousHtml()} />
          </Box>
        </VStack>
      )}
    </Container>
  )
}

export default NewsletterDetails
