import {
  Box,
  List,
  Text,
  Popover,
  useBreakpointValue,
} from '@chakra-ui/react'
import React from 'react'

import versions from '../versions.json'

const AppVersion = () => (
  <>
    {useBreakpointValue({
      base: <></>,
      sm: (
        <Box
          bg={{ base: 'white', _dark: 'gray.800' }}
          borderStyle="solid"
          borderTopWidth="1px"
          borderRightWidth="1px"
          borderBottomColor={{ base: 'gray.300', _dark: 'black' }}
          px="1"
          py="0"
          roundedTopRight="md"
          pos="fixed"
          bottom="0"
          left="0"
        >
          <Popover.Root positioning={{ placement: "top-start" }}>
            <Popover.Trigger asChild>
              <Text fontSize="xs" opacity="0.5" cursor="pointer" p="0">
                v{versions[versions.length - 1].version}
              </Text>
            </Popover.Trigger>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Header fontWeight="semibold" fontSize="sm">
                  survival.tools Shop Archive
                </Popover.Header>
                <Popover.Arrow />
                <Popover.Body fontSize="sm" maxHeight="14em" overflowY="scroll">
                  <List.Root>
                    {versions
                      .slice(0)
                      .reverse()
                      .map((x, i) => (
                        <List.Item key={i}>
                          <Text
                            display="inline"
                            paddingRight="2"
                            fontWeight="semibold"
                          >
                            v{x.version}
                          </Text>
                          <Text display="inline">{x.releaseNotes}</Text>
                        </List.Item>
                      ))}
                  </List.Root>
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>
        </Box>
      ),
    })}
  </>
)

export default AppVersion
