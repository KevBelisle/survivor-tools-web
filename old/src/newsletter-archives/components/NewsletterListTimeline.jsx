import { Box, Center, Flex, Tag } from "@chakra-ui/react";
import React from "react";
import NewsletterSummary from "./NewsletterSummary";

const NewsletterListTimeline = ({ filteredNewsletters }) => {
  const timelineWidth = 2; // 2rem (equivalent to spacing.8)
  const tagBackground = { base: "white", _dark: "gray.800" };
  const yearBackground = { base: "teal.400", _dark: "teal.500" };

  return (
    <>
      <Box
        position="absolute"
        top="10"
        bottom="10"
        left={`${timelineWidth / 2}rem`}
        width="2px"
        ml="-1px"
        background="linear-gradient(0deg, rgba(0,0,0,0) 0, var(--chakra-colors-teal-500) 50px)"
      />
      {filteredNewsletters.map((newsletter, index) => {
        const date = newsletter.item.sentAt.substring(0, 10);
        const year = newsletter.item.sentAt.substring(0, 4);

        const newYear =
          year != filteredNewsletters[index - 1]?.item.sentAt.substring(0, 4);

        return (
          <>
            {newYear ? (
              <Flex key={year}>
                <Box
                  width={`${timelineWidth}rem`}
                  flexGrow={0}
                  position="relative"
                >
                  <Center py="2">
                    <Tag.Root
                      variant="subtle"
                      background={yearBackground}
                      size="lg"
                    >
                      {year}
                    </Tag.Root>
                  </Center>
                </Box>
              </Flex>
            ) : (
              <></>
            )}
            <Flex key={newsletter.item.id}>
              <Box
                width={`${timelineWidth}rem`}
                flexGrow={0}
                position="relative"
              >
                <Center py="2">
                  <Tag.Root variant="subtle" background={tagBackground}>
                    {date}
                  </Tag.Root>
                </Center>
              </Box>
              <NewsletterSummary
                newsletter={newsletter.item}
                searchMatches={newsletter.matches?.[0].indices}
                width={`calc(100% - ${timelineWidth}rem)`}
              />
            </Flex>
          </>
        );
      })}
    </>
  );
};

export default NewsletterListTimeline;
