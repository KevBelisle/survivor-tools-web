import { Box, Skeleton, Text } from '@chakra-ui/react'
import React from 'react'

const ProductSummaryCard = () => {
  return (
    <Box
      width="320px"
      rounded="md"
      overflow="hidden"
      shadow="base"
      cursor="pointer"
    >
      <Box>
        <Skeleton>
          <Box
            width="320px"
            height="423px"
            borderBottomStyle="solid"
            borderBottomWidth="1px"
            borderBottomColor={{ base: 'gray.300', _dark: 'black' }}
            backgroundColor="white"
          />
        </Skeleton>
        <Box py="2" px="4" bg={{ base: 'gray.100', _dark: 'gray.800' }}>
          <Skeleton>
            <Text fontWeight="semibold">Skeleton</Text>
          </Skeleton>
        </Box>
      </Box>
    </Box>
  )
}

export default ProductSummaryCard
