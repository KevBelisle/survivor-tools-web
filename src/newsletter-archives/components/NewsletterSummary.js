import { Box, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'

const skipTo = ['View it in your browser.', 'View this email in your browser']

const basePreview = (text, textColor) => {
  var previewText = text

  for (const key of skipTo) {
    const index = text.search(key)

    if (index > 0) {
      previewText = previewText.substring(index + key.length)
    }
  }

  previewText = previewText.split(/\s+/).slice(0, 50).join(' ') + '...'

  return <Text color={textColor}>{previewText}</Text>
}

const searchPreview = (text, searchMatches, textColor) => {
  var bestMatches = searchMatches
    .slice()
    .sort((a, b) => b[1] - b[0] - (a[1] - a[0]))
    .slice(0, 3)

  const textPreviews = bestMatches.map((match) => {
    const matchStartIndex = match[0]
    const matchEndIndex = match[1] + 1
    const preMatchStartIndex = Math.max(0, matchStartIndex - 20)
    const postMatchEndIndex = Math.min(match[1] + 300, text.length - 1)

    return (
      <Text key={match[0]} color={textColor} isTruncated>
        {preMatchStartIndex > 0 ? '...' : ''}
        {text.substring(preMatchStartIndex, matchStartIndex)}
        <b>{text.substring(matchStartIndex, matchEndIndex)}</b>
        {text.substring(matchEndIndex, postMatchEndIndex)}
      </Text>
    )
  })
  return <>{textPreviews}</>
}

const NewsletterSummary = ({
  newsletter,
  searchMatches,
  includeDate,
  ...props
}) => {
  const { path, url } = useRouteMatch()

  const textColor = useColorModeValue('gray.400', 'gray.400')

  var text = searchMatches
    ? searchPreview(newsletter.text, searchMatches, textColor)
    : basePreview(newsletter.text, textColor)

  var date = (
    <Text fontSize="xs" color={useColorModeValue('gray.400', 'gray.400')}>
      {newsletter.sentAt.substring(0, 10)}
    </Text>
  )

  return (
    <Box
      rounded="md"
      overflow="hidden"
      shadow="base"
      cursor="pointer"
      mb="20px"
      {...props}
    >
      <Link to={`${url}/${newsletter.id}`}>
        <Box py="2" px="4" bg={useColorModeValue('white', 'gray.800')}>
          <VStack alignItems="flex-start">
            {includeDate ? date : <></>}
            <Text fontWeight="semibold">{newsletter.title}</Text>
          </VStack>
        </Box>
        <Box py="2" px="4" bg={useColorModeValue('gray.100', 'gray.700')}>
          {text}
        </Box>
      </Link>
    </Box>
  )
}

export default NewsletterSummary
