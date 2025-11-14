import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  HStack,
  MenuButton,
  Menu,
  MenuList,
  VStack,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'
import { HiChevronDown } from 'react-icons/hi'

const ProductListSearch = ({
  searchTerm,
  setSearchTerm,
  tags,
  dispatchTagFilterChange,
  types,
  dispatchTypeFilterChange,
  states,
  dispatchStateFilterChange,
}) => {
  const searchBox = (
    <Input
      size="md"
      variant="filled"
      placeholder="Search..."
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
    ></Input>
  )

  const typesArray = Object.keys(types)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map((type) => {
      return { name: type, value: types[type] }
    })
  const selectedTypes = typesArray.filter((x) => x.value).length
  const typesSelector = (
    <Menu>
      <MenuButton as={Button} rightIcon={<HiChevronDown />} width="100%">
        Product Types {selectedTypes ? `(${selectedTypes})` : <></>}
      </MenuButton>
      <MenuList maxHeight="80vh" overflowY="auto">
        <CheckboxGroup colorScheme="green">
          <VStack align="flex-start" px="4">
            {typesArray.sort().map((type) => (
              <Checkbox
                key={type.name}
                isChecked={type.value}
                onChange={(event) => {
                  dispatchTypeFilterChange({
                    action: 'typeFilterChanged',
                    payload: {
                      name: type.name,
                      value: event.target.checked,
                    },
                  })
                }}
              >
                {type.name}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </MenuList>
    </Menu>
  )

  const tagsArray = Object.keys(tags)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map((tag) => {
      return { name: tag, value: tags[tag] }
    })
  const selectedTags = tagsArray.filter((x) => x.value).length
  const tagsSelector = (
    <Menu>
      <MenuButton as={Button} rightIcon={<HiChevronDown />} width="100%">
        Product Tags {selectedTags ? `(${selectedTags})` : <></>}
      </MenuButton>
      <MenuList maxHeight="80vh" overflowY="auto">
        <CheckboxGroup colorScheme="green">
          <VStack align="flex-start" px="4">
            {tagsArray.sort().map((tag) => (
              <Checkbox
                key={tag.name}
                isChecked={tag.value}
                onChange={(event) => {
                  dispatchTagFilterChange({
                    action: 'tagFilterChanged',
                    payload: {
                      name: tag.name,
                      value: event.target.checked,
                    },
                  })
                }}
              >
                {tag.name}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </MenuList>
    </Menu>
  )

  const statesArray = Object.keys(states)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map((state) => {
      return { name: state, value: states[state] }
    })
  const selectedStates = statesArray.filter((x) => x.value).length
  const statesSelector = (
    <Menu>
      <MenuButton as={Button} rightIcon={<HiChevronDown />} width="100%">
        Product States {selectedStates ? `(${selectedStates})` : <></>}
      </MenuButton>
      <MenuList maxHeight="80vh" overflowY="auto">
        <CheckboxGroup colorScheme="green">
          <VStack align="flex-start" px="4">
            {statesArray.sort().map((state) => (
              <Checkbox
                key={state.name}
                isChecked={state.value}
                onChange={(event) => {
                  dispatchStateFilterChange({
                    action: 'stateFilterChanged',
                    payload: {
                      name: state.name,
                      value: event.target.checked,
                    },
                  })
                }}
              >
                {state.name}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
      </MenuList>
    </Menu>
  )

  return (
    <Box
      bg={useColorModeValue('gray.300', 'gray.900')}
      borderBottomStyle="solid"
      borderBottomWidth="1px"
      px="4"
      py="4"
      width={{
        base: '320px',
        sm: '660px',
        md: '1000px',
        lg: '1340px',
        xl: '1680px',
        '2xl': '2020px',
      }}
      mx="auto"
      roundedBottom="md"
    >
      {useBreakpointValue({
        base: (
          <VStack>
            <Box width="100%">{searchBox}</Box>
            <Box width="100%">{typesSelector}</Box>
            <Box width="100%">{tagsSelector}</Box>
            <Box width="100%">{statesSelector}</Box>
          </VStack>
        ),
        sm: (
          <VStack>
            <Box width="100%">{searchBox}</Box>
            <HStack width="100%" alignItems="stretch">
              <Box flexGrow="1">{typesSelector}</Box>
              <Box flexGrow="1">{tagsSelector}</Box>
              <Box flexGrow="1">{statesSelector}</Box>
            </HStack>
          </VStack>
        ),
        md: (
          <HStack>
            <Box flexGrow="1">{searchBox}</Box>
            <Box flexGrow="0" width="250px">
              {typesSelector}
            </Box>
            <Box flexGrow="0" width="250px">
              {tagsSelector}
            </Box>
            <Box flexGrow="0" width="250px">
              {statesSelector}
            </Box>
          </HStack>
        ),
      })}
    </Box>
  )
}

export default ProductListSearch
