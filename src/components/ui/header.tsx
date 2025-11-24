import { ColorModeButton } from "@/components/ui/color-mode";
import { Box, Container, Flex, Heading, Image, Tabs } from "@chakra-ui/react";

function Header() {
  return (
    <Box bg="bg.panel" py="2" shadow="xs">
      <Container>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex gap="2" alignItems="baseline">
            <Image src="/favicon.png" height="6" alignSelf="center" />
            <Heading as="h1" fontWeight="normal" size="md" color="fg.subtle">
              survivor.tools/
            </Heading>
            <Tabs.Root
              defaultValue="shop"
              variant="subtle"
              size="sm"
              css={{
                "--tabs-indicator-shadow": "none",
              }}
            >
              <Tabs.List>
                <Tabs.Trigger value="shop" px="4">
                  Shop
                </Tabs.Trigger>
                <Tabs.Trigger value="newletter" px="4" disabled>
                  Newsletter
                </Tabs.Trigger>
                <Tabs.Trigger value="kickstarter" px="4" disabled>
                  Kickstarter
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </Flex>
          <ColorModeButton />
        </Flex>
      </Container>
    </Box>
  );
}

export { Header };
