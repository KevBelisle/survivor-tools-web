import { Card, Container, Flex, Skeleton } from "@chakra-ui/react";
import { Masonry } from "masonic";

interface SkeletonProductCardProps {
  imageHeight?: number;
}

function SkeletonProductCard({ imageHeight = 320 }: SkeletonProductCardProps) {
  return (
    <Card.Root
      w="320px"
      variant="subtle"
      overflow="hidden"
      bg="bg.muted"
      boxShadow="xs"
    >
      <Skeleton
        height={`${imageHeight}px`}
        variant="shine"
        css={{
          "--start-color": "colors.gray.100",
          "--end-color": "colors.white",
        }}
      />
      <Card.Body
        display="flex"
        flexDirection="column"
        py="3"
        px="4"
        gap="2"
        borderTop="1px solid"
        borderColor="border.emphasized"
      >
        <Skeleton
          height="6"
          width="60%"
          variant="shine"
          css={{
            "--start-color": "colors.gray.100",
            "--end-color": "colors.gray.300",
          }}
        />
        <Flex direction="row" justifyContent="flex-end" gap="2">
          <Skeleton
            height="5"
            width="95px"
            borderRadius="sm"
            variant="shine"
            css={{
              "--start-color": "colors.gray.100",
              "--end-color": "colors.gray.300",
            }}
          />
          <Skeleton
            height="5"
            width="70px"
            borderRadius="sm"
            variant="shine"
            css={{
              "--start-color": "colors.gray.100",
              "--end-color": "colors.gray.300",
            }}
          />
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}

const [MIN_SKELETON_IMAGE_HEIGHT, MAX_SKELETON_IMAGE_HEIGHT] = [200, 450];
function getRandomHeight() {
  return (
    Math.floor(
      Math.random() *
        (MAX_SKELETON_IMAGE_HEIGHT - MIN_SKELETON_IMAGE_HEIGHT + 1),
    ) + MIN_SKELETON_IMAGE_HEIGHT
  );
}

const SKELETON_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  imageHeight: getRandomHeight(),
}));

function SkeletonMasonryCard({
  data,
}: {
  index: number;
  data: { id: number; imageHeight: number };
  width: number;
}) {
  return <SkeletonProductCard imageHeight={data.imageHeight} />;
}

function SkeletonProductMasonry() {
  return (
    <Container my="8">
      <Masonry
        items={SKELETON_ITEMS}
        render={SkeletonMasonryCard}
        columnWidth={320}
        columnGutter={20}
        itemKey={(item) => item.id}
      />
    </Container>
  );
}

function SkeletonSearchBar() {
  return (
    <Container>
      <Flex
        borderBottomRadius="sm"
        p="4"
        gap="4"
        bg={{ base: "gray.300", _dark: "gray.700" }}
      >
        <Skeleton flex="1" height="10" borderRadius="md" variant="shine" />
        <Skeleton width="10" height="10" borderRadius="md" variant="shine" />
      </Flex>
    </Container>
  );
}

export { SkeletonProductCard, SkeletonProductMasonry, SkeletonSearchBar };
