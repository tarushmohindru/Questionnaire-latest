import React, { useEffect, useState } from "react";
import { scoreStore } from "../redux/store";

const scores = {
  Confidence: { E: 85, S: 90, G: 80 },
  Performance: { E: 88, S: 85, G: 87 },
};

const ScoreGrid = () => {
  const [data, setData] = useState({});

  scoreStore.subscribe(() => {
    setData(scoreStore.getState());
  });

  useEffect(() => {
    setData(scoreStore.getState());
  }, []);
  return (
    data.e_conf && (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          textAlign: "center",
        }}
      >
        {/* Header row */}
        <div></div>
        <div>
          <strong>E</strong>
        </div>
        <div>
          <strong>S</strong>
        </div>
        <div>
          <strong>G</strong>
        </div>

        {/* Confidence row */}
        <div>
          <strong>Confidence</strong>
        </div>
        <div>{data.e_conf.toFixed(2)}</div>
        <div>{data.s_conf.toFixed(2)}</div>
        <div>{data.g_conf.toFixed(2)}</div>

        {/* Performance row */}
        <div>
          <strong>Performance</strong>
        </div>
        <div>{data.e_perf.toFixed(2)}</div>
        <div>{data.s_perf.toFixed(2)}</div>
        <div>{data.s_perf.toFixed(2)}</div>
      </div>
    )
  );
};

export default ScoreGrid;
