import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { LuMail } from "react-icons/lu";
import { SiKickstarter } from "react-icons/si";
import {
  CHANGE_TYPE_META,
  CHANGE_TYPE_ORDER,
  CHANGE_TYPE_PRIORITY,
  dedupeProductChanges,
} from "@/events/changeTypes";
import { ProductChangeCard } from "@/events/components/ProductChangeCard";
import type { EventChangeType, SalesEvent } from "@/events/types";

interface EventCardProps {
  event: SalesEvent;
}

const VISIBLE_COUNTS = {
  base: 2,
  sm: 3,
  md: 4,
  lg: 6,
  xl: 8,
} as const;

function formatStartDate(startedAt: string) {
  return new Date(startedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatApproxStartTime(startedAt: string) {
  const start = new Date(startedAt);
  const rounded = new Date(start);
  const minutes = start.getMinutes();
  rounded.setMinutes(Math.round(minutes / 15) * 15, 0, 0);
  return rounded.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function MoreCard({ count, eventId }: { count: number; eventId: number }) {
  return (
    <Link to="/events/$eventId" params={{ eventId: String(eventId) }}>
      <Box
        borderRadius="sm"
        overflow="hidden"
        bg={{ base: "gray.200", _dark: "gray.700" }}
        boxShadow="xs"
        alignSelf="start"
        _hover={{ bg: { base: "gray.300", _dark: "gray.600" } }}
        transition="background-color 0.15s"
      >
        <Flex aspectRatio={1} direction="column" align="center" justify="center" gap="0.5">
          <Text fontSize="lg" fontWeight="semibold" color="fg.subtle">
            +{count}
          </Text>
          <Text fontSize="2xs" fontWeight="medium" color="fg.subtle" textTransform="uppercase" letterSpacing="wide">
            View all
          </Text>
        </Flex>
      </Box>
    </Link>
  );
}

function EventCard({ event }: EventCardProps) {
  const dedupedChanges = dedupeProductChanges(event.productChanges);

  const groupedCounts = new Map<EventChangeType, number>();
  for (const c of dedupedChanges) {
    groupedCounts.set(c.changeType, (groupedCounts.get(c.changeType) ?? 0) + 1);
  }

  const sortedChanges = [...dedupedChanges].sort((a, b) => {
    const pa = CHANGE_TYPE_PRIORITY[a.changeType];
    const pb = CHANGE_TYPE_PRIORITY[b.changeType];
    if (pa !== pb) return pa - pb;
    return a.product.title.localeCompare(b.product.title);
  });

  const visibleCount =
    useBreakpointValue(VISIBLE_COUNTS, { ssr: false }) ?? VISIBLE_COUNTS.base;

  const total = sortedChanges.length;
  const overflow = total > visibleCount;
  const cardsToShow = overflow
    ? sortedChanges.slice(0, visibleCount - 1)
    : sortedChanges;
  const moreCount = overflow ? total - (visibleCount - 1) : 0;

  return (
    <Card.Root variant="subtle" bg="bg.muted" boxShadow="xs" overflow="hidden">
      <Card.Header bgColor="bg.panel" py="3" px="4">
        <Flex align="center" justify="space-between" gap="3">
          <Flex align="baseline" gap="2">
            <Heading as="h2" size="sm">
              {formatStartDate(event.startedAt)}
            </Heading>
            <Text fontSize="sm" color="fg.subtle">
              ~{formatApproxStartTime(event.startedAt)}
            </Text>
          </Flex>
          <Badge asChild size="md" colorPalette="cyan" variant="subtle" flexShrink={0}>
            <Link to="/events/$eventId" params={{ eventId: String(event.id) }}>
              Details →
            </Link>
          </Badge>
        </Flex>
      </Card.Header>
      <Card.Body py="3" px="4" gap="3" flexDirection="column">
        <Flex justify="flex-end" gap="2" wrap="wrap">
          {CHANGE_TYPE_ORDER.map((type) => {
            const count = groupedCounts.get(type);
            if (!count) return null;
            const meta = CHANGE_TYPE_META[type];
            return (
              <Badge key={type} size="md" colorPalette={meta.colorPalette} variant="surface">
                {meta.label}: {count}
              </Badge>
            );
          })}
        </Flex>
        <Flex gap="4" flexDirection={{ base: "column", md: "row" }} alignItems="stretch">
        <Box
          flexBasis={{ md: "30%" }}
          flexShrink={0}
          display={
            event.newsItems.length === 0
              ? { base: "none", md: "block" }
              : "block"
          }
        >
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="fg.subtle"
            textTransform="uppercase"
            letterSpacing="wide"
            mb="2"
          >
            Related news
          </Text>
          {event.newsItems.length === 0 ? (
            <Text fontSize="sm" color="fg.subtle" fontStyle="italic">
              No news items
            </Text>
          ) : (
            <Flex direction="column" gap="1.5">
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
                        item.source === "kickstarter" ? "green.500" : "blue.500"
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
                    <Text fontSize="sm" flex="1" overflowWrap="anywhere">
                      {item.title}
                    </Text>
                  </Flex>
                </Link>
              ))}
            </Flex>
          )}
        </Box>
        <Box flex="1" minW="0">
          {total === 0 ? (
            <Text fontSize="sm" color="fg.subtle" fontStyle="italic">
              No product changes
            </Text>
          ) : (
            <SimpleGrid
              columns={{ base: 2, sm: 3, md: 4, lg: 6, xl: 8 }}
              gap="2"
            >
              {cardsToShow.map((change) => (
                <ProductChangeCard
                  key={`${change.productId}-${change.variantId}-${change.changeType}-${change.recordedAt}`}
                  change={change}
                />
              ))}
              {moreCount > 0 && <MoreCard count={moreCount} eventId={event.id} />}
            </SimpleGrid>
          )}
        </Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}

export { EventCard };
