import {
  Box,
  Center,
  Flex,
  Tag,
} from '@chakra-ui/react'
import React from 'react'
import UpdateSummary from './UpdateSummary'

const UpdateListTimeline = ({ filteredUpdates }) => {
  const timelineWidth = 2 // 2rem (equivalent to spacing.8)
  const tagBackground = { base: 'white', _dark: 'gray.800' }
  const yearBackground = { base: 'teal.400', _dark: 'teal.500' }

  return (
    <>
      <Box
        position="absolute"
        top="10"
        bottom="10"
        left={`${timelineWidth / 2}rem`}
        width="2px"
        ml="-1px"
        background="linear-gradient(0deg, rgba(0,0,0,0) 0, var(--chakra-colors-teal-500) 50px)"
      />
      {filteredUpdates.map((update, index) => {
        const date = update.item.publishedAt.substring(0, 10)
        const year = update.item.publishedAt.substring(0, 4)

        const newYear =
          year != filteredUpdates[index - 1]?.item.publishedAt.substring(0, 4)

        return (
          <React.Fragment key={update.item.id}>
            {newYear ? (
              <Flex>
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
              ''
            )}
            <Flex>
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
              <UpdateSummary
                update={update.item}
                searchMatches={update.matches?.[0].indices}
                width={`calc(100% - ${timelineWidth}rem)`}
              />
            </Flex>
          </React.Fragment>
        )
      })}
    </>
  )
}

export default UpdateListTimeline
