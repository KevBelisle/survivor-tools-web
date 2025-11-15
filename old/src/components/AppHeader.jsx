import {
  Box,
  Button,
  Container,
  createListCollection,
  Flex,
  Icon,
  Heading,
  HStack,
  Link as ChakraLink,
  Portal,
  Select,
  Spacer,
  Switch,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import { HiChatAlt } from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";

const sections = createListCollection({
  items: [
    { label: "Shop", value: "shop" },
    { label: "Newsletter", value: "newsletter" },
    { label: "Kickstarter", value: "kickstarter" },
  ],
});

const AppHeader = ({ backIcon }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const baseRoute = useLocation().pathname.split("/")[1];

  return (
    <Box
      bg={{ base: "white", _dark: "gray.800" }}
      borderBottomStyle="solid"
      borderBottomWidth="1px"
      borderBottomColor={{ base: "gray.300", _dark: "black" }}
      px="4"
      py="2"
    >
      <Container>
        <Flex px="4">
          <HStack align="baseline">
            <Link to={`/${baseRoute}`}>{backIcon}</Link>
            {useBreakpointValue({
              base: <></>,
              sm: (
                <Heading size="sm" fontWeight="normal" opacity="0.5">
                  archives.survivor.tools
                </Heading>
              ),
            })}

            <Select.Root
              collection={sections}
              fontWeight="bold"
              onValueChange={(e) => {
                navigate(`/${e.value[0]}`);
              }}
              width="300px"
              value={[baseRoute]}
              multiple={false}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {sections.items.map((section) => (
                      <Select.Item item={section} key={section.value}>
                        {section.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            {/* <Select
              variant="unstyled"
              value={baseRoute}
              onChange={(e) => {
                navigate(`/${e.currentTarget.value}`);
              }}
              fontWeight="bold"
            >
              <option key="1" value="shop">
                Shop
              </option>
              <option key="2" value="newsletter">
                Newsletter
              </option>
              <option key="3" value="kickstarter">
                Kickstarter
              </option>
            </Select>*/}
          </HStack>
          <Spacer />
          <HStack>
            <ChakraLink href="https://forms.gle/K49Rz9UHegcmZoRt9" isExternal>
              <Button size="xs" mr={2}>
                {useBreakpointValue({
                  base: <Icon as={HiChatAlt} />,
                  sm: (
                    <>
                      <Icon as={HiChatAlt} mr={1} /> Feedback?
                    </>
                  ),
                })}
              </Button>
            </ChakraLink>
            <Text fontSize="sm">Light</Text>
            <Switch.Root
              size="sm"
              checked={theme === "dark"}
              onCheckedChange={(e) => setTheme(e.checked ? "dark" : "light")}
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Root>
            <Text fontSize="sm">Dark</Text>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default AppHeader;
