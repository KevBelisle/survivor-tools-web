import { Box, Image, Flex, Link } from "@chakra-ui/react";
import type { ProductImage } from "@/shop/types";

interface ProductImagesProps {
  images: ProductImage[];
}

function ProductImages({ images }: ProductImagesProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <Box
      bg={{ base: "white", _dark: "gray.800" }}
      borderRadius="lg"
      overflow="hidden"
      shadow="sm"
      p="4"
    >
      <Flex gap="4">
        {images.map((image) => {
          const [filename, extension] = image.uri.split(".");
          const imgSrc = `https://archives.survivor.tools/images/${filename}-thumbnail.${extension}`;
          const fullImgSrc = `https://archives.survivor.tools/images/${filename}.${extension}`;
          return (
            <Link
              key={image.imageId ?? image.uri}
              href={fullImgSrc}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={imgSrc}
                alt={image.alt}
                width="120px"
                height="120px"
                bg="white"
                loading="lazy"
                borderRadius="md"
                cursor="pointer"
              />
            </Link>
          );
        })}
      </Flex>
    </Box>
  );
}

export { ProductImages };
