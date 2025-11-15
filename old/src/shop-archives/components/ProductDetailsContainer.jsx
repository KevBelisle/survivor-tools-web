import {
  Flex,
  Button,
  Container,
  Icon,
  useBreakpointValue,
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import api from '../../services/api'
import ProductDetails from './ProductDetails'
import ProductDetailsSkeleton from './ProductDetailsSkeleton'

const fetchProduct = async (productId) => {
  if (!productId) {
    return null
  }
  const { data } = await api.get(`/products/${productId}`)
  return data
}

function ProductDetailsContainer({ productId, filteredProducts }) {
  const {
    isLoading,
    isError,
    data: product,
    error,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
  })

  const [prevProduct, nextProduct] = useMemo(() => {
    const index = filteredProducts.findIndex(
      (product) => product.id === productId,
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

  useQueryClient().prefetchQuery({
    queryKey: ['product', prevProduct?.id],
    queryFn: () => fetchProduct(prevProduct?.id),
  })
  useQueryClient().prefetchQuery({
    queryKey: ['product', nextProduct?.id],
    queryFn: () => fetchProduct(nextProduct?.id),
  })

  return (
    <Container>
      <Flex
        justifyContent={
          filteredProducts.length >= 3 ? 'space-between' : 'flex-end'
        }
      >
        {filteredProducts.length >= 3 ? (
          <Link to={`../${prevProduct?.id}`}>
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
          <Link to={`../${nextProduct?.id}`}>
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
      {isLoading ? (
        <ProductDetailsSkeleton />
      ) : isError ? (
        <span>Error: {error.message}</span>
      ) : (
        <ProductDetails product={product} />
      )}
    </Container>
  )
}

export default ProductDetailsContainer
