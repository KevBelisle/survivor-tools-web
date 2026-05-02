import { Box, Flex, Image, Link } from "@chakra-ui/react";
import type { ProductImage } from "@/shop/types";

interface ProductImagesProps {
	images: ProductImage[];
}

function ProductImages({ images }: ProductImagesProps) {
	const thumbnails = images.slice(1);
	if (thumbnails.length === 0) {
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
			<Flex gap="4" flexWrap="wrap">
				{thumbnails.map((image) => {
					const imgSrc = image.thumbnailUri ?? image.uri;
					const fullImgSrc = image.uri;
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
