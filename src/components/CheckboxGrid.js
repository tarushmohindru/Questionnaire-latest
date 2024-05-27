import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Radio,
  FormControlLabel,
  Typography,
  Paper,
  Box,
  Checkbox,
} from "@mui/material";
import { answerStore, gridStore } from "../redux/store";

const formStyles = {
  container: {
    marginTop: "-40px",
    padding: "20px",
    backgroundColor: "#232120",
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
    backgroundColor: "#FFF9F5",
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

const CheckboxGridQuestion = () => {
  const [selectedOption, setSelectedOption] = useState({});
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleOptionChange = (item, option, selected) => {
    setSelectedOption((prevSelectedOption) => {
      const updatedOption = { ...prevSelectedOption };
      const existingOptions = updatedOption[item.name] || {};
      const existingOption = existingOptions[option];

      if (existingOption) {
        existingOption.selected = selected;
      } else {
        existingOptions[option] = { selected: selected };
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
    return selectedOption[item.name] === option ? "#E9DFDA" : "white";
  };

  useEffect(() => {
    const unsubscribe = gridStore.subscribe(() => {
      const state = gridStore.getState();
      setTitle(state.itemTitle);
      setOptions(state.options);
      setColumns(state.columns);
    });
    return () => unsubscribe();
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
                          <Checkbox
                            onChange={(e) =>
                              handleOptionChange(
                                { name: column },
                                option,
                                e.target.checked
                              )
                            }
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
