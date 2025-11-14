import { Box } from '@chakra-ui/react'
import React from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import ProductSummaryCard from './ProductSummaryCard'

const columnsCountBreakPoints = [1, 2, 3, 4, 5, 6].reduce((acc, val) => {
  const breakPoint = 64 + val * (320 + 20) - 20 - 1
  acc[breakPoint] = val
  return acc
}, {})

const ProductMasonry = ({ products }) => {
  return (
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
    >
      <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
        <Masonry gutter="20px">
          {products.map((product, index) => {
            return <ProductSummaryCard key={index} product={product} />
          })}
        </Masonry>
      </ResponsiveMasonry>
    </Box>
  )
}

export default ProductMasonry
