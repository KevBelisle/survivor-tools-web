import { Badge, Card, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { NewsItemSummary } from "@/news/types";

interface NewsItemCardProps {
  item: NewsItemSummary;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
}

function NewsItemCard({ item }: NewsItemCardProps) {
  return (
    <Link to="/news/$itemId" params={{ itemId: String(item.id) }}>
      <Card.Root
        variant="subtle"
        bg="bg.muted"
        boxShadow="xs"
        _hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
        transition="all 0.15s"
        cursor="pointer"
        size="sm"
        overflow="hidden"
      >
        <Card.Header bgColor="bg.panel" py="3">
          <Card.Title fontSize="md" alignItems="center">
            <Badge
              colorPalette="gray"
              bgColor="gray.400"
              variant="solid"
              mr="2"
              width="28"
              justifyContent="center"
            >
              {new Date(item.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Badge>{" "}
            {item.title}
          </Card.Title>
        </Card.Header>
        <Card.Body py="3">
          {item.bodyText && (
            <Text
              fontSize="sm"
              color="fg.subtle"
              mt="1"
              lineClamp={2}
              wordBreak="break-word"
            >
              {truncateText(item.bodyText, 400)}
            </Text>
          )}
        </Card.Body>
      </Card.Root>
    </Link>
  );
}

export { NewsItemCard };
