import {
  Container,
  Flex,
  IconButton,
  Input,
  InputGroup,
  Popover,
  Portal,
  Text,
} from "@chakra-ui/react";
import { getRouteApi } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { LuFilter } from "react-icons/lu";

const shopRoute = getRouteApi("/shop/");

function SearchBar() {
  const { query } = shopRoute.useSearch();
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

  return (
    <Container>
      <Flex borderBottomRadius="sm" p="4" gap="4" bg="gray.300">
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
            <IconButton variant="solid">
              <LuFilter />
            </IconButton>
          </Popover.Trigger>
          <Portal>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Arrow />
                <Popover.Body>
                  <Popover.Title fontWeight="medium">Naruto Form</Popover.Title>
                  <Text my="4">
                    Naruto is a Japanese manga series written and illustrated by
                    Masashi Kishimoto.
                  </Text>
                  <Input placeholder="Your fav. character" size="sm" />
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
