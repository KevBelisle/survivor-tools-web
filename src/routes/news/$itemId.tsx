import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Box, Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
import { fetchNewsItem } from "@/news/api";
import { NewsPageHeader } from "@/news/components/NewsPageHeader";

export const Route = createFileRoute("/news/$itemId")({
  loader: ({ context: { queryClient }, params }) => {
    return queryClient.ensureQueryData({
      queryKey: ["newsItem", params.itemId],
      queryFn: () => fetchNewsItem(Number(params.itemId)),
    });
  },
  component: RouteComponent,
});

function getSourceBadgeColor(source: string) {
  switch (source) {
    case "kickstarter":
      return "green";
    case "newsletter":
      return "blue";
    default:
      return "gray";
  }
}

function RouteComponent() {
  const { itemId } = Route.useParams();

  const { data } = useSuspenseQuery({
    queryKey: ["newsItem", itemId],
    queryFn: () => fetchNewsItem(Number(itemId)),
  });

  return (
    <>
      <NewsPageHeader />
      <Container maxW="700px" py={6}>
        <Box
          bg={{ base: "white", _dark: "gray.800" }}
          borderRadius="lg"
          overflow="hidden"
          shadow="sm"
        >
          <Box
            bg={{ base: "gray.100", _dark: "gray.900" }}
            px="4"
            py="2"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap="2"
          >
            <Text fontSize="sm" color="fg.subtle">
              {new Date(data.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            {data.sourceUrl && (
              <a
                href={data.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="xs" variant="outline" colorPalette="cyan">
                  View original <LuExternalLink />
                </Button>
              </a>
            )}
          </Box>

          <Flex p="4" gap="4" direction="column">
            <Text color={getSourceBadgeColor(data.source)} fontSize="sm">
              {data.sourceLabel}
            </Text>
            <Heading as="h1" size="4xl">
              {data.title}
            </Heading>

            {data.bodyHtml ? (
              <Box
                dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
                css={{
                  "& p": { marginBottom: "1rem" },
                  "& ul, & ol": { marginLeft: "1.5rem", marginBottom: "1rem" },
                  "& h2": {
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    marginTop: "1.5rem",
                    marginBottom: "0.75rem",
                  },
                  "& h3": {
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    marginTop: "1.25rem",
                    marginBottom: "0.5rem",
                  },
                  "& a": {
                    textDecoration: "underline",
                  },
                  "& img": {
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "0.375rem",
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                    color: "gray.400",
                    fontSize: "0.875rem",
                    border: "1px solid",
                    borderColor: "gray.200",
                    padding: "0.5rem",
                    lineHeight: "1.6",
                    textIndent: "0.5rem",
                  },
                  "& video": {
                    width: "100%",
                    height: "auto",
                    borderRadius: "0.375rem",
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                  },
                }}
              />
            ) : (
              <Text color="fg.subtle">Content not yet available.</Text>
            )}
          </Flex>
        </Box>
      </Container>
    </>
  );
}
