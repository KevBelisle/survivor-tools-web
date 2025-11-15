import { Box, Tag, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

import useClampedIsInViewport from "../../hooks/useClampedIsInViewport";

const tags = {
  inStock: (
    <Tag.Root
      size="sm"
      colorScheme="green"
      float="right"
      mt="0.5"
      ml="1"
      variant="solid"
    >
      In Stock
    </Tag.Root>
  ),
  outOfStock: (
    <Tag.Root
      size="sm"
      colorScheme="red"
      float="right"
      mt="0.5"
      ml="1"
      variant="solid"
    >
      Out Of Stock
    </Tag.Root>
  ),
  unlisted: (
    <Tag.Root
      size="sm"
      colorScheme="gray"
      float="right"
      mt="0.5"
      ml="1"
      variant="solid"
    >
      Unlisted
    </Tag.Root>
  ),
};

const ProductSummaryCard = ({ product }) => {
  const tag = product.state ? tags[product.state] : <></>;
  const [hasBeenInViewport, targetRef] = useClampedIsInViewport();

  return (
    <Box
      width="320px"
      rounded="md"
      overflow="hidden"
      shadow="base"
      cursor="pointer"
      ref={targetRef}
    >
      <Link to={`./${product.id}`}>
        <Box
          width="320px"
          height={`${Math.round(
            (320 * product.image.height) / product.image.width,
          )}px`}
          backgroundImage={
            hasBeenInViewport
              ? `url('https://archives.survivor.tools/images/${product.image.uri}')`
              : ""
          }
          backgroundSize="cover"
          borderBottomStyle="solid"
          borderBottomWidth="1px"
          borderBottomColor={{ base: "gray.300", _dark: "black" }}
          backgroundColor="white"
        />
        <Box py="2" px="4" bg={{ base: "gray.100", _dark: "gray.800" }}>
          {tag}
          <Text fontWeight="semibold">{product.title}</Text>
        </Box>
      </Link>
    </Box>
  );
};

export default ProductSummaryCard;
