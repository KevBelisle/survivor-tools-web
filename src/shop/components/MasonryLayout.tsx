import { Container, Text } from "@chakra-ui/react";
import { Masonry } from "masonic";
import type { Product } from "../types";
import { ProductCard, SkeletonProductCard } from "./ProductCard";
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

const [MIN_SKELETON_IMAGE_HEIGHT, MAX_SKELETON_IMAGE_HEIGHT] = [200, 450];
function getRandomHeight() {
  return (
    Math.floor(
      Math.random() *
        (MAX_SKELETON_IMAGE_HEIGHT - MIN_SKELETON_IMAGE_HEIGHT + 1),
    ) + MIN_SKELETON_IMAGE_HEIGHT
  );
}

const SKELETON_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  imageHeight: getRandomHeight(),
}));

function SkeletonMasonryCard({
  data,
}: {
  index: number;
  data: { id: number; imageHeight: number };
  width: number;
}) {
  return <SkeletonProductCard imageHeight={data.imageHeight} />;
}

function SkeletonProductMasonry() {
  return (
    <Container my="8">
      <Masonry
        items={SKELETON_ITEMS}
        render={SkeletonMasonryCard}
        columnWidth={320}
        columnGutter={20}
        itemKey={(item) => item.id}
      />
    </Container>
  );
}

export { ProductMasonry, SkeletonProductMasonry };
