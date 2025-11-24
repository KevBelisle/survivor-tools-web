import { Container, Text } from "@chakra-ui/react";
import { Masonry } from "masonic";
import type { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { Link } from "@tanstack/react-router";

function MasonryCard({
  data: product,
}: {
  index: number;
  data: Product;
  width: number;
}) {
  return (
    <Link key={product.id} to={`/shop/${product.id}`}>
      <ProductCard product={product} />
    </Link>
  );
}

function ProductMasonry({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <Container my="8">
        <Text textAlign="center" color="gray.500">
          No products found
        </Text>
      </Container>
    );
  }

  // Create a key based on item IDs to force Masonry to remount when items change
  const masonryKey = products.map((p) => p.id).join(",");

  return (
    <Container my="8">
      <Masonry
        key={masonryKey}
        items={products}
        render={MasonryCard}
        columnWidth={320}
        columnGutter={20}
        itemKey={(product) => product.id}
      />
    </Container>
  );
}

export { ProductMasonry };
