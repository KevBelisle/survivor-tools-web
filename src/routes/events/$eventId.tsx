import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Box,
  Container,
  Flex,
  Heading,
  Separator,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { LuMail } from "react-icons/lu";
import { SiKickstarter } from "react-icons/si";
import { fetchEvent } from "@/events/api";
import {
  CHANGE_TYPE_META,
  CHANGE_TYPE_ORDER,
  dedupeProductChanges,
} from "@/events/changeTypes";
import { EventPageHeader } from "@/events/components/EventPageHeader";
import { ProductChangeCard } from "@/events/components/ProductChangeCard";
import type { EventChangeType, EventProductChange } from "@/events/types";

export const Route = createFileRoute("/events/$eventId")({
  loader: ({ context: { queryClient }, params }) => {
    return queryClient.ensureQueryData({
      queryKey: ["event", params.eventId],
      queryFn: () => fetchEvent(Number(params.eventId)),
    });
  },
  component: RouteComponent,
});

function formatStartDate(startedAt: string) {
  return new Date(startedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatStartTime(startedAt: string) {
  return new Date(startedAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatTile({
  count,
  label,
  colorPalette,
}: {
  count: number;
  label: string;
  colorPalette: string;
}) {
  return (
    <Box
      bg={`${colorPalette}.subtle`}
      borderWidth="1px"
      borderColor={`${colorPalette}.muted`}
      borderRadius="md"
      color={`${colorPalette}.fg`}
      px="3"
      py="2.5"
      minW="20"
    >
      <Text
        fontSize="3xl"
        fontWeight="semibold"
        lineHeight="1"
        fontVariantNumeric="tabular-nums"
      >
        {count}
      </Text>
      <Text
        fontSize="xs"
        textTransform="uppercase"
        letterSpacing="wider"
        fontWeight="medium"
        opacity="0.85"
        mt="1.5"
      >
        {label}
      </Text>
    </Box>
  );
}

function PageCard({ children }: { children: React.ReactNode }) {
  return (
    <Box
      bg={{ base: "white", _dark: "gray.800" }}
      borderRadius="lg"
      overflow="hidden"
      shadow="sm"
      p="4"
    >
      {children}
    </Box>
  );
}

function RouteComponent() {
  const { eventId } = Route.useParams();
  const { data: event } = useSuspenseQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEvent(Number(eventId)),
  });

  const dedupedChanges = dedupeProductChanges(event.productChanges);

  const grouped = new Map<EventChangeType, EventProductChange[]>();
  for (const c of dedupedChanges) {
    const list = grouped.get(c.changeType) ?? [];
    list.push(c);
    grouped.set(c.changeType, list);
  }
  for (const list of grouped.values()) {
    list.sort((a, b) => a.product.title.localeCompare(b.product.title));
  }

  return (
    <>
      <EventPageHeader />
      <Container maxW="container.xl" py={6}>
        <Flex direction="column" gap={6}>
          <PageCard>
            <Flex
              direction={{ base: "column", md: "row" }}
              align={{ md: "flex-end" }}
              justify="space-between"
              gap={{ base: "5", md: "8" }}
            >
              <Box flex="1" minW="0">
                <Heading
                  as="h1"
                  size="4xl"
                  fontWeight="semibold"
                  letterSpacing="-0.02em"
                  lineHeight="1"
                  mb="2"
                >
                  {formatStartDate(event.startedAt)}
                </Heading>
                <Text fontSize="sm" letterSpacing="wide">
                  <Text as="span" color="fg.subtle">
                    Detected at{" "}
                  </Text>
                  <Text
                    as="span"
                    fontWeight="semibold"
                    fontVariantNumeric="tabular-nums"
                  >
                    {formatStartTime(event.startedAt)}
                  </Text>
                </Text>
              </Box>
              <SimpleGrid
                columns={{ base: 2, sm: 4 }}
                gap="2"
                flexShrink={0}
                alignSelf={{ base: "stretch", md: "flex-end" }}
              >
                {CHANGE_TYPE_ORDER.map((type) => {
                  const count = grouped.get(type)?.length ?? 0;
                  const meta = CHANGE_TYPE_META[type];
                  return (
                    <StatTile
                      key={type}
                      count={count}
                      label={meta.label}
                      colorPalette={meta.colorPalette}
                    />
                  );
                })}
              </SimpleGrid>
            </Flex>
            {event.newsItems.length > 0 && (
              <>
                <Separator my="5" />
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color="fg.muted"
                  textTransform="uppercase"
                  letterSpacing="widest"
                  mb="3"
                >
                  Related news
                </Text>
                <Flex direction="column" gap="0.5">
                  {event.newsItems.map((item) => (
                    <Link
                      key={item.id}
                      to="/news/$itemId"
                      params={{ itemId: String(item.id) }}
                    >
                      <Flex
                        align="flex-start"
                        gap="3"
                        py="1.5"
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
                        <Flex
                          flex="1"
                          minW="0"
                          direction={{ base: "column", sm: "row" }}
                          gap={{ base: "0.5", sm: "3" }}
                          align={{ sm: "flex-start" }}
                        >
                          <Text
                            fontSize="sm"
                            flex="1"
                            order={{ base: 2, sm: 1 }}
                          >
                            {item.title}
                          </Text>
                          <Text
                            fontSize="xs"
                            color="fg.subtle"
                            flexShrink={0}
                            mt={{ sm: "0.5" }}
                            order={{ base: 1, sm: 2 }}
                          >
                            {item.sourceLabel}
                          </Text>
                        </Flex>
                      </Flex>
                    </Link>
                  ))}
                </Flex>
              </>
            )}
          </PageCard>

          {CHANGE_TYPE_ORDER.map((type) => {
            const changes = grouped.get(type);
            if (!changes || changes.length === 0) return null;
            const meta = CHANGE_TYPE_META[type];
            const sectionTitle =
              meta.sectionLabel.charAt(0).toUpperCase() +
              meta.sectionLabel.slice(1);
            return (
              <Box key={type}>
                <Heading as="h2" size="2xl" mb="4">
                  {changes.length} {sectionTitle}
                </Heading>
                <SimpleGrid
                  columns={{ base: 2, sm: 3, md: 4, lg: 6, xl: 8 }}
                  gap="4"
                >
                  {changes.map((change) => (
                    <ProductChangeCard
                      key={`${change.productId}-${change.variantId}-${change.recordedAt}`}
                      change={change}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            );
          })}
        </Flex>
      </Container>
    </>
  );
}
