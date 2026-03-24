import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, retainSearchParams } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Container,
  createListCollection,
  Flex,
  Icon,
  Input,
  InputGroup,
  Select as ChakraSelect,
  Text,
  Timeline,
  type ListCollection,
} from "@chakra-ui/react";

import { LuMail } from "react-icons/lu";
import { SiKickstarter } from "react-icons/si";
import useFuse from "@/hooks/useFuse";
import { fetchNewsItems } from "@/news/api";
import { NewsItemCard } from "@/news/components/NewsItemCard";
import type { NewsItemSummary } from "@/news/types";

type NewsSearch = {
  query: string;
  source: string;
};

const sourceOptions = createListCollection({
  items: [
    { label: "All Sources", value: "" },
    { label: "Kingdom Death: Monster", value: "Kingdom Death: Monster" },
    {
      label: "Kingdom Death: Monster 1.5",
      value: "Kingdom Death: Monster 1.5",
    },
    { label: "Newsletter", value: "Newsletter" },
  ],
});

export const Route = createFileRoute("/news/")({
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData({
      queryKey: ["newsItems"],
      queryFn: () => fetchNewsItems(),
    });
  },
  validateSearch: (search: Record<string, unknown>): NewsSearch => {
    return {
      query: (search.query as string) || "",
      source: (search.source as string) || "",
    };
  },
  search: {
    middlewares: [retainSearchParams(true)],
  },
  component: RouteComponent,
});

function SourceSelect({
  collection,
  value,
  onValueChange,
}: {
  collection: ListCollection;
  value: string[];
  onValueChange: (details: { value: string[] }) => void;
}) {
  return (
    <ChakraSelect.Root
      collection={collection}
      size="md"
      positioning={{ sameWidth: true, placement: "bottom" }}
      variant="subtle"
      value={value}
      onValueChange={onValueChange}
      width="250px"
    >
      <ChakraSelect.HiddenSelect />
      <ChakraSelect.Control>
        <ChakraSelect.Trigger>
          <ChakraSelect.ValueText placeholder="All Sources" />
        </ChakraSelect.Trigger>
        <ChakraSelect.IndicatorGroup>
          <ChakraSelect.ClearTrigger />
          <ChakraSelect.Indicator />
        </ChakraSelect.IndicatorGroup>
      </ChakraSelect.Control>
      <ChakraSelect.Positioner>
        <ChakraSelect.Content width="full">
          {collection.items.map((item) => (
            <ChakraSelect.Item item={item} key={item.value}>
              {item.label}
              <ChakraSelect.ItemIndicator />
            </ChakraSelect.Item>
          ))}
        </ChakraSelect.Content>
      </ChakraSelect.Positioner>
    </ChakraSelect.Root>
  );
}

type TimelineEntry =
  | { type: "year"; label: string }
  | { type: "item"; item: NewsItemSummary };

/** Flatten items into timeline entries, inserting a year header when the year changes. */
function buildTimelineEntries(items: NewsItemSummary[]): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  let currentYear = "";

  for (const item of items) {
    const year = String(new Date(item.publishedAt).getFullYear());
    if (year !== currentYear) {
      currentYear = year;
      entries.push({ type: "year", label: year });
    }
    entries.push({ type: "item", item });
  }

  return entries;
}

function RouteComponent() {
  const { data } = useSuspenseQuery({
    queryKey: ["newsItems"],
    queryFn: () => fetchNewsItems(),
  });

  const { query, source }: NewsSearch = Route.useSearch();
  const navigate = Route.useNavigate();

  const [inputValue, setInputValue] = useState(query);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    if (inputValue.length > 0 && inputValue.length < 3) {
      const timeoutId = setTimeout(() => setShowHint(true), 1000);
      return () => clearTimeout(timeoutId);
    }
    setShowHint(false);
  }, [inputValue]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue !== query) {
        navigate({
          search: (prev) => ({ ...prev, query: inputValue }),
          replace: true,
        });
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue, query, navigate]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [],
  );

  // Filter by source
  const sourceFiltered = useMemo(() => {
    if (!source) return data.items;
    return data.items.filter((item) => item.sourceLabel === source);
  }, [data.items, source]);

  const fuseResults = useFuse(sourceFiltered, inputValue, {
    keys: ["title", "bodyText"],
    minMatchCharLength: 3,
    threshold: 0.2,
    ignoreLocation: true,
    shouldSort: false,
  });

  const items = useMemo(() => {
    if (inputValue.length >= 3) {
      return fuseResults.map((a) => a.item);
    }
    return sourceFiltered;
  }, [fuseResults, inputValue, sourceFiltered]);

  const entries = useMemo(() => buildTimelineEntries(items), [items]);

  return (
    <Container maxW="container.md">
      <Flex
        borderRadius="sm"
        p="4"
        gap="4"
        bg={{ base: "gray.300", _dark: "gray.700" }}
        mb={8}
      >
        <InputGroup
          flex="1"
          endElement={
            showHint ? (
              <Text color="fg.muted" textStyle="xs">
                (min. 3 characters)
              </Text>
            ) : undefined
          }
        >
          <Input
            variant="subtle"
            placeholder="Search news..."
            value={inputValue}
            onChange={handleInputChange}
          />
        </InputGroup>
        <SourceSelect
          collection={sourceOptions}
          value={source ? [source] : []}
          onValueChange={(details) =>
            navigate({
              search: (prev) => ({
                ...prev,
                source: details.value[0] || "",
              }),
              replace: true,
            })
          }
        />
      </Flex>

      {items.length === 0 ? (
        <Text color="fg.subtle" textAlign="center" py={8}>
          No news items found.
        </Text>
      ) : (
        <Timeline.Root size="lg" variant="subtle" showLastSeparator={true}>
          {entries.map((entry, idx) =>
            entry.type === "year" ? (
              <Timeline.Item key={`year-${entry.label}`}>
                <Timeline.Connector>
                  <Timeline.Separator borderColor="white" />
                  <Timeline.Indicator bgColor={"white"} />
                </Timeline.Connector>
                <Timeline.Content>
                  <Text fontWeight={"bold"}>{entry.label}</Text>
                </Timeline.Content>
              </Timeline.Item>
            ) : (
              <Timeline.Item key={entry.item.id}>
                <Timeline.Connector>
                  <Timeline.Separator borderColor="white" />
                  <Timeline.Indicator
                    colorPalette={
                      entry.item.source === "kickstarter" ? "green" : "blue"
                    }
                    transform="translate(0, 13px)"
                  >
                    <Icon fontSize="xs">
                      {entry.item.source === "kickstarter" ? (
                        <SiKickstarter />
                      ) : (
                        <LuMail />
                      )}
                    </Icon>
                  </Timeline.Indicator>
                </Timeline.Connector>
                <Timeline.Content
                  pb={entries[idx + 1]?.type === "year" ? "9" : "3"}
                  width="full"
                >
                  <NewsItemCard item={entry.item} />
                </Timeline.Content>
              </Timeline.Item>
            ),
          )}
        </Timeline.Root>
      )}
    </Container>
  );
}
