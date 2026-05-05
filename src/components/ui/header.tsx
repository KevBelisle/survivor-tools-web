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
        <Flex alignItems="center" wrap="wrap" rowGap="2" columnGap="2">
          <Image src="/favicon.png" height="6" alignSelf="center" />
          <Heading as="h1" fontWeight="normal" size="md" color="fg.subtle">
            survivor.tools/
          </Heading>
          <ColorModeButton order={{ base: 3, sm: 4 }} ml="auto" />
          <Flex
            gap="1"
            alignItems="center"
            order={{ base: 4, sm: 3 }}
            width={{ base: "100%", sm: "auto" }}
          >
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
      </Container>
    </Box>
  );
}

export { Header };
