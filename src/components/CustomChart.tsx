import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface CustomChartProps {
  data: ChartData[];
  title?: string;
  maxValue?: number;
  height?: number;
  showValues?: boolean;
}

const CustomChart: React.FC<CustomChartProps> = ({
  data,
  title = "Student Performance",
  maxValue,
  height = 300,
  showValues = true,
}) => {
  // Define a set of default colors
  const defaultColors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Orange
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#6B7280", // Gray
    "#06B6D4", // Cyan
    "#EC4899", // Pink
  ];

  // Assign colors to data items
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length],
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
          <p className='font-semibold text-gray-800'>{label}</p>
          <p className='text-sm text-gray-600'>
            Performance: <span className='font-medium'>{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label component for showing values on bars
  const CustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill='#6B7280'
        textAnchor='middle'
        fontSize='12'
        fontWeight='500'
      >
        {value}
      </text>
    );
  };

  return (
    <div className='w-full'>
      {/* Chart Title */}
      <h2 className='text-xl font-semibold text-gray-800 mb-6'>{title}</h2>

      {/* Chart Container */}
      <div className=''>
        {data.length > 0 ? (
          <ResponsiveContainer width='100%' height={height}>
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
              barCategoryGap='20%'
            >
              <CartesianGrid
                strokeDasharray='0'
                horizontal={true}
                vertical={false}
              />

              <XAxis
                dataKey='name'
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 13, fill: "#00000" }}
                interval={0}
                angle={0}
                textAnchor='middle'
                height={60}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 14, fill: "#6B7280" }}
                domain={[0, maxValue || "dataMax"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey='value' radius={[0, 0, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className='flex items-center justify-center' style={{ height }}>
            <div className='text-center'>
              <div className='text-gray-400 mb-2'>
                <svg
                  className='w-12 h-12 mx-auto'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.25h-15A2.25 2.25 0 0 1 0 17V4.75A2.25 2.25 0 0 1 2.25 2.5h15A2.25 2.25 0 0 1 19.5 4.75V17a2.25 2.25 0 0 1-2.25 2.25Z' />
                </svg>
              </div>
              <p className='text-gray-500'>No data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomChart;
