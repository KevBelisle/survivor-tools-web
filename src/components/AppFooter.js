import { Container, Flex, IconButton } from '@chakra-ui/react'
import React from 'react'
import { HiArrowNarrowUp } from 'react-icons/hi'

const AppFooter = ({ link, title, backIcon }) => {
  return (
    <Container>
      <Flex flexDirection="row-reverse" px="4" pb="8">
        <IconButton
          icon={<HiArrowNarrowUp />}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      </Flex>
    </Container>
  )
}

export default AppFooter
