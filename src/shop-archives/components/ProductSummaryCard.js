import { Box, Tag, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'

import useClampedIsInViewport from '../../hooks/useClampedIsInViewport'

const tags = {
  inStock: (
    <Tag
      size="sm"
      colorScheme="green"
      float="right"
      mt="0.5"
      ml="1"
      variant="solid"
    >
      In Stock
    </Tag>
  ),
  outOfStock: (
    <Tag
      size="sm"
      colorScheme="red"
      float="right"
      mt="0.5"
      ml="1"
      variant="solid"
    >
      Out Of Stock
    </Tag>
  ),
  unlisted: (
    <Tag
      size="sm"
      colorScheme="gray"
      float="right"
      mt="0.5"
      ml="1"
      variant="solid"
    >
      Unlisted
    </Tag>
  ),
}

const ProductSummaryCard = ({ product }) => {
  const { path, url } = useRouteMatch()
  const tag = product.state ? tags[product.state] : <></>
  const [hasBeenInViewport, targetRef] = useClampedIsInViewport()

  return (
    <Box
      width="320px"
      rounded="md"
      overflow="hidden"
      shadow="base"
      cursor="pointer"
      ref={targetRef}
    >
      <Link to={`${url}/${product.id}`}>
        <Box
          width="320px"
          height={`${Math.round(
            (320 * product.image.height) / product.image.width
          )}px`}
          backgroundImage={
            hasBeenInViewport
              ? `url('https://archives.survivor.tools/images/${product.image.uri}')`
              : ''
          }
          backgroundSize="cover"
          borderBottomStyle="solid"
          borderBottomWidth="1px"
          borderBottomColor={useColorModeValue('gray.300', 'black')}
          backgroundColor="white"
        />
        <Box py="2" px="4" bg={useColorModeValue('gray.100', 'gray.800')}>
          {tag}
          <Text fontWeight="semibold">{product.title}</Text>
        </Box>
      </Link>
    </Box>
  )
}

export default ProductSummaryCard
