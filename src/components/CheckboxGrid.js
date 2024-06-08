import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { answerStore, gridStore, solnStore } from "../redux/store";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const formStyles = {
  container: {
    marginTop: "-40px",
    padding: "20px",
    backgroundColor: "white",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    padding: "20px",
    borderRadius: "15px",
    overflow: "hidden",
    backgroundColor: "#E5FFFC",
    flexGrow: 1,
    width: "100%",
    maxWidth: "90%",
    margin: "0 auto",
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    tableLayout: "fixed",
  },
  tableHeader: {
    fontFamily: "DM Sans",
    color: "#444444",
    fontSize: "12px",
    fontWeight: "bold",
    border: "1px solid #ccc",
    textAlign: "center",
    padding: "15px",
    wordWrap: "break-word",
  },
  tableCell: {
    borderBottom: "1px solid #ccc",
    color: "#444444",
    fontWeight: "bold",
    fontFamily: "DM Sans",
    fontSize: "12px",
    borderRight: "1px solid #ccc",
    borderLeft: "1px solid #ccc",
    textAlign: "center",
    padding: "10px",
    wordWrap: "break-word",
  },
  heading: {
    width: "100%",
    fontFamily: "DM Sans",
    fontWeight: 500,
    fontSize: "24px",
    lineHeight: "28px",
    textAlign: "center",
    marginBottom: "20px",
    color: "#A4A1A0",
  },
};

const CustomCheckbox = (props) => (
  <Checkbox
    {...props}
    icon={<CheckBoxOutlineBlankIcon />}
    checkedIcon={<CheckBoxIcon sx={{ color: "#2B675C" }} />}
  />
);

const CheckboxGridQuestion = () => {
  const [selectedOption, setSelectedOption] = useState({});
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleOptionChange = (item, option) => {
    setSelectedOption((prevSelectedOption) => {
      const updatedOption = { ...prevSelectedOption };
      const existingOptions = updatedOption[item.name] || {};

      if (existingOptions[option]?.selected) {
        existingOptions[option].selected = false;
      } else {
        existingOptions[option] = { selected: true };
      }

      updatedOption[item.name] = existingOptions;
      answerStore.dispatch({
        type: "answer_object",
        payload: updatedOption,
      });
      return updatedOption;
    });
  };

  const getCellBackgroundColor = (item, option) => {
    return selectedOption[item.name]?.[option]?.selected ? "#B1FFE8" : "white";
  };

  useEffect(() => {
    const unsubscribeSoln = solnStore.subscribe(() => {
      const state = solnStore.getState();
      setSelectedOption((prevSelectedOption) => ({
        ...prevSelectedOption,
        ...state,
      }));
      answerStore.dispatch({
        type: "answer_object",
        payload: state,
      });
    });

    const unsubscribeGrid = gridStore.subscribe(() => {
      const state = gridStore.getState();
      setTitle(state.itemTitle);
      setOptions(state.options);
      setColumns(state.columns);
    });

    return () => {
      unsubscribeSoln();
      unsubscribeGrid();
    };
  }, []);

  return (
    <Box sx={formStyles.container}>
      <Typography variant="h4" gutterBottom sx={formStyles.heading}>
        {title}
      </Typography>
      <Paper sx={formStyles.paper}>
        <Box sx={{ overflowX: "auto" }}>
          <Table sx={formStyles.table}>
            <TableHead>
              <TableRow>
                <TableCell sx={formStyles.tableHeader}></TableCell>
                {options.map((option, i) => (
                  <TableCell key={i} align="center" sx={formStyles.tableHeader}>
                    {option}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {columns.map((column, index) => (
                <TableRow key={index}>
                  <TableCell sx={formStyles.tableCell}>{column}</TableCell>
                  {options.map((option, i) => (
                    <TableCell
                      key={`${column}-${i}`}
                      align="center"
                      sx={{
                        ...formStyles.tableCell,
                        backgroundColor: getCellBackgroundColor(
                          { name: column },
                          option
                        ),
                      }}
                    >
                      <FormControlLabel
                        control={
                          <CustomCheckbox
                            style={{
                              display: "block",
                              margin: "auto",
                              marginRight: "20px",
                            }}
                            checked={
                              selectedOption[column]
                                ? selectedOption[column][option]
                                  ? selectedOption[column][option].selected
                                  : false
                                : false
                            }
                            onChange={() => {
                              handleOptionChange({ name: column }, option);
                            }}
                            value={option}
                            name={column}
                          />
                        }
                        label=""
                        labelPlacement="start"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
};

export default CheckboxGridQuestion;
