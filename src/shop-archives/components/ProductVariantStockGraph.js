import { useColorModeValue } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'

const ProductVariantStockGraph = ({ stockHistory }) => {
  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          stepSize: 5,
        },
        grid: {
          borderColor: useColorModeValue('#CBD5E0', '#2D3748'),
          color: useColorModeValue('#CBD5E0', '#2D3748'),
          tickColor: useColorModeValue('#CBD5E0', '#2D3748'),
        },
        ticks: {
          color: useColorModeValue('#A0AEC0', '#4A5568'),
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          borderColor: useColorModeValue('#CBD5E0', '#2D3748'),
          color: useColorModeValue('#CBD5E0', '#2D3748'),
          tickColor: useColorModeValue('#CBD5E0', '#2D3748'),
        },
        ticks: {
          color: useColorModeValue('#A0AEC0', '#4A5568'),
        },
      },
    },
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 0,
    },
    responsive: true,
    maintainAspectRatio: false,
  }
  const data = {
    datasets: [
      {
        data: useMemo(
          () =>
            stockHistory.map((data) => ({
              x: data.timestamp,
              y: data.stock,
            })),
          [stockHistory]
        ),
        fill: false,
        stepped: 'after',
        borderColor: '#805AD5',
        backgroundColor: '#B794F4',
      },
    ],
  }

  return <Line data={data} options={options}></Line>
}

export default ProductVariantStockGraph
