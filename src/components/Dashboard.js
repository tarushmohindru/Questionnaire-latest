import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  LinearProgress,
} from "@mui/material";
import "./Dashboard.css";
import { Add as AddIcon } from "@mui/icons-material";
import { styled } from "@mui/system";
import PrintIcon from "./directbox-notif.svg";
import Design from "./icon.svg";
import { useNavigate } from "react-router-dom";
import { getQList, getNewQ } from "../api";
import { qStore, jwtStore, bubbleStore } from "../redux/store";

const Dashboard = () => {
  const navigate = useNavigate();
  const [jwt, setJwt] = useState(jwtStore.getState());
  const [questionnare, setQues] = useState([]);

  const CustomCard = styled(Card)(({ theme }) => ({
    borderRadius: "2rem",
    boxShadow: "none",
    backgroundColor: "#ededed",
    padding: theme.spacing(2),
    width: "250px",
    height: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontFamily: "DM Sans",
  }));

  const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#FF7E6B",
    color: "#FFF",
    "&:hover": {
      backgroundColor: "#FF6A55",
    },
    borderRadius: "8px",
    height: "35px",
    fontSize: "14px",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "auto",
    margin: "0",
    marginRight: "18px",
    fontFamily: "DM Sans",
  }));

  const CustomIconButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#FF7E6B",
    color: "#FFF",
    "&:hover": {
      backgroundColor: "#FF6A55",
    },
    borderRadius: "8px",
    width: "35px",
    height: "35px",
    fontSize: "12px",
    padding: "0",
    minWidth: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "-20px",
    fontFamily: "DM Sans",
  }));

  const NewCard = styled(Card)(({ theme }) => ({
    borderRadius: "2rem",
    boxShadow: "none",
    backgroundColor: "#ededed",
    padding: theme.spacing(2),
    width: "600px",
    height: "610px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    fontFamily: "DM Sans",
  }));

  const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
    "& .MuiLinearProgress-bar": {
      backgroundColor: "#FF7E6B",
    },
    backgroundColor: "#E0E0E0",
  }));

  const DashboardTitle = styled(Typography)(({ theme }) => ({
    fontFamily: "Space Grotesk",
  }));

  const CreateNewButton = styled(Button)(({ theme }) => ({
    backgroundColor: "#FF7E6B",
    color: "#000",
    "&:hover": {
      backgroundColor: "#FF6A55",
    },
    borderRadius: "8px",
    height: "35px",
    fontSize: "14px",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "auto",
    margin: "0",
    fontFamily: "DM Sans",
  }));

  const fetchQuestionnare = async (jwt) => {
    try {
      let res = await getQList(jwt);
      console.log(res);
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

  function handleLogout() {
    localStorage.removeItem("jwt");
    navigate("/");
  }

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

  useEffect(() => {
    if (!jwt) {
      if (localStorage.getItem("jwt")) {
        setJwt(localStorage.getItem("jwt"));
      } else {
        navigate("/");
      }
    }
  }, []);

  return (
    <div style={{ padding: "32px" }}>
      <DashboardTitle
        variant="h5"
        style={{ marginBottom: "20px", fontWeight: "bold" }}
      >
        Dashboard
      </DashboardTitle>
      <button
        className="absolute right-10 top-8 bg-dashred text-white p-2 rounded-lg"
        onClick={handleLogout}
      >
        Logout
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "40px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
          }}
        >
          {questionnare.map((card, index) => (
            <CustomCard key={index}>
              <CardContent style={{ flex: "1 0 auto" }}>
                <Typography variant="h6" gutterBottom>
                  {card.orgname}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(card.utctimestamp).toString()}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ marginTop: "8px", marginBottom: "8px" }}
                >
                  {card.progress}% Completed
                </Typography>
                <CustomLinearProgress
                  variant="determinate"
                  value={card.progress}
                  style={{ marginBottom: "16px" }}
                />
              </CardContent>
              <CardContent
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "8px",
                }}
              >
                <CustomButton
                  size="small"
                  style={{ marginLeft: "10px", bottom: "-25px" }}
                  onClick={() => {
                    qStore.dispatch({
                      type: "questionnaire",
                      payload: card,
                    });
                    navigate(`/questionnare?id=${card.qid}`);
                  }}
                >
                  Continue
                  <img
                    src={Design}
                    alt="Print"
                    style={{ marginLeft: "5px", width: "15px", height: "15px" }}
                  />
                </CustomButton>
                <CustomIconButton size="small" style={{ bottom: "-25px" }}>
                  <img
                    src={PrintIcon}
                    alt="Print"
                    style={{ width: "20px", height: "20px" }}
                  />
                </CustomIconButton>
              </CardContent>
            </CustomCard>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            marginRight: "120px",
          }}
        >
          <NewCard style={{ left: "500px" }}>
            <CardContent
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                color="primary"
                style={{ marginRight: "8px", color: "#000" }}
              >
                Create New
              </Typography>
              <CreateNewButton
                style={{ width: "30px", height: "30px" }}
                onClick={() => {
                  handleNew();
                }}
              >
                <AddIcon fontSize="small" style={{ color: "white" }} />
              </CreateNewButton>
            </CardContent>
          </NewCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
