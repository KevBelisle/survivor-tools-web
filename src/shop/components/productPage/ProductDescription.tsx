import {
	Badge,
	Box,
	Button,
	Flex,
	Heading,
	Image,
	Popover,
	Grid,
	Portal,
	Span,
	Text,
	Timeline,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { LuChevronDown, LuShoppingCart } from "react-icons/lu";
import type { ProductDetailResponse, SnapshotDetails } from "@/shop/types";

interface ProductDescriptionProps {
	productData: ProductDetailResponse;
	displayData: SnapshotDetails;
	snapshotId?: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric",
});

const productState = {
	outOfStock: "out of stock",
	inStock: "in stock",
	unlisted: "unlisted",
};

function ProductDescription({
	productData,
	displayData,
	snapshotId,
}: ProductDescriptionProps) {
	const heroImage = productData.images[0];

	return (
		<Box
			bg={{ base: "white", _dark: "gray.900" }}
			borderRadius="lg"
			overflow="hidden"
			shadow="sm"
		>
			<Box
				bg={{ base: "gray.100", _dark: "gray.950" }}
				px="4"
				py="2"
				display="flex"
				gap="4"
				flexWrap="wrap"
				alignItems="baseline"
			>
				{productData.state != "unlisted" ? (
					<a
						href={`https://shop.kingdomdeath.com/products/${productData.handle}`}
						target="_blank"
					>
						<Button size="xs" variant="outline" colorPalette="cyan">
							To Shop <LuShoppingCart />
						</Button>
					</a>
				) : null}
				<Text fontSize="xs">
					Currently {productState[productData.state]}
					{productData.state == "unlisted" && productData.snapshot.unlistedAt
						? ` (as of ${dateFormatter.format(Date.parse(productData.snapshot.unlistedAt))}).`
						: "."}
				</Text>
			</Box>

			<Grid
				templateColumns={{ base: "1fr", md: "3fr 7fr" }}
				gap="4"
				p="4"
			>
				{heroImage ? (
					<Box width="100%">
						<Image
							src={heroImage.uri}
							alt={heroImage.alt}
							width="100%"
							aspectRatio={1}
							objectFit="cover"
							bg="white"
							borderRadius="md"
						/>
					</Box>
				) : null}

				<Flex direction="column" gap="4">
					<Span>
						<Popover.Root positioning={{ placement: "bottom-end" }}>
							<Popover.Trigger asChild>
								<Button variant="outline" size="xs" colorPalette="cyan">
									Snapshot on{" "}
									{dateFormatter.format(Date.parse(displayData.snapshotAt))}{" "}
									<LuChevronDown />
								</Button>
							</Popover.Trigger>
							<Portal>
								<Popover.Positioner>
									<Popover.Content>
										<Popover.Arrow />
										<Popover.Body display="flex" flexDirection="column" gap="4">
											<Timeline.Root size="sm" variant="subtle">
												{productData.snapshots.map((snapshot) => {
													const selected =
														(snapshotId ?? productData.snapshot.id) ==
														snapshot.id;
													return (
														<Timeline.Item
															colorPalette={selected ? "teal" : "current"}
															key={snapshot.id}
														>
															<Timeline.Connector>
																<Timeline.Separator />
																<Timeline.Indicator></Timeline.Indicator>
															</Timeline.Connector>
															<Timeline.Content>
																<Link
																	to="/shop/$productId"
																	params={{ productId: productData.id }}
																	search={{ snapshotId: snapshot.id }}
																	replace={true}
																>
																	<Timeline.Title
																		fontWeight={selected ? "bold" : "normal"}
																	>
																		{dateFormatter.format(
																			Date.parse(snapshot.snapshotAt),
																		)}
																	</Timeline.Title>
																</Link>
															</Timeline.Content>
														</Timeline.Item>
													);
												})}
											</Timeline.Root>
										</Popover.Body>
									</Popover.Content>
								</Popover.Positioner>
							</Portal>
						</Popover.Root>
					</Span>
					<Heading as="h1" size="4xl">
						{displayData.title}
					</Heading>
					<Flex gap="2" flexWrap="wrap">
						{displayData.type && (
							<Badge size="md" variant="solid">
								{displayData.type}
							</Badge>
						)}
						{displayData.tags.map((tag) => (
							<Badge key={tag} size="md">
								{tag}
							</Badge>
						))}
					</Flex>
					<Box
						dangerouslySetInnerHTML={{ __html: displayData.description }}
						css={{
							"& p": { marginBottom: "1rem" },
							"& ul, & ol": { marginLeft: "1.5rem", marginBottom: "1rem" },
							"& h2": {
								fontSize: "1.5rem",
								fontWeight: "bold",
								marginTop: "1.5rem",
								marginBottom: "0.75rem",
							},
							"& h3": {
								fontSize: "1.25rem",
								fontWeight: "bold",
								marginTop: "1.25rem",
								marginBottom: "0.5rem",
							},
							"& a": {
								textDecoration: "underline",
							},
						}}
					/>
				</Flex>
			</Grid>
		</Box>
	);
}

export { ProductDescription };
