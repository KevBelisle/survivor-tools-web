import {
  Box,
  ListItem,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  UnorderedList,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'

import versions from '../versions.json'

const AppVersion = () => (
  <>
    {useBreakpointValue({
      base: <></>,
      sm: (
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          borderStyle="solid"
          borderTopWidth="1px"
          borderRightWidth="1px"
          borderBottomColor={useColorModeValue('gray.300', 'black')}
          px="1"
          py="0"
          roundedTopRight="md"
          pos="fixed"
          bottom="0"
          left="0"
        >
          <Popover placement="top-start">
            <PopoverTrigger p="0">
              <Text fontSize="xs" opacity="0.5" cursor="pointer">
                v{versions[versions.length - 1].version}
              </Text>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader fontWeight="semibold" fontSize="sm">
                survival.tools Shop Archive
              </PopoverHeader>
              <PopoverArrow />
              <PopoverBody fontSize="sm" maxHeight="14em" overflowY="scroll">
                <UnorderedList>
                  {versions
                    .slice(0)
                    .reverse()
                    .map((x, i) => (
                      <ListItem key={i}>
                        <Text
                          display="inline"
                          paddingRight="2"
                          fontWeight="semibold"
                        >
                          v{x.version}
                        </Text>
                        <Text display="inline">{x.releaseNotes}</Text>
                      </ListItem>
                    ))}
                </UnorderedList>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      ),
    })}
  </>
)

export default AppVersion
