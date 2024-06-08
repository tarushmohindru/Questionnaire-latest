import React from 'react';
import { TextField, Typography, Box } from '@mui/material';

const ParagraphTextQuestion = ({ question }) => {
  return (
    <Box 
      sx={{
        marginBottom: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        paddingLeft: { xs: '2rem', sm: '2rem', md: '2rem' },
        paddingRight: { xs: '2rem', sm: '2rem', md: '2rem' }
      }}
    >
      <Typography 
        variant="h6" 
        fontWeight="bold" 
        gutterBottom 
        sx={{ color: '#989594', textAlign: 'center' }}
      >
        {question}
      </Typography>
      <TextField
        multiline
        fullWidth
        rows={8}
        variant="outlined"
        placeholder="Type your answer here"
        InputProps={{
          style: {
            padding: '0.5rem',
            borderRadius: '0.25rem',
            backgroundColor: '#B1FFE8', 
            borderColor: '#FDFBFA',
          },
        }}
        inputProps={{
          style: { color: "#4D4556" },
        }}
        sx={{
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#449082",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#449082",
          },
        }}
      />
    </Box>
  );
};

export default ParagraphTextQuestion;
