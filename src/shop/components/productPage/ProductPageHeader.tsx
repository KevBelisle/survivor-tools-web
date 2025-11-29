import { Link } from "@tanstack/react-router";
import { Container, Flex, Button, Box } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";

function ProductPageHeader() {
  return (
    <Container>
      <Flex
        borderBottomRadius="sm"
        p="2"
        bg={{ base: "gray.300", _dark: "gray.700" }}
      >
        <Link to="/shop">
          <Button variant="ghost" color="fg.muted" size="xs">
            <LuArrowLeft />
            Back to product list
          </Button>
        </Link>
      </Flex>
    </Container>
  );
}

export { ProductPageHeader };
