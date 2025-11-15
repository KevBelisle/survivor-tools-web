import {
  Box,
  Heading,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Tag,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import React from 'react'

function ProductDetailsSkeleton() {
  return (
    <>
      <VStack py="6" spacing="4" align="stretch">
        <Skeleton>
          <Heading size="2xl">product.details.title</Heading>
        </Skeleton>
        <HStack>
          <Skeleton>
            <Tag>Fake tag</Tag>
          </Skeleton>
          <Skeleton>
            <Tag>Fake tag</Tag>
          </Skeleton>
        </HStack>
        <Box shadow="base" rounded="md">
          <Box
            px="4"
            py="4"
            roundedTop="md"
            bg={{ base: 'white', _dark: 'gray.900' }}
          >
            <SkeletonText
              pl="8"
              pr="8"
              py="4"
              fontSize="sm"
              lineClamp={9}
              spacing="4"
            />
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
              <WrapItem>
                <SkeletonCircle size="120" />
              </WrapItem>
              <WrapItem>
                <SkeletonCircle size="120" />
              </WrapItem>
              <WrapItem>
                <SkeletonCircle size="120" />
              </WrapItem>
              <WrapItem>
                <SkeletonCircle size="120" />
              </WrapItem>
              <WrapItem>
                <SkeletonCircle size="120" />
              </WrapItem>
            </Wrap>
          </Box>
        </Box>
      </VStack>
    </>
  )
}

export default ProductDetailsSkeleton
