import React from 'react';
import { Box } from '@mui/material';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const barData = [
  { name: 'value 1', value: 12 },
  { name: 'value 2', value: 8 },
  { name: 'value 3', value: 4 },
  { name: 'value 4', value: 6 },
];

const BarChart = () => {
  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#ffffff" />
          <YAxis stroke="#ffffff" domain={[0, 12]} />
          <Tooltip />
          <Bar dataKey="value" fill="#00FFFF" barSize={30} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChart;
