import { useColorModeValue, Text, Box } from '@chakra-ui/react'
import React from 'react'

const ProductVariantStockGraph = ({ stockHistory }) => {
  return (
    <Box
      p={4}
      textAlign="center"
      bg={useColorModeValue('gray.50', 'gray.700')}
      rounded="md"
    >
      <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
        Stock history chart temporarily disabled
      </Text>
    </Box>
  )
}

export default ProductVariantStockGraph
