import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Container, Flex, Text } from "@chakra-ui/react";

import { fetchEvents } from "@/events/api";
import { EventCard } from "@/events/components/EventCard";
import type { SalesEvent } from "@/events/types";

export const Route = createFileRoute("/events/")({
	loader: async ({ context: { queryClient } }) => {
		return queryClient.ensureQueryData({
			queryKey: ["salesEvents"],
			queryFn: () => fetchEvents(),
		});
	},
	component: RouteComponent,
});

function sortEvents(events: SalesEvent[]): SalesEvent[] {
	return [...events].sort(
		(a, b) =>
			new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
	);
}

function RouteComponent() {
	const { data } = useSuspenseQuery({
		queryKey: ["salesEvents"],
		queryFn: () => fetchEvents(),
	});

	const events = useMemo(() => sortEvents(data.events), [data.events]);

	return (
		<Container maxW="container.md" py="4">
			{events.length === 0 ? (
				<Text color="fg.subtle" textAlign="center" py={8}>
					No sales events found.
				</Text>
			) : (
				<Flex direction="column" gap="4">
					{events.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</Flex>
			)}
		</Container>
	);
}
