import { ColorModeButton } from "@/components/ui/color-mode";
import { Box, Container, Flex, Heading, Image } from "@chakra-ui/react";
import { useRouterState, Link } from "@tanstack/react-router";

const NAV_TABS = [
  { value: "shop", label: "Shop", to: "/shop" },
  { value: "news", label: "News", to: "/news" },
  { value: "events", label: "Sales Events", to: "/events" },
] as const;

function Header() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const activeValue = pathname.startsWith("/news")
    ? "news"
    : pathname.startsWith("/events")
      ? "events"
      : "shop";

  return (
    <Box bg="bg.panel" py="2" shadow="xs">
      <Container>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex gap="2" alignItems="baseline">
            <Image src="/favicon.png" height="6" alignSelf="center" />
            <Heading as="h1" fontWeight="normal" size="md" color="fg.subtle">
              survivor.tools/
            </Heading>
            <Flex gap="1" alignItems="center">
              {NAV_TABS.map((tab) => {
                const isActive = tab.value === activeValue;
                return (
                  <Link key={tab.value} to={tab.to}>
                    <Box
                      px="4"
                      py="1"
                      fontSize="sm"
                      fontWeight="medium"
                      borderRadius="sm"
                      color={isActive ? "fg" : "fg.muted"}
                      bg={isActive ? "bg.muted" : "transparent"}
                      _hover={{
                        bg: isActive ? "bg.muted" : "bg.subtle",
                        color: "fg",
                      }}
                      transition="background-color 0.15s, color 0.15s"
                    >
                      {tab.label}
                    </Box>
                  </Link>
                );
              })}
            </Flex>
          </Flex>
          <ColorModeButton />
        </Flex>
      </Container>
    </Box>
  );
}

export { Header };
