import {
  Box,
  Center,
  Flex,
  Tag,
  useBreakpointValue,
  useColorModeValue,
  useToken,
} from '@chakra-ui/react'
import React from 'react'
import UpdateListSimple from './UpdateListSimple'
import UpdateListTimeline from './UpdateListTimeline'

const UpdateList = ({ filteredUpdates, isLoading, isError, error }) => {
  const useTimelineView = useBreakpointValue({ base: false, sm: true })

  return (
    <>
      {isLoading ? (
        <>Skeleton!</>
      ) : isError ? (
        <span>Error: {error.message}</span>
      ) : (
        <Box
          py="8"
          marginX="auto"
          width={{
            base: '320px',
            sm: '660px',
            md: '1000px',
            lg: '1340px',
            xl: '1680px',
            '2xl': '2020px',
          }}
          position="relative"
        >
          {useTimelineView ? (
            <UpdateListTimeline filteredUpdates={filteredUpdates} />
          ) : (
            <UpdateListSimple filteredUpdates={filteredUpdates} />
          )}
        </Box>
      )}
    </>
  )
}

export default UpdateList
