import React from "react";
import { Slider, Typography, Box } from "@mui/material";
import { answerStore } from "../redux/store";

const ScaleQuestion = ({ question, minLabel, maxLabel }) => {
  const [value, setValue] = React.useState(3);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    answerStore.dispatch({
      type: "answer_object",
      payload: newValue,
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
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        style={{ color: "#a4a1a0" }}
      >
        {question}
      </Typography>
      <Box display="flex" alignItems="center" mt="0.5rem" width="100%">
        <Slider
          value={value}
          onChange={handleSliderChange}
          min={1}
          max={5}
          step={1}
          marks={[
            { value: 1, label: minLabel },
            { value: 5, label: maxLabel },
          ]}
          sx={{
            flexGrow: 1,
            color: "#a4a1a0",
            "& .MuiSlider-thumb": {
              backgroundColor: "#a4a1a0",
            },
            "& .MuiSlider-valueLabel": {
              color: "#a4a1a0",
            },
            "& .MuiSlider-markLabel": {
              color: "#a4a1a0",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ScaleQuestion;
