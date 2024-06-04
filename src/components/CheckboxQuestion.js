import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
import { answerStore, solnStore } from "../redux/store";

const CheckboxQuestion = ({ question, options }) => {
  const [answers, setAnswers] = useState({});

  solnStore.subscribe(() => {
    let state = solnStore.getState();
    console.log(solnStore.getState());
    setAnswers({ ...state });
  });

  useEffect(() => {
    options.map((option) => {
      setAnswers({ ...answers, [option]: false });
    });
  }, []);

  useEffect(() => {
    console.log(answers);
  }, [answers]);

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
        <FormGroup>
          {options.map((option) => {
            return (
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
                  control={
                    <Checkbox
                      checked={answers[option] ? answers[option] : false}
                      sx={{ color: "#232120" }}
                      onChange={(e) => {
                        setAnswers({ ...answers, [option]: e.target.checked });
                        answerStore.dispatch({
                          type: "answer_object",
                          payload: { ...answers, [option]: e.target.checked },
                        });
                      }}
                    />
                  }
                  label={option}
                  sx={{ marginLeft: "0.5rem", flexGrow: 1 }}
                />
              </Box>
            );
          })}
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default CheckboxQuestion;