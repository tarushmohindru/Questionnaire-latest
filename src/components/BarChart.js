import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { scoreStore } from "../redux/store";

const BarChart = () => {
  const [barData, setBarData] = useState([]);
  scoreStore.subscribe(() => {
    let state = scoreStore.getState();
    console.log(state.e_perf);
    setBarData([
      { name: "E Perf", value: state.e_perf },
      { name: "E Conf", value: state.e_conf },
      { name: "E Weight", value: state.e_weight },
      { name: "G Perf", value: state.g_perf },
      { name: "G Conf", value: state.g_conf },
      { name: "G Weight", value: state.g_weight },
      { name: "S Perf", value: state.s_perf },
      { name: "S Conf", value: state.s_conf },
      { name: "S Weight", value: state.s_weight },
    ]);
  });

  useEffect(() => {
    let state = scoreStore.getState();
    setBarData([
      { name: "E Perf", value: state.e_perf },
      { name: "E Conf", value: state.e_conf },
      { name: "E Weight", value: state.e_weight },
      { name: "G Perf", value: state.g_perf },
      { name: "G Conf", value: state.g_conf },
      { name: "G Weight", value: state.g_weight },
      { name: "S Perf", value: state.s_perf },
      { name: "S Conf", value: state.s_conf },
      { name: "S Weight", value: state.s_weight },
    ]);
  }, []);
  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#4D4556" />
          <YAxis stroke="#4D4556" domain={[0, 10]} />
          <Tooltip />
          <Bar dataKey="value" fill="#1EC8DF" barSize={30} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChart;
