import {
  Container,
  createListCollection,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  Popover,
  Portal,
  Select as ChakraSelect,
  Separator,
  Text,
  type ListCollection,
} from "@chakra-ui/react";
import { getRouteApi } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { LuFilter } from "react-icons/lu";

const shopRoute = getRouteApi("/shop/");

const sortOptions = createListCollection({
  items: [
    { label: "Sort by state", value: "state" },
    { label: "Sort by name", value: "name" },
    { label: "Sort by first seen date (asc)", value: "firstSeenAtAsc" },
    { label: "Sort by first seen date (desc)", value: "firstSeenAtDesc" },
  ],
});

const productStates = createListCollection({
  items: [
    { label: "In Stock", value: "instock" },
    { label: "Out of Stock", value: "outofstock" },
    { label: "Unlisted", value: "unlisted" },
  ],
});

function Select({
  collection,
  multiple,
  hideClearTrigger,
  placeholder,
  value,
  onValueChange,
}: {
  collection: ListCollection;
  multiple?: boolean | undefined;
  hideClearTrigger?: boolean | undefined;
  placeholder?: string | undefined;
  value?: string[];
  onValueChange?: (details: { value: string[] }) => void;
}) {
  return (
    <ChakraSelect.Root
      collection={collection}
      size="sm"
      positioning={{ sameWidth: true, placement: "bottom" }}
      multiple={multiple}
      variant="subtle"
      value={value}
      onValueChange={onValueChange}
    >
      <ChakraSelect.HiddenSelect />
      <ChakraSelect.Control>
        <ChakraSelect.Trigger>
          <ChakraSelect.ValueText placeholder={placeholder} />
        </ChakraSelect.Trigger>
        <ChakraSelect.IndicatorGroup>
          {!hideClearTrigger && <ChakraSelect.ClearTrigger />}
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

function SearchBar({ tags, types }: { tags: string[]; types: string[] }) {
  const {
    query,
    sort,
    states,
    tags: selectedTags,
    types: selectedTypes,
  } = shopRoute.useSearch();
  const navigate = shopRoute.useNavigate();

  // Local state for input (for debouncing)
  const [inputValue, setInputValue] = useState(query);
  const [showHint, setShowHint] = useState(false);

  // Sync local state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Show hint after 1 second if input has 1-2 characters
  useEffect(() => {
    if (inputValue.length > 0 && inputValue.length < 3) {
      const timeoutId = setTimeout(() => {
        setShowHint(true);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    setShowHint(false);
  }, [inputValue]);

  // Debounced navigation to update URL
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

  const typesCollection = createListCollection({
    items: types.map((type) => ({
      label: type,
      value: type,
    })),
  });

  const tagsCollection = createListCollection({
    items: tags.map((tag) => ({
      label: tag,
      value: tag,
    })),
  });

  return (
    <Container>
      <Flex
        borderBottomRadius="sm"
        p="4"
        gap="4"
        bg={{ base: "gray.300", _dark: "gray.700" }}
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
            placeholder="Search products..."
            value={inputValue}
            onChange={handleInputChange}
          />
        </InputGroup>
        <Popover.Root positioning={{ placement: "bottom-end" }} modal={true}>
          <Popover.Trigger asChild>
            <IconButton variant="surface" boxShadow="none">
              <LuFilter />
            </IconButton>
          </Popover.Trigger>
          <Portal>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Arrow />
                <Popover.Body display="flex" flexDirection="column" gap="4">
                  <Select
                    collection={sortOptions}
                    hideClearTrigger
                    value={[sort]}
                    onValueChange={(details) =>
                      navigate({
                        search: (prev) => ({
                          ...prev,
                          sort: details.value[0],
                        }),
                        replace: true,
                      })
                    }
                  />
                  <Separator />
                  <Heading size="sm">Filter by</Heading>
                  <Select
                    collection={productStates}
                    placeholder="Product state"
                    multiple
                    value={states}
                    onValueChange={(details) =>
                      navigate({
                        search: (prev) => ({
                          ...prev,
                          states: details.value,
                        }),
                        replace: true,
                      })
                    }
                  />
                  <Select
                    collection={tagsCollection}
                    placeholder="Product tags"
                    multiple
                    value={selectedTags}
                    onValueChange={(details) =>
                      navigate({
                        search: (prev) => ({
                          ...prev,
                          tags: details.value,
                        }),
                        replace: true,
                      })
                    }
                  />
                  <Select
                    collection={typesCollection}
                    placeholder="Product types"
                    multiple
                    value={selectedTypes}
                    onValueChange={(details) =>
                      navigate({
                        search: (prev) => ({
                          ...prev,
                          types: details.value,
                        }),
                        replace: true,
                      })
                    }
                  />
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      </Flex>
    </Container>
  );
}

export { SearchBar };
