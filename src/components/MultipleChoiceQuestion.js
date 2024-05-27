import React from "react";
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Box,
} from "@mui/material";
import { answerStore } from "../redux/store";

const MultipleChoiceQuestion = ({ question, options }) => {
  const handleChange = (e) => {
    answerStore.dispatch({
      type: "answer_object",
      payload: e.target.value,
    });
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        marginBottom: "1.5rem",
        paddingX: { xs: "1rem", sm: "2rem", md: "10rem", lg: "15rem" },
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {question}
      </Typography>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup>
          {options.map((option) => (
            <Box
              key={option}
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "0.5rem",
                padding: "1rem",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <FormControlLabel
                value={option}
                onChange={(e) => {
                  handleChange(e);
                }}
                control={
                  <Radio
                    sx={{
                      color: "#232120",
                      "&.Mui-checked": {
                        color: "#232120",
                      },
                    }}
                  />
                }
                label={option}
                sx={{ marginLeft: "0.5rem", flexGrow: 1 }}
              />
            </Box>
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default MultipleChoiceQuestion;
