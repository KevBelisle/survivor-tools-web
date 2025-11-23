import { Container } from "@chakra-ui/react";
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
  return (
    <Container my="8">
      <Masonry
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
