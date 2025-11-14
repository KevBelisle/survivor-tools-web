import {
  Flex,
  Button,
  Container,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useMemo } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { useQuery, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import SimpleReactLightbox from 'simple-react-lightbox'

import ProductDetails from './ProductDetails'
import ProductDetailsSkeleton from './ProductDetailsSkeleton'

const fetchProduct = async (productId) => {
  if (!productId) {
    return null
  }
  const { data } = await axios.get(
    `https://api.survivor.tools/products/${productId}`
  )
  return data
}

function ProductDetailsContainer({ productId, filteredProducts }) {
  const {
    isLoading,
    isError,
    data: product,
    error,
  } = useQuery(['product', productId], () => fetchProduct(productId))

  const [prevProduct, nextProduct] = useMemo(() => {
    const index = filteredProducts.findIndex(
      (product) => product.id === productId
    )
    return [
      filteredProducts[
        (index - 1 + filteredProducts.length) % filteredProducts.length
      ],
      filteredProducts[
        (index + 1 + filteredProducts.length) % filteredProducts.length
      ],
    ]
  }, [filteredProducts, productId])

  const showNextPrevLabels = useBreakpointValue({ base: false, md: true })

  useQueryClient().prefetchQuery(['product', prevProduct?.id], () =>
    fetchProduct(prevProduct?.id)
  )
  useQueryClient().prefetchQuery(['product', nextProduct?.id], () =>
    fetchProduct(nextProduct?.id)
  )

  return (
    <Container>
      <Flex
        justifyContent={
          filteredProducts.length >= 3 ? 'space-between' : 'flex-end'
        }
      >
        {filteredProducts.length >= 3 ? (
          <Link to={`./${prevProduct?.id}`}>
            <Button
              leftIcon={<Icon as={HiChevronLeft} />}
              roundedTop={0}
              size="sm"
            >
              {showNextPrevLabels ? prevProduct?.title : 'Previous'}
            </Button>
          </Link>
        ) : (
          <></>
        )}
        {filteredProducts.length >= 2 ? (
          <Link to={`./${nextProduct?.id}`}>
            <Button
              rightIcon={<Icon as={HiChevronRight} />}
              roundedTop={0}
              size="sm"
            >
              {showNextPrevLabels ? nextProduct?.title : 'Next'}
            </Button>
          </Link>
        ) : (
          <></>
        )}
      </Flex>
      <SimpleReactLightbox>
        {isLoading ? (
          <ProductDetailsSkeleton />
        ) : isError ? (
          <span>Error: {error.message}</span>
        ) : (
          <ProductDetails product={product} />
        )}
      </SimpleReactLightbox>
    </Container>
  )
}

export default ProductDetailsContainer
