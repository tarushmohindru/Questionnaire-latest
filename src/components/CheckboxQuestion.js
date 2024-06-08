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
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

const CheckboxQuestion = ({ question, options }) => {
  const [answers, setAnswers] = useState({});

  solnStore.subscribe(() => {
    let state = solnStore.getState();
    console.log(solnStore.getState());
    setAnswers({ ...state });
    answerStore.dispatch({
      type: "answer_object",
      payload: state,
    });
  });

  useEffect(() => {
    options.map((option) => {
      setAnswers((prevAnswers) => ({ ...prevAnswers, [option]: false }));
    });
  }, []);

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  const CustomCheckbox = (props) => (
    <Checkbox
      {...props}
      icon={<CheckBoxOutlineBlankIcon />}
      checkedIcon={<CheckBoxIcon sx={{ color:"#2B675C" }} />}
    />
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh" 
      sx={{
        paddingX: { xs: "2rem", sm: "2rem", md: "2rem", lg: "2rem" },
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
        {question}
      </Typography>
      <FormControl component="fieldset" fullWidth>
        <FormGroup>
          {options.map((option) => (
            <Box
              key={option}
              sx={{
                backgroundColor: "#B1FFE8",
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
                  <CustomCheckbox
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
                sx={{ marginLeft: "0.5rem", flexGrow: 1, textAlign: "center" }}
              />
            </Box>
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default CheckboxQuestion;
