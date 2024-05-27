import React, { useState } from "react";
import { TextField, Typography, Box } from "@mui/material";
import { answerStore } from "../redux/store";

const TextQuestion = ({ question }) => {
  const [data, setData] = useState("");
  const handleChange = (e) => {
    setData(e.target.value);
    answerStore.dispatch({
      type: "answer_object",
      payload: e.target.value,
    });
  };
  return (
    <Box
      sx={{
        marginBottom: "1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingLeft: { xs: "1rem", sm: "2rem", md: "15rem" },
        paddingRight: { xs: "1rem", sm: "2rem", md: "15rem" },
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
        onChange={(e) => {
          handleChange(e);
        }}
        placeholder="Type your answer here"
        InputProps={{
          style: {
            padding: "0.5rem",
            borderRadius: "0.25rem",
            borderColor: "#FDFBFA",
            backgroundColor: "#3C3938",
            color: "#FDFBFA",
          },
        }}
      />
    </Box>
  );
};

export default TextQuestion;
