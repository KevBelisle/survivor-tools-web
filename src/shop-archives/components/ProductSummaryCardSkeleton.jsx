import { Box, Skeleton, Text, useColorModeValue } from '@chakra-ui/react'
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
            borderBottomColor={useColorModeValue('gray.300', 'black')}
            backgroundColor="white"
          />
        </Skeleton>
        <Box py="2" px="4" bg={useColorModeValue('gray.100', 'gray.800')}>
          <Skeleton>
            <Text fontWeight="semibold">Skeleton</Text>
          </Skeleton>
        </Box>
      </Box>
    </Box>
  )
}

export default ProductSummaryCard
