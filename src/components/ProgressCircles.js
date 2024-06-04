import React from 'react';
import { Box, Typography } from '@mui/material';

const progressData = [
  { value: 8, total: 12, color: '#FFA500' },
  { value: 5, total: 12, color: '#00FF00' },
  { value: 11, total: 12, color: '#00FFFF' },
  { value: 4, total: 12, color: '#800080' },
];

const ProgressCircles = () => {
  return (
    <Box display="flex" justifyContent="space-around" width="100%">
      {progressData.map((data, index) => (
        <Box key={index} position="relative" display="flex" alignItems="center" justifyContent="center">
          <svg width="100" height="100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={data.color}
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${(data.value / data.total) * 283} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <Typography
            variant="h6"
            component="div"
            position="absolute"
            color="white"
          >
            {`${data.value}/${data.total}`}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ProgressCircles;
