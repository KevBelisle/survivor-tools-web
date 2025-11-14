import {
  Box,
  Button,
  Heading,
  Flex,
  Icon,
  Tag,
  Text,
  useColorModeValue,
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
import { SRLWrapper, useLightbox } from 'simple-react-lightbox'

import ProductVariantDetails from './ProductVariantDetails'

function ProductDetails({ product }) {
  const [expandedDescription, setExpandedDescription] = useState(false)
  const { openLightbox } = useLightbox()

  const overlayColor = useColorModeValue('#E2E8F0', '#4A5568') // ('gray.200', 'gray.600'),
  const captionColor = useColorModeValue('#2D3748', '#EDF2F7') // ('gray.700', 'gray.100'),
  const backgroundColor = useColorModeValue('#FFFFFF', '#171923') // ('white', 'gray.900'),
  const iconColor = useColorModeValue('#A0AEC0', '#E2E8F0') // ('gray.400', 'gray.200'),

  const srlOptions = useMemo(() => {
    return {
      settings: {
        disableWheelControls: true,
        overlayColor: overlayColor,
        lightboxTransitionSpeed: 0.1,
        slideAnimationType: null,
        slideTransitionSpeed: 0,
      },
      caption: {
        captionColor: captionColor,
      },
      buttons: {
        backgroundColor: backgroundColor,
        iconColor: iconColor,
        showAutoplayButton: false,
        showThumbnailsButton: false,
      },
      thumbnails: {
        showThumbnails: false,
      },
      progressBar: {
        showProgressBar: false,
      },
    }
  }, [overlayColor, captionColor, backgroundColor, iconColor])

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
            bg={useColorModeValue('white', 'gray.900')}
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
            bg={useColorModeValue('gray.100', 'gray.800')}
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
                  <Box
                    width="120px"
                    height="120px"
                    backgroundImage={`url('https://archives.survivor.tools/images/${image.thumbnailUri}')`}
                    backgroundSize="cover"
                    backgroundColor="white"
                    backgroundPosition="center"
                    rounded="sm"
                    onClick={() => {
                      openLightbox(index)
                    }}
                  />
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

      {useMemo(
        () => (
          <SRLWrapper
            elements={product.images.map((image, index) => ({
              src: `https://archives.survivor.tools/images/${image.uri}`,
              thumbnail: `https://archives.survivor.tools/images/${image.thumbnailUri}`,
              caption: image.alt,
              width: image.width,
              height: 'auto',
            }))}
            options={srlOptions}
          />
        ),
        [product.images, srlOptions]
      )}
    </>
  )
}

export default ProductDetails
