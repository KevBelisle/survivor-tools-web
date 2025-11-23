import { Card, Image, Badge, Skeleton } from "@chakra-ui/react";
import type { Product } from "@/shop/types";

interface ProductCardProps {
  product: Product;
}

function getStateBadgeColorScheme(state: Product["state"]) {
  switch (state) {
    case "inStock":
      return "green";
    case "outOfStock":
      return "orange";
    case "unlisted":
      return "gray";
    default:
      return "gray";
  }
}

function getStateLabel(state: Product["state"]) {
  switch (state) {
    case "inStock":
      return "In Stock";
    case "outOfStock":
      return "Out of Stock";
    case "unlisted":
      return "Unlisted";
    default:
      return state;
  }
}

function ProductCard({ product }: ProductCardProps) {
  const imgHeight = (320 / product.image.width) * product.image.height;
  const [filename, extension] = product.image.uri.split(".");
  const imgSrc = `https://archives.survivor.tools/images/${filename}-preview.${extension}`;
  return (
    <Card.Root
      w="320px"
      variant="subtle"
      overflow="hidden"
      bg="bg.muted"
      boxShadow="xs"
    >
      <Image
        src={imgSrc}
        alt={product.image.alt}
        htmlWidth="320px"
        htmlHeight={`${imgHeight}px`}
        bg="white"
        loading="lazy"
      />
      <Card.Body
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
        py="2"
        px="4"
        gap="2"
        borderTop="1px solid"
        borderColor="border.emphasized"
      >
        <Card.Title fontSize="md">{product.title}</Card.Title>

        <Badge
          colorPalette={getStateBadgeColorScheme(product.state)}
          variant="solid"
          mt="1"
        >
          {getStateLabel(product.state)}
        </Badge>
      </Card.Body>
    </Card.Root>
  );
}

interface SkeletonProductCardProps {
  imageHeight?: number;
}

function SkeletonProductCard({ imageHeight = 320 }: SkeletonProductCardProps) {
  return (
    <Card.Root
      w="320px"
      variant="subtle"
      overflow="hidden"
      bg="bg.muted"
      boxShadow="xs"
    >
      <Skeleton
        height={`${imageHeight}px`}
        variant="shine"
        css={{
          "--start-color": "colors.gray.100",
          "--end-color": "colors.white",
        }}
      />
      <Card.Body
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        py="3"
        px="4"
        gap="2"
        borderTop="1px solid"
        borderColor="border.emphasized"
      >
        <Skeleton
          height="6"
          width="60%"
          variant="shine"
          css={{
            "--start-color": "colors.gray.100",
            "--end-color": "colors.gray.300",
          }}
        />
        <Skeleton
          height="5"
          width="70px"
          borderRadius="sm"
          variant="shine"
          css={{
            "--start-color": "colors.gray.100",
            "--end-color": "colors.gray.300",
          }}
        />
      </Card.Body>
    </Card.Root>
  );
}

export { ProductCard, SkeletonProductCard };
