import React, { useState } from "react";
import { TextField, Typography, Box } from "@mui/material";
import { answerStore, solnStore } from "../redux/store";

const TextQuestion = ({ question }) => {
  const [data, setData] = useState("");

  const handleChange = (e) => {
    setData(e.target.value);
    answerStore.dispatch({
      type: "answer_object",
      payload: e.target.value,
    });
  };

  solnStore.subscribe(() => {
    setData(solnStore.getState());
  });

  return (
    <Box
      sx={{
        marginBottom: "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingLeft: { xs: "2rem", sm: "2rem", md: "2rem" },
        paddingRight: { xs: "2rem", sm: "2rem", md: "2rem" },
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#989594", textAlign: "center" }}
      >
        {question}
      </Typography>
      <TextField
        variant="outlined"
        fullWidth
        size="small"
        value={data}
        onChange={handleChange}
        placeholder="Type your answer here"
        InputProps={{
          style: {
            padding: "0.5rem",
            borderRadius: "0.25rem",
            borderColor: "#FDFBFA",
            backgroundColor: "#B1FFE8",
          },
          classes: {
            notchedOutline: 'custom-notched-outline'
          }
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

export default TextQuestion;
