import { Badge, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { CHANGE_TYPE_META } from "@/events/changeTypes";
import type { EventProductChange } from "@/events/types";

function ProductChangeCard({ change }: { change: EventProductChange }) {
  const img = change.product.primaryImage;
  const thumb = img?.previewUri ?? img?.uri ?? img?.thumbnailUri;
  const meta = CHANGE_TYPE_META[change.changeType];
  return (
    <Link
      to="/shop/$productId"
      params={{ productId: change.product.id }}
      style={{ textDecoration: "none" }}
    >
      <Box
        borderRadius="sm"
        overflow="hidden"
        bg="bg.subtle"
        boxShadow="xs"
        _hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
        transition="all 0.15s"
      >
        <Box position="relative" bg="white" aspectRatio={1}>
          {thumb ? (
            <Image
              src={thumb}
              alt={img?.alt ?? change.product.title}
              w="full"
              h="full"
              objectFit="cover"
              loading="lazy"
            />
          ) : (
            <Flex h="full" align="center" justify="center">
              <Text fontSize="xs" color="fg.subtle">
                No image
              </Text>
            </Flex>
          )}
          <Badge
            position="absolute"
            top="1"
            left="1"
            colorPalette={meta.colorPalette}
            variant="surface"
          >
            {meta.label}
          </Badge>
        </Box>
        <Box px="2" py="1">
          <Text
            fontSize="sm"
            lineClamp={3}
            color="fg"
            title={change.product.title}
          >
            {change.product.title}
          </Text>
        </Box>
      </Box>
    </Link>
  );
}

export { ProductChangeCard };
