import React from "react";
import { Slider, Typography, Box } from "@mui/material";
import { answerStore, solnStore } from "../redux/store";

const ScaleQuestion = ({ question, minLabel, maxLabel }) => {
  const [value, setValue] = React.useState(3);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    answerStore.dispatch({
      type: "answer_object",
      payload: newValue,
    });
  };

  React.useEffect(() => {
    const unsubscribe = solnStore.subscribe(() => {
      if (solnStore.getState()) {
        let state = solnStore.getState();
        setValue(state);
        answerStore.dispatch({
          type: "answer_object",
          payload: state,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        marginBottom: "1.5rem",
        paddingX: { xs: "2rem", sm: "2rem", md: "2rem", lg: "2rem" },
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#a4a1a0", textAlign: "center", fontFamily: "DM Sans, sans-serif" }}
      >
        {question}
      </Typography>
      <Box display="flex" alignItems="center" mt="0.5rem" width="80%">
        <Slider
          value={value}
          onChange={handleSliderChange}
          min={1}
          max={5}
          step={0.1} 
          marks={[
            { value: 1, label: minLabel },
            { value: 5, label: maxLabel },
          ]}
          valueLabelDisplay="auto"
          sx={{
            flexGrow: 1,
            color: "#34D4B7",
            "& .MuiSlider-thumb": {
              backgroundColor: "#1EC8DF",
            },
            "& .MuiSlider-valueLabel": {
              color: "#1EC8DF",
            },
            "& .MuiSlider-markLabel": {
              color: "#4D4556",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ScaleQuestion;
