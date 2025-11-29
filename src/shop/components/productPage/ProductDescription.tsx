import { Link } from "@tanstack/react-router";
import {
  Box,
  Popover,
  Portal,
  Button,
  Text,
  Timeline,
  Badge,
  Flex,
  Span,
  Heading,
} from "@chakra-ui/react";
import { LuChevronDown, LuShoppingCart } from "react-icons/lu";
import type { ProductDetailResponse, SnapshotDetails } from "@/shop/types";

interface ProductDescriptionProps {
  productData: ProductDetailResponse;
  displayData: SnapshotDetails;
  snapshotId?: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const productState = {
  outOfStock: "out of stock",
  inStock: "in stock",
  unlisted: "unlisted",
};

function ProductDescription({
  productData,
  displayData,
  snapshotId,
}: ProductDescriptionProps) {
  return (
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
        flexWrap="wrap"
        alignItems="baseline"
      >
        <Span display="flex" gap="4" alignItems="baseline">
          {productData.state != "unlisted" ? (
            <Link
              to={`https://shop.kingdomdeath.com/products/${productData.handle}`}
              target="_blank"
            >
              <Button size="xs" variant="outline" colorPalette="cyan">
                To Shop <LuShoppingCart />
              </Button>
            </Link>
          ) : null}
          <Text fontSize="xs">
            Currently {productState[productData.state]}
            {productData.state == "unlisted" && productData.snapshot.unlistedAt
              ? ` (as of ${dateFormatter.format(Date.parse(productData.snapshot.unlistedAt))}).`
              : "."}
          </Text>
        </Span>

        <Popover.Root positioning={{ placement: "bottom-end" }}>
          <Popover.Trigger asChild>
            <Button variant="outline" size="xs" colorPalette="cyan">
              Snapshot on{" "}
              {dateFormatter.format(Date.parse(displayData.snapshotAt))}{" "}
              <LuChevronDown />
            </Button>
          </Popover.Trigger>
          <Portal>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Arrow />
                <Popover.Body display="flex" flexDirection="column" gap="4">
                  <Timeline.Root size="sm" variant="subtle">
                    {productData.snapshots.map((snapshot) => {
                      const selected =
                        (snapshotId ?? productData.snapshot.id) == snapshot.id;
                      return (
                        <Timeline.Item
                          colorPalette={selected ? "teal" : "current"}
                          key={snapshot.id}
                        >
                          <Timeline.Connector>
                            <Timeline.Separator />
                            <Timeline.Indicator></Timeline.Indicator>
                          </Timeline.Connector>
                          <Timeline.Content>
                            <Link
                              to="/shop/$productId"
                              params={{ productId: productData.id }}
                              search={{ snapshotId: snapshot.id }}
                              replace={true}
                            >
                              <Timeline.Title
                                fontWeight={selected ? "bold" : "normal"}
                              >
                                {dateFormatter.format(
                                  Date.parse(snapshot.snapshotAt),
                                )}
                              </Timeline.Title>
                            </Link>
                          </Timeline.Content>
                        </Timeline.Item>
                      );
                    })}
                  </Timeline.Root>
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      </Box>
      <Flex p="4" gap="4" direction="column">
        <Heading as="h1" size="4xl">
          {displayData.title}
        </Heading>
        <Flex gap="2" flexWrap="wrap">
          {displayData.type && (
            <Badge size="md" variant="solid">
              {displayData.type}
            </Badge>
          )}
          {displayData.tags.map((tag) => (
            <Badge key={tag} size="md">
              {tag}
            </Badge>
          ))}
        </Flex>
        <Box
          dangerouslySetInnerHTML={{ __html: displayData.description }}
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
          }}
        />
      </Flex>
    </Box>
  );
}

export { ProductDescription };
