import { Link } from "@tanstack/react-router";
import { Container, Flex, Button } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";

function EventPageHeader() {
	return (
		<Container>
			<Flex
				borderBottomRadius="sm"
				p="2"
				bg={{ base: "gray.300", _dark: "gray.700" }}
			>
				<Link to="/events">
					<Button variant="ghost" color="fg.muted" size="xs">
						<LuArrowLeft />
						Back to events
					</Button>
				</Link>
			</Flex>
		</Container>
	);
}

export { EventPageHeader };
