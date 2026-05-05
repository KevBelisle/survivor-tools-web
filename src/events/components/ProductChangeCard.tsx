import { Badge, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { CHANGE_TYPE_META } from "@/events/changeTypes";
import type { EventProductChange } from "@/events/types";

function formatPrice(value: string | null): string | null {
  if (value === null) return null;
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n)) return null;
  const hasCents = Math.round(n * 100) % 100 !== 0;
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

function ProductChangeCard({ change }: { change: EventProductChange }) {
  const img = change.product.primaryImage;
  const thumb = img?.previewUri ?? img?.uri ?? img?.thumbnailUri;
  const meta = CHANGE_TYPE_META[change.changeType];
  const isPriceChange =
    change.changeType === "price_increase" ||
    change.changeType === "price_decrease";
  const oldPrice = isPriceChange ? formatPrice(change.oldValue) : null;
  const newPrice = isPriceChange ? formatPrice(change.newValue) : null;
  const arrow = change.changeType === "price_increase" ? "↗" : "↘";

  let restockDelta: number | null = null;
  if (
    change.changeType === "restock" &&
    change.oldValue !== null &&
    change.newValue !== null
  ) {
    const oldN = Number.parseInt(change.oldValue, 10);
    const newN = Number.parseInt(change.newValue, 10);
    if (Number.isFinite(oldN) && Number.isFinite(newN)) {
      restockDelta = newN - oldN;
    }
  }

  let newProductStock: number | null = null;
  if (change.changeType === "new_product" && change.newValue !== null) {
    const n = Number.parseInt(change.newValue, 10);
    if (Number.isFinite(n)) newProductStock = n;
  }

  let badgeContent: string = meta.label;
  if (isPriceChange && oldPrice && newPrice) {
    badgeContent = `${oldPrice} ${arrow} ${newPrice}`;
  } else if (restockDelta !== null && restockDelta > 0) {
    badgeContent = `Restocked +${restockDelta.toLocaleString("en-US")}`;
  } else if (newProductStock !== null && newProductStock > 0) {
    badgeContent = `New +${newProductStock.toLocaleString("en-US")}`;
  }
  return (
    <Link
      to="/shop/$productId"
      params={{ productId: change.product.id }}
      style={{ textDecoration: "none" }}
    >
      <Box
        borderRadius="md"
        overflow="hidden"
        bg="bg.subtle"
        boxShadow="sm"
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
            size="md"
            colorPalette={meta.colorPalette}
            variant="surface"
          >
            {badgeContent}
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
