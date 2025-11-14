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

const UpdateListSearch = ({ searchTerm, setSearchTerm }) => {
  const searchBox = (
    <Input
      size="md"
      variant="filled"
      placeholder="Search..."
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
    ></Input>
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
      <Box width="100%">{searchBox}</Box>
    </Box>
  )
}

export default UpdateListSearch
