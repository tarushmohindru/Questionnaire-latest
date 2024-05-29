import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { getNewQ, getQList } from "../api";
import { jwtStore, qStore } from "../redux/store";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [jwt, setJwt] = useState(jwtStore.getState());
  const [questionnare, setQues] = useState([]);

  const fetchQuestionnare = async (jwt) => {
    try {
      let res = await getQList(jwt);

      setQues(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Failed to fetch questionnaires", error);
      setQues([]);
    }
  };

  const handleNew = async () => {
    let res = await getNewQ(jwt);
    qStore.dispatch({
      type: "questionnaire",
      payload: res.data,
    });
    navigate(`/questionnare?id=${res.qid}`);
  };

  useEffect(() => {
    const unsubscribe = jwtStore.subscribe(() => {
      const newJwt = jwtStore.getState();
      setJwt(newJwt);
      if (newJwt) {
        fetchQuestionnare(newJwt);
      }
    });

    if (jwt) {
      fetchQuestionnare(jwt);
    }

    return () => {
      unsubscribe();
    };
  }, [jwt]);

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Dashboard</h1>
      </div>
      <div className="description">
        <p>
          <button
            onClick={() => {
              handleNew();
            }}
            className="start-btn"
          >
            Start
          </button>{" "}
          a new questionnaire or continue your previous one's.
        </p>
      </div>
      <table className="questionnaire-table">
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Issuer</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questionnare.map((questionnaire, index) => (
            <tr key={index + 1}>
              <td>{index + 1}</td>
              <td>{questionnaire.orgname}</td>
              <td>{new Date(questionnaire.utctimestamp).toString()}</td>
              <td>
                <button
                  className="continue-btn"
                  style={{ backgroundColor: "#AE7F5D" }}
                  onClick={() => {
                    qStore.dispatch({
                      type: "questionnaire",
                      payload: questionnaire,
                    });
                    navigate(`/questionnare?id=${questionnaire.qid}`);
                  }}
                >
                  Continue
                </button>
                &nbsp;
                <button
                  className="print-btn"
                  style={{ backgroundColor: "#AE7F5D" }}
                >
                  Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="footer">
        <button className="log-out-btn">Log out</button>
      </div>
    </div>
  );
};

export default Dashboard;
