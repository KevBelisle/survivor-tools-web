import { ColorModeButton } from "@/components/ui/color-mode";
import { Box, Container, Flex, Heading, Image, Tabs } from "@chakra-ui/react";
import { useRouterState, Link } from "@tanstack/react-router";

function Header() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  // Determine active tab based on route
  const getActiveTab = () => {
    if (pathname.startsWith("/shop")) return "shop";
    if (pathname.startsWith("/news")) return "news";
    return "shop"; // Default to shop
  };

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
              value={getActiveTab()}
              variant="subtle"
              size="sm"
              css={{
                "--tabs-indicator-shadow": "none",
              }}
            >
              <Tabs.List>
                <Tabs.Trigger value="shop" px="4" asChild>
                  <Link to="/shop">Shop</Link>
                </Tabs.Trigger>
                <Tabs.Trigger value="news" px="4" asChild>
                  <Link to="/news">News</Link>
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
