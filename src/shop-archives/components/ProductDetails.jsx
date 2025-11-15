import {
  Box,
  Button,
  Heading,
  Flex,
  Icon,
  Tag,
  Text,
  VStack,
  Wrap,
  WrapItem,
  Center,
} from '@chakra-ui/react'
import React, { useState, useMemo } from 'react'
import {
  HiChevronDoubleDown,
  HiChevronDoubleUp,
  HiOutlineShoppingCart,
} from 'react-icons/hi'

import ProductVariantDetails from './ProductVariantDetails'

function ProductDetails({ product }) {
  const [expandedDescription, setExpandedDescription] = useState(false)

  return (
    <>
      <VStack py="6" spacing="4" align="stretch">
        <Heading size="2xl">{product.details.title}</Heading>
        <Flex wrap="wrap" gridGap={2}>
          {product.details.listed ? (
            <a
              href={`https://shop.kingdomdeath.com/products/${product.details.handle}`}
              target="_blank"
            >
              <Button
                colorScheme="green"
                size="xs"
                mx={0}
                rightIcon={<HiOutlineShoppingCart />}
              >
                Go to KD shop
              </Button>
            </a>
          ) : (
            <></>
          )}
          {product.details.tags
            .filter((tag) => tag.length > 0)
            .map((tag, index) => (
              <Tag colorScheme="teal" mx={0} key={index}>
                {tag}
              </Tag>
            ))}
        </Flex>
        <Box shadow="base" rounded="md">
          <Box
            px="4"
            py="4"
            roundedTop="md"
            bg={{ base: 'white', _dark: 'gray.900' }}
          >
            <Text
              pl="8"
              pr="8"
              fontSize="sm"
              maxHeight={expandedDescription ? '' : '8.75rem'}
              overflow="hidden"
              dangerouslySetInnerHTML={{
                __html: product.details.description,
              }}
            />
            <Center>
              <Button
                fontSize="sm"
                mt="4"
                size="xs"
                onClick={() => setExpandedDescription(!expandedDescription)}
              >
                <Icon
                  as={
                    expandedDescription
                      ? HiChevronDoubleUp
                      : HiChevronDoubleDown
                  }
                  w={3}
                  h={3}
                  mr="2"
                />
                {expandedDescription ? 'Show less' : 'Show more'}
                <Icon
                  as={
                    expandedDescription
                      ? HiChevronDoubleUp
                      : HiChevronDoubleDown
                  }
                  w={3}
                  h={3}
                  ml="2"
                />
              </Button>
            </Center>
          </Box>
          <Box
            px="4"
            py="4"
            roundedBottom="md"
            bg={{ base: 'gray.100', _dark: 'gray.800' }}
          >
            <Wrap
              spacing={{
                base: '16px',
                sm: '38px',
                md: '16px',
                lg: '24px',
                xl: '16px',
                '2xl': '21px',
              }}
            >
              {product.images.map((image, index) => (
                <WrapItem key={index}>
                  <a
                    href={`https://archives.survivor.tools/images/${image.uri}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Box
                      width="120px"
                      height="120px"
                      backgroundImage={`url('https://archives.survivor.tools/images/${image.thumbnailUri}')`}
                      backgroundSize="cover"
                      backgroundColor="white"
                      backgroundPosition="center"
                      rounded="sm"
                      cursor="pointer"
                    />
                  </a>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        </Box>

        {useMemo(
          () =>
            product.variants.map((variant, index) => (
              <ProductVariantDetails
                key={index}
                variant={variant}
                listed={product.details.listed}
              />
            )),
          [product.variants, product.details.listed]
        )}
      </VStack>
    </>
  )
}

export default ProductDetails
