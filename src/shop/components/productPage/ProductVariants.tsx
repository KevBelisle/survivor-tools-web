import { Box, Card, Heading, Text, Flex, Badge } from "@chakra-ui/react";
import { Chart, useChart } from "@chakra-ui/charts";
import type { ProductVariant } from "@/shop/types";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  type TooltipContentProps,
} from "recharts";
import { PiChartLineDownBold, PiChartLineUpBold } from "react-icons/pi";

interface ProductVariantsProps {
  variants: ProductVariant[];
}

function generateTimeSeriesTicks(minTime: number, maxTime: number): number[] {
  const ticks: number[] = [];
  const startDate = new Date(minTime);
  const rangeInDays = (maxTime - minTime) / (1000 * 60 * 60 * 24);

  if (rangeInDays <= 90) {
    // Monthly ticks for <= 3 months
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    while (current.getTime() <= maxTime) {
      if (current.getTime() >= minTime) {
        ticks.push(current.getTime());
      }
      current.setMonth(current.getMonth() + 1);
    }
  } else if (rangeInDays <= 365) {
    // Quarterly ticks for <= 1 year
    const current = new Date(
      startDate.getFullYear(),
      Math.floor(startDate.getMonth() / 3) * 3,
      1,
    );
    while (current.getTime() <= maxTime) {
      if (current.getTime() >= minTime) {
        ticks.push(current.getTime());
      }
      current.setMonth(current.getMonth() + 3);
    }
  } else if (rangeInDays <= 730) {
    // Semi-annual ticks for <= 2 years
    const current = new Date(
      startDate.getFullYear(),
      Math.floor(startDate.getMonth() / 6) * 6,
      1,
    );
    while (current.getTime() <= maxTime) {
      if (current.getTime() >= minTime) {
        ticks.push(current.getTime());
      }
      current.setMonth(current.getMonth() + 6);
    }
  } else {
    // Yearly ticks for > 2 years
    const current = new Date(startDate.getFullYear(), 0, 1);
    while (current.getTime() <= maxTime) {
      if (current.getTime() >= minTime) {
        ticks.push(current.getTime());
      }
      current.setFullYear(current.getFullYear() + 1);
    }
  }

  // If no ticks were generated, add start and end ticks
  if (ticks.length === 0) {
    ticks.push(minTime, maxTime);
  }

  return ticks;
}

function renderCustomToolTip({
  active,
  payload,
}: TooltipContentProps<string | number, string>) {
  const isVisible = active && payload && payload.length;
  return (
    <Box bg="bg.panel" px="2" py="1" borderRadius="sm" shadow="sm">
      {isVisible && (
        <>
          <p>
            {new Date(payload[0].payload.timestamp).toLocaleDateString(
              "en-US",
              {
                hour: "numeric",
                minute: "numeric",
                day: "numeric",
                month: "short",
                year: "numeric",
              },
            )}
          </p>
          <p>Stock: {payload[0].payload.stock}</p>
          <p>Price: ${payload[0].payload.price.toFixed(2)}</p>
        </>
      )}
    </Box>
  );
}

function StockHistoryChart({
  stockHistory,
  priceHistory,
}: {
  stockHistory: { timestamp: string; stock: number }[];
  priceHistory: { timestamp: string; price: number }[];
}) {
  // Merge stock and price history, carrying forward previous values
  const allTimestamps = new Set([
    ...stockHistory.map((item) => item.timestamp),
    ...priceHistory.map((item) => item.timestamp),
  ]);

  const sortedTimestamps = Array.from(allTimestamps).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  let lastStock = 0;
  let lastPrice = 0;

  const chartData = sortedTimestamps.map((timestamp) => {
    const stockItem = stockHistory.find((item) => item.timestamp === timestamp);
    const priceItem = priceHistory.find((item) => item.timestamp === timestamp);

    if (stockItem) lastStock = stockItem.stock;
    if (priceItem) lastPrice = priceItem.price;

    return {
      timestamp: new Date(timestamp).getTime(),
      stock: lastStock,
      price: lastPrice,
    };
  });

  // Calculate time range
  const minTime = chartData[0].timestamp;
  const maxTime = chartData[chartData.length - 1].timestamp;
  const rangeInDays = (maxTime - minTime) / (1000 * 60 * 60 * 24);

  // Determine if we're using yearly ticks
  const useYearlyTicks = rangeInDays > 730;

  const chart = useChart({
    data: chartData,
  });

  return (
    <Box>
      <Chart.Root height="200px" chart={chart}>
        <LineChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            ticks={generateTimeSeriesTicks(minTime, maxTime)}
            tickFormatter={(timestamp) => {
              const date = new Date(timestamp);

              // Check if it's the exact start of a month (day = 1, time = 00:00:00)
              const isStartOfMonth =
                date.getDate() === 1 &&
                date.getHours() === 0 &&
                date.getMinutes() === 0 &&
                date.getSeconds() === 0;

              if (!isStartOfMonth) {
                // Show full date with time
                return date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                });
              }

              if (useYearlyTicks) {
                return date.getFullYear().toString();
              }
              return date.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });
            }}
          />
          <YAxis yAxisId="left" />

          <Tooltip
            animationDuration={100}
            cursor={{ stroke: chart.color("border") }}
            content={renderCustomToolTip}
          />
          <Line
            type="stepBefore"
            dataKey="stock"
            isAnimationActive={false}
            yAxisId="left"
            fill="#C083FC"
            stroke="#641CA3"
            strokeWidth={2}
          />
        </LineChart>
      </Chart.Root>
    </Box>
  );
}

function ProductVariants({ variants }: ProductVariantsProps) {
  if (variants.length === 0) {
    return null;
  }

  return (
    <Box>
      <Heading as="h2" size="2xl" mb="4">
        Variants
      </Heading>
      <Flex direction="column" gap="4">
        {variants.map((variant) => {
          const currentStock =
            variant.stockHistory.length > 0 ? variant.stockHistory[0].stock : 0;
          const currentPrice =
            variant.priceHistory.length > 0 ? variant.priceHistory[0].price : 0;

          const prices = variant.priceHistory.map((p) => p.price);
          const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;
          const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;

          return (
            <Card.Root
              key={variant.details.id}
              variant="subtle"
              bg={{ base: "white", _dark: "gray.800" }}
              shadow="sm"
            >
              <Card.Body>
                <Flex direction="column" gap="4">
                  <Flex
                    justify="space-between"
                    align="start"
                    flexWrap="wrap"
                    gap="4"
                  >
                    <Box>
                      <Card.Title mb="2">{variant.details.title}</Card.Title>
                      <Text fontSize="sm" color="fg.subtle">
                        SKU: {variant.details.sku}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex gap="2" flexWrap="wrap">
                    <Badge
                      size="lg"
                      variant="surface"
                      colorPalette={currentStock > 0 ? "green" : "red"}
                    >
                      Stock: {currentStock}
                    </Badge>
                    <Badge size="md" variant="surface" colorPalette="cyan">
                      Last seen at ${currentPrice.toFixed(2)}
                    </Badge>
                    <Badge size="md" variant="surface" colorPalette="gray">
                      <PiChartLineDownBold /> ${lowestPrice.toFixed(2)}
                    </Badge>
                    <Badge size="md" variant="surface" colorPalette="gray">
                      <PiChartLineUpBold /> ${highestPrice.toFixed(2)}
                    </Badge>
                  </Flex>

                  {/* Stock history chart */}
                  {variant.stockHistory.length > 1 ? (
                    <StockHistoryChart
                      stockHistory={variant.stockHistory}
                      priceHistory={variant.priceHistory}
                    />
                  ) : (
                    <Text fontSize="xs" color="fg.subtle">
                      No stock graph, since we have a single data point for this
                      variant.
                    </Text>
                  )}
                </Flex>
              </Card.Body>
            </Card.Root>
          );
        })}
      </Flex>
    </Box>
  );
}

export { ProductVariants };
