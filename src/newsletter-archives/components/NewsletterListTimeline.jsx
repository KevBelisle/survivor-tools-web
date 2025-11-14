import {
  Box,
  Center,
  Flex,
  Tag,
  useColorModeValue,
  useToken,
} from '@chakra-ui/react'
import React from 'react'
import NewsletterSummary from './NewsletterSummary'

const NewsletterListTimeline = ({ filteredNewsletters }) => {
  const timelineWidth = useToken('spacing', '8')
  const tagBackground = useColorModeValue('white', 'gray.800')
  const yearBackground = useColorModeValue('teal.400', 'teal.500')

  return (
    <>
      <Box
        position="absolute"
        top="10"
        bottom="10"
        left={`${timelineWidth / 2}rem`}
        width="2px"
        ml="-1px"
        background={`linear-gradient(0deg, rgba(0,0,0,0) 0, ${useToken(
          'colors',
          yearBackground
        )} 50px)`}
      />
      {filteredNewsletters.map((newsletter, index) => {
        const date = newsletter.item.sentAt.substring(0, 10)
        const year = newsletter.item.sentAt.substring(0, 4)

        const newYear =
          year != filteredNewsletters[index - 1]?.item.sentAt.substring(0, 4)

        return (
          <>
            {newYear ? (
              <Flex key={year}>
                <Box
                  width={`${timelineWidth}rem`}
                  flexGrow={0}
                  position="relative"
                >
                  <Center py="2">
                    <Tag variant="subtle" background={yearBackground} size="lg">
                      {year}
                    </Tag>
                  </Center>
                </Box>
              </Flex>
            ) : (
              <></>
            )}
            <Flex key={newsletter.item.id}>
              <Box
                width={`${timelineWidth}rem`}
                flexGrow={0}
                position="relative"
              >
                <Center py="2">
                  <Tag variant="subtle" background={tagBackground}>
                    {date}
                  </Tag>
                </Center>
              </Box>
              <NewsletterSummary
                newsletter={newsletter.item}
                searchMatches={newsletter.matches?.[0].indices}
                width={`calc(100% - ${timelineWidth}rem)`}
              />
            </Flex>
          </>
        )
      })}
    </>
  )
}

export default NewsletterListTimeline
