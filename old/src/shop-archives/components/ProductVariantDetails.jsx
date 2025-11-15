import {
  Box,
  Center,
  HStack,
  Icon,
  Popover,
  SimpleGrid,
  Stat,
  Tag,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
import { HiInformationCircle } from "react-icons/hi";

import ProductVariantStockGraph from "./ProductVariantStockGraph";

const ProductVariantDetails = ({ variant, listed }) => {
  const stockGraph = (
    <Box px="4" py="4" bg={{ base: "gray.100", _dark: "gray.900" }}>
      {variant.stockHistory.length >= 6 ? (
        <Box minHeight="300px">
          <ProductVariantStockGraph stockHistory={variant.stockHistory} />
        </Box>
      ) : (
        <Center>
          <Text opacity={0.3}>Not enough data for graph.</Text>
        </Center>
      )}
    </Box>
  );
  const showGraph = useBreakpointValue({ base: false, sm: true });

  const lastKnownPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(variant.priceHistory[0].price);

  const maxPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(
    Math.max.apply(
      null,
      variant.priceHistory.map((x) => x.price),
    ),
  );
  const minPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(
    Math.min.apply(
      null,
      variant.priceHistory.map((x) => x.price),
    ),
  );

  return (
    <SimpleGrid
      templateColumns={{ base: "auto", sm: "auto", md: "350px auto" }}
      spacing={0}
      rounded="md"
      shadow="base"
      overflow="hidden"
    >
      <Box px="4" py="4" bg={{ base: "white", _dark: "gray.800" }}>
        <Text fontWeight="semibold">{variant.details.title}</Text>
        <Text fontSize="sm" color="gray.400">
          {variant.details.sku}
        </Text>
        <HStack mt={{ base: "4", md: "8" }}>
          <Stat.Root>
            <Stat.Label>Last known price</Stat.Label>
            <Stat.ValueText>
              <HStack alignItems="flex-start" spacing={0}>
                <Text>{lastKnownPrice}</Text>
                {maxPrice === minPrice ? (
                  <></>
                ) : (
                  <Popover.Root positioning={{ placement: "right" }}>
                    <Popover.Trigger asChild>
                      <Text lineHeight={6}>
                        <Icon
                          as={HiInformationCircle}
                          w={4}
                          h={4}
                          cursor="pointer"
                          ml={1}
                        />
                      </Text>
                    </Popover.Trigger>
                    <Popover.Positioner>
                      <Popover.Content width="auto">
                        <Popover.Arrow />
                        <Popover.Body>
                          <Text fontSize="sm" fontWeight="normal">
                            Highest: {maxPrice}
                          </Text>
                          <Text fontSize="sm" fontWeight="normal">
                            Lowest: {minPrice}
                          </Text>
                        </Popover.Body>
                      </Popover.Content>
                    </Popover.Positioner>
                  </Popover.Root>
                )}
              </HStack>
            </Stat.ValueText>
          </Stat.Root>
          <Stat.Root>
            <Stat.Label>Current stock</Stat.Label>
            <Stat.ValueText>
              {listed ? (
                variant.stockHistory[0].stock
              ) : (
                <Tag.Root size="md" colorScheme="gray" variant="solid" mt={2}>
                  Unlisted
                </Tag.Root>
              )}
            </Stat.ValueText>
          </Stat.Root>
        </HStack>
      </Box>
      {showGraph ? stockGraph : <></>}
    </SimpleGrid>
  );
};

export default ProductVariantDetails;

// {maxPrice == minPrice ? (
//   <></>
// ) : (
//   <VStack spacing={0}>
//     <Text fontSize="xs" fontWeight="normal" lineHeight="12px">
//       Highest: {maxPrice}
//     </Text>
//     <Text fontSize="xs" fontWeight="normal" lineHeight="12px">
//       Lowest: {minPrice}
//     </Text>
//   </VStack>
// )}
