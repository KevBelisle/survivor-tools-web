import { Badge, Box, Card, Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { LuMail } from "react-icons/lu";
import { SiKickstarter } from "react-icons/si";
import type {
  ProductEvent,
  ProductEventChange,
  ProductEventChangeType,
} from "@/shop/types";

interface ProductEventsProps {
  productId: string;
  events: ProductEvent[];
}

const CHANGE_TYPE_META: Record<
  ProductEventChangeType,
  { colorPalette: string }
> = {
  new_product: { colorPalette: "purple" },
  restock: { colorPalette: "green" },
  price_decrease: { colorPalette: "teal" },
  price_increase: { colorPalette: "orange" },
};

const CHANGE_TYPE_ORDER: ProductEventChangeType[] = [
  "new_product",
  "restock",
  "price_decrease",
  "price_increase",
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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

function badgeLabel(
  type: ProductEventChangeType,
  changes: ProductEventChange[],
): string {
  if (type === "price_increase" || type === "price_decrease") {
    const first = changes.find((c) => c.changeType === type);
    const oldPrice = formatPrice(first?.oldValue ?? null);
    const newPrice = formatPrice(first?.newValue ?? null);
    const arrow = type === "price_increase" ? "↗" : "↘";
    if (oldPrice && newPrice) return `${oldPrice} ${arrow} ${newPrice}`;
    return type === "price_increase" ? "Price ↗" : "Price ↘";
  }

  if (type === "restock") {
    let total = 0;
    for (const c of changes) {
      if (
        c.changeType !== "restock" ||
        c.oldValue === null ||
        c.newValue === null
      )
        continue;
      const delta =
        Number.parseInt(c.newValue, 10) - Number.parseInt(c.oldValue, 10);
      if (delta > 0) total += delta;
    }
    return total > 0
      ? `Restocked +${total.toLocaleString("en-US")}`
      : "Restocked";
  }

  if (type === "new_product") {
    let total = 0;
    for (const c of changes) {
      if (c.changeType !== "new_product" || c.newValue === null) continue;
      const n = Number.parseInt(c.newValue, 10);
      if (Number.isFinite(n) && n > 0) total += n;
    }
    return total > 0 ? `New +${total.toLocaleString("en-US")}` : "New";
  }

  return type;
}

function ProductEvents({ productId, events }: ProductEventsProps) {
  if (events.length === 0) return null;

  return (
    <Box>
      <Heading as="h2" size="2xl" mb="4">
        Sales Events
      </Heading>
      <Card.Root
        variant="subtle"
        bg={{ base: "white", _dark: "gray.900" }}
        shadow="sm"
      >
        <Card.Body p="0">
          {events.map((event, index) => {
            const myChanges = event.productChanges.filter(
              (c) => c.productId === productId,
            );
            const seenTypes = new Set<ProductEventChangeType>();
            const changeTypes: ProductEventChangeType[] = [];
            for (const c of myChanges) {
              if (!seenTypes.has(c.changeType)) {
                seenTypes.add(c.changeType);
                changeTypes.push(c.changeType);
              }
            }
            changeTypes.sort(
              (a, b) =>
                CHANGE_TYPE_ORDER.indexOf(a) - CHANGE_TYPE_ORDER.indexOf(b),
            );

            return (
              <Flex
                key={event.id}
                direction="column"
                gap="2"
                px="4"
                py="3"
                borderTopWidth={index > 0 ? "1px" : "0"}
                borderColor="border.subtle"
              >
                <Flex align="center" justify="space-between" gap="3">
                  <Flex gap="1.5" wrap="wrap">
                    {changeTypes.map((type) => (
                      <Badge
                        key={type}
                        size="md"
                        colorPalette={CHANGE_TYPE_META[type].colorPalette}
                        variant="surface"
                      >
                        {badgeLabel(type, myChanges)}
                      </Badge>
                    ))}
                  </Flex>
                  <Text
                    fontWeight="medium"
                    flexShrink={0}
                    flex="1"
                    textAlign="left"
                  >
                    {formatDate(event.startedAt)}
                  </Text>
                  <Badge
                    asChild
                    size="sm"
                    colorPalette="cyan"
                    variant="subtle"
                    flexShrink={0}
                  >
                    <Link
                      to="/events/$eventId"
                      params={{ eventId: String(event.id) }}
                    >
                      Details →
                    </Link>
                  </Badge>
                </Flex>
                {event.newsItems.length > 0 && (
                  <Flex direction="column" gap="0.5" pt="0.5">
                    {event.newsItems.map((item) => (
                      <Link
                        key={item.id}
                        to="/news/$itemId"
                        params={{ itemId: String(item.id) }}
                      >
                        <Flex
                          align="flex-start"
                          gap="2"
                          py="1"
                          px="2"
                          borderRadius="sm"
                          _hover={{ bg: "bg.emphasized" }}
                        >
                          <Box
                            color={
                              item.source === "kickstarter"
                                ? "green.500"
                                : "blue.500"
                            }
                            display="flex"
                            alignItems="center"
                            flexShrink={0}
                            h="1.43em"
                          >
                            {item.source === "kickstarter" ? (
                              <SiKickstarter />
                            ) : (
                              <LuMail />
                            )}
                          </Box>
                          <Text fontSize="sm" color="fg.subtle" flex="1">
                            {item.title}
                          </Text>
                        </Flex>
                      </Link>
                    ))}
                  </Flex>
                )}
              </Flex>
            );
          })}
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

export { ProductEvents };
