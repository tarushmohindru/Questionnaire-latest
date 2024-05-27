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
        paddingLeft: { xs: '1rem', sm: '2rem', md: '15rem' },
        paddingRight: { xs: '1rem', sm: '2rem', md: '15rem' }
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
            backgroundColor: '#3C3938', 
            color: '#FDFBFA', 
            borderColor: '#FDFBFA', 
          },
        }}
      />
    </Box>
  );
};

export default ParagraphTextQuestion;
