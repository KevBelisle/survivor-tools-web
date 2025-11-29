import { Box, Card, Heading, Text, Flex, Badge } from "@chakra-ui/react";
import type { ProductVariant } from "@/shop/types";

interface ProductVariantsProps {
  variants: ProductVariant[];
}

function ProductVariants({ variants }: ProductVariantsProps) {
  if (variants.length === 0) {
    return null;
  }

  return (
    <Box>
      <Heading as="h2" size="2xl" mb="4">
        Variants
      </Heading>
      <Flex direction="column" gap="4">
        {variants.map((variant) => {
          const currentStock =
            variant.stockHistory.length > 0
              ? variant.stockHistory[variant.stockHistory.length - 1].stock
              : 0;
          const currentPrice =
            variant.priceHistory.length > 0
              ? variant.priceHistory[variant.priceHistory.length - 1].price
              : 0;

          const prices = variant.priceHistory.map((p) => p.price);
          const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;
          const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;

          return (
            <Card.Root
              key={variant.details.id}
              variant="subtle"
              bg={{ base: "white", _dark: "gray.800" }}
              shadow="sm"
            >
              <Card.Body>
                <Flex direction="column" gap="4">
                  <Flex
                    justify="space-between"
                    align="start"
                    flexWrap="wrap"
                    gap="4"
                  >
                    <Box>
                      <Card.Title mb="2">{variant.details.title}</Card.Title>
                      <Text
                        fontSize="sm"
                        color={{ base: "gray.600", _dark: "gray.400" }}
                      >
                        SKU: {variant.details.sku}
                      </Text>
                    </Box>
                    <Badge
                      size="lg"
                      variant="solid"
                      colorPalette={currentStock > 0 ? "green" : "red"}
                    >
                      Stock: {currentStock}
                    </Badge>
                  </Flex>

                  <Flex gap="2" flexWrap="wrap">
                    <Badge size="md" variant="solid" colorPalette="blue">
                      Current: ${currentPrice.toFixed(2)}
                    </Badge>
                    <Badge size="md" variant="outline" colorPalette="green">
                      Low: ${lowestPrice.toFixed(2)}
                    </Badge>
                    <Badge size="md" variant="outline" colorPalette="red">
                      High: ${highestPrice.toFixed(2)}
                    </Badge>
                  </Flex>

                  {/* Placeholder for stock graph */}
                  <Box></Box>
                </Flex>
              </Card.Body>
            </Card.Root>
          );
        })}
      </Flex>
    </Box>
  );
}

export { ProductVariants };
