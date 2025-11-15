import { Text, Box } from '@chakra-ui/react'
import React from 'react'

const ProductVariantStockGraph = ({ stockHistory }) => {
  return (
    <Box
      p={4}
      textAlign="center"
      bg={{ base: 'gray.50', _dark: 'gray.700' }}
      rounded="md"
    >
      <Text fontSize="sm" color={{ base: 'gray.500', _dark: 'gray.400' }}>
        Stock history chart temporarily disabled
      </Text>
    </Box>
  )
}

export default ProductVariantStockGraph
