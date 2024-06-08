import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Pagination,
  Tooltip,
  InputBase,
  IconButton,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  UploadFile as UploadFileIcon,
  ListAlt as ListAltIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import CheckboxQuestion from "./CheckboxQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import ScaleQuestion from "./ScaleQuestion";
import TextQuestion from "./TextQuestion";
import GridQuestion from "./GridQuestion";
import { getQByQID, saveAnswer } from "../api";
import {
  jwtStore,
  gridStore,
  answerStore,
  solnStore,
  scoreStore,
} from "../redux/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./styles.css";
import InfoIcon from "@mui/icons-material/Info";
import CheckboxGridQuestion from "./CheckboxGrid";
import CommonComponent from "./CommonComponent";
import { fontSize, lineHeight, textAlign } from "@mui/system";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Questionnaire = () => {
  const [currentQuestion, setcurrentQuestion] = useState(0);
  const [completedSections, setCompletedSections] = useState(0);
  const [intervals, setIntervals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [sectionHeaders, setSectionHeaders] = useState([]);
  const [currentQID, setCurrentQID] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(true); // Initialize as true
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedResults, setSelectedResults] = useState([]);
  const [references, setReferences] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReferenceTableOpen, setIsReferenceTableOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pdfSearchQuery, setPdfSearchQuery] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [searchSummary, setSearchSummary] = useState([]);
  const [pdfSuggestions, setPdfSuggestions] = useState([]);
  const [selectedPdfTexts, setSelectedPdfTexts] = useState([]);
  const [questionReferences, setQuestionReferences] = useState([]);
  const [currentSection, setCurrentSection] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageTitle, setPageTitle] = useState("");
  const [answerObject, setAnswerObject] = useState("");
  const [jwt, setJwt] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sectionDesc, setSectionDesc] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const pdfContainerRef = useRef(null);
  const API_KEY = "AIzaSyCtqidSRsI2NhNP-vQrx1Ixq0gQHcH_eUM";
  const CX = "60cbe814015d24004";
  const [showCommonComponent, setShowCommonComponent] = useState(false);

  const typemap = {
    MULTIPLE_CHOICE: MultipleChoiceQuestion,
    GRID: GridQuestion,
    CHECKBOX_GRID: CheckboxGridQuestion,
    PAGE_BREAK: TextQuestion,
    TEXT: TextQuestion,
    SECTION_HEADER: TextQuestion,
    SCALE: ScaleQuestion,
    CHECKBOX: CheckboxQuestion,
    PARAGRAPH_TEXT: TextQuestion,
  };

  function handleError(message) {
    setError(true);
    setErrorMessage(message);
  }

  function handleClose() {
    setError(false);
    setErrorMessage("");
  }

  const handleNext = () => {
    saveCurrentReferences();
    save({
      answer_id: currentQID,
      answer_object: answerObject,
    });
  };

  const handleCommonNext = () => {
    setShowCommonComponent(false);
    if (currentQuestion < questions.length - 1) {
      setcurrentQuestion(currentQuestion + 1);
      setCompletedSections(completedSections + 1);
      loadReferencesForQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    saveCurrentReferences();
    if (currentQuestion > 0) {
      setcurrentQuestion(currentQuestion - 1);
      loadReferencesForQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    saveCurrentReferences();
    setCompletedSections(completedSections + 1);
    setOpenDialog(true);

    save({
      answer_id: currentQID,
      answer_object: answerObject,
    });
  };

  const handleSaveAndExit = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (currentQuestion + 1 !== questions.length) {
      navigate("/");
    } else {
      setSubmitted(true);
      window.open(
        `/report?id=${searchParams.get("id")}`,
        "_blank",
        "rel=noopener noreferrer"
      );
      navigate("/chart");
    }
  };

  const toggleSearchBar = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsPdfOpen(false);
    setIsReferenceTableOpen(false);
  };

  const togglePdfUpload = () => {
    setIsPdfOpen(!isPdfOpen);
    setIsSearchOpen(false);
    setIsReferenceTableOpen(false);
  };

  const toggleReferenceTable = () => {
    setIsReferenceTableOpen(!isReferenceTableOpen);
    setIsSearchOpen(false);
    setIsPdfOpen(false);
  };

  const handleSearch = async (page = 1) => {
    if (searchQuery.trim() === "") return;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1`,
        {
          params: {
            key: API_KEY,
            cx: CX,
            q: searchQuery,
            start: (page - 1) * 10 + 1,
          },
        }
      );
      setSearchResults(response.data.items || []);
      setCurrentPage(page);
      setTotalPages(
        Math.ceil(response.data.searchInformation.totalResults / 10)
      );
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };

  const handleResultSelect = (index) => {
    const selected = [...selectedResults];
    const resultIndex = selected.indexOf(index);
    if (resultIndex > -1) {
      selected.splice(resultIndex, 1);
    } else {
      selected.push(index);
    }
    setSelectedResults(selected);

    const updatedReferences = [
      ...selected.map((idx) => ({
        type: "search",
        sn: idx + 1,
        title: searchResults[idx].title,
        snippet: searchResults[idx].snippet,
        link: searchResults[idx].link,
      })),
      ...selectedPdfTexts.map((result, idx) => ({
        type: "pdf",
        sn: selected.length + idx + 1,
        title: `Page ${result.page}`,
        snippet: result.text,
        link: pdfFile,
      })),
    ];
    setReferences(updatedReferences);
  };

  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(URL.createObjectURL(file));
      setIsPdfOpen(true);
      setIsSearchOpen(false);
      setIsReferenceTableOpen(false);
      setSearchSummary([]);
    }
  };

  const handlePdfClose = () => {
    setIsPdfOpen(false);
    setPdfFile(null);
    setPdfSearchQuery("");
    setSearchSummary([]);
    fileInputRef.current.value = "";
  };

  const handlePdfSearch = async (query) => {
    setPdfSearchQuery(query);
    const pdf = await pdfjs.getDocument(pdfFile).promise;
    const searchSummary = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const textItems = textContent.items;
      let pageResults = [];
      textItems.forEach((item, itemIndex) => {
        if (item.str.toLowerCase().includes(query.toLowerCase())) {
          pageResults.push({ text: item.str, page: pageNum, index: itemIndex });
        }
      });
      if (pageResults.length > 0) {
        searchSummary.push(...pageResults);
      }
    }
    setSearchSummary(searchSummary);
  };

  const handlePdfTextSelect = (text) => {
    const selected = [...selectedPdfTexts];
    const index = selected.findIndex(
      (item) => item.page === text.page && item.text === text.text
    );

    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(text);
    }

    setSelectedPdfTexts(selected);

    const updatedReferences = [
      ...selectedResults.map((idx) => ({
        type: "search",
        sn: idx + 1,
        title: searchResults[idx].title,
        snippet: searchResults[idx].snippet,
        link: searchResults[idx].link,
      })),
      ...selected.map((result, idx) => ({
        type: "pdf",
        sn: selectedResults.length + idx + 1,
        title: `Page ${result.page}`,
        snippet: result.text,
        link: pdfFile,
      })),
    ];

    setReferences(updatedReferences);
  };

  const saveCurrentReferences = () => {
    const updatedQuestionReferences = [...questionReferences];
    updatedQuestionReferences[currentQuestion] = references;
    setQuestionReferences(updatedQuestionReferences);
  };

  const loadReferencesForQuestion = (questionIndex) => {
    const refs = questionReferences[questionIndex] || [];
    setReferences(refs);
    setSelectedResults(
      refs.filter((ref) => ref.type === "search").map((ref) => ref.sn - 1)
    );
    setSelectedPdfTexts(
      refs
        .filter((ref) => ref.type === "pdf")
        .map((ref) => ({
          text: ref.snippet,
          page: parseInt(ref.title.split(" ")[1]),
        }))
    );
  };

  const generateJsonOutput = () => {
    return questions.map((question, index) => ({
      question: question.itemTitle,
      references: questionReferences[index] || [],
    }));
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const questionStyles = {
    backgroundColor: "white",
    color: "#4D4556",
    textAlign: "center",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "10px",
    marginBottom: "20px",
    fontFamily: "DM Sans, sans-serif",
    transition: "all 10s ease",
  };

  const optionStyles = {
    color: "#A4A1A0",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    fontFamily: "DM Sans, sans-serif",
  };

  const questionTextStyles = {
    color: "#4D4556",
    fontWeight: "bold",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    fontFamily: "DM Sans, sans-serif",
  };
  const descStyles = {
    color: "#4D4556",
    fontWeight: "normal",
    fontSize: "15px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    fontFamily: "DM Sans, sans-serif",
  };

  const progressBarContainerStyles = {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "40px",
    display: "flex",
    backgroundColor: "white",
    overflow: "hidden",
    transition: "all 1s ease",
  };

  const progressBarSegmentStyles = {
    flex: 1,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    position: "relative",
    zIndex: 1,
    fontFamily: "DM Sans, sans-serif",
  };

  const progressFillStyles = {
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    transition: "width 0.3s ease",
    backgroundColor: "#1EC8DF",
    zIndex: 0,
  };

  const referenceTableStyles = {
    backgroundColor: "white",
    color: "#A4A1A0",
    padding: "20px",
    borderRadius: "16px",
    marginTop: "15px",
    width: "90%",
    height: "calc(100% - 100px)",
    overflowY: "auto",
    fontFamily: "DM Sans, sans-serif",
  };

  const referenceTableHeaderStyles = {
    color: "#A6A4A3",
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "10px",
    textAlign: "center",
    fontFamily: "DM Sans, sans-serif",
  };

  const menuIconStyles = {
    backgroundColor: "#E5FFFC",
    borderRadius: "50%",
    padding: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
    transition: "background-color 0.3s ease",
  };

  const searchContainerStyles = {
    backgroundColor: "white",
    color: "#A4A1A0",
    padding: "20px",
    borderRadius: "20px",
    marginTop: "25px",
    width: "90%",
    height: "calc(100% - 100px)",
    overflowY: "auto",
    fontFamily: "DM Sans, sans-serif",
  };

  const getQ = async (id, jwt) => {
    try {
      let res = await getQByQID(id, jwt);

      if (res && res.form && res.data) {
        let breaks = 1;

        setPageTitle(res.form.title);

        let secHeaders = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].type === "SECTION_HEADER") {
            let ques = res.data[i];
            ques.start = i - breaks;
            secHeaders.push(ques);
          }
          breaks++;
        }
        setSectionHeaders(secHeaders);
        setQuestions(res.data);
        setIntervals(breaks);
      } else {
        console.error("Invalid response structure", res);
      }
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  jwtStore.subscribe(() => {
    setJwt(jwtStore.getState());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get("id");
      if (id && jwt) {
        await getQ(id, jwt);
      } else {
        console.error("Missing required parameters: id or jwt");
      }
    };

    if (jwt !== "") {
      fetchData();
    }
  }, [jwt]);

  answerStore.subscribe(() => {
    setAnswerObject(answerStore.getState());
  });

  const save = async (payload) => {
    let res = await saveAnswer(searchParams.get("id"), jwt, payload);
    if (res.status === "ok") {
      gridStore.dispatch({
        type: "grid",
        payload: {
          options: [],
          columns: [],
        },
      });
      scoreStore.dispatch({
        type: "scores",
        payload: res.model.scores,
      });
      if (currentQuestion < questions.length - 1) {
        if (questions[currentQuestion + 1].type === "SECTION_HEADER") {
          setShowCommonComponent(true);
        } else {
          setcurrentQuestion(currentQuestion + 1);
          setCompletedSections(completedSections + 1);
          loadReferencesForQuestion(currentQuestion + 1);
        }
      } else {
        handleSubmit();
      }
    } else {
      handleError("This field is required");
    }
  };

  useEffect(() => {
    if (questions.length !== 0) {
      solnStore.dispatch({
        type: "solution",
        payload: questions[currentQuestion].answers,
      });
      setCurrentQID(questions[currentQuestion].id);
      if (
        questions[currentQuestion].type === "GRID" ||
        questions[currentQuestion].type === "CHECKBOX_GRID"
      ) {
        gridStore.dispatch({
          type: "grid",
          payload: {
            options: JSON.parse(questions[currentQuestion].columns),
            columns: Object.keys(JSON.parse(questions[currentQuestion].rows)),
          },
        });
      }

      let ques = questions[currentQuestion];
      if (ques.type === "SECTION_HEADER") {
        setCurrentSection(ques.itemTitle);
        setSectionDesc(ques.description);
        setcurrentQuestion(currentQuestion + 1);
      } else if (ques.type === "PAGE_BREAK") {
        setcurrentQuestion(currentQuestion + 1);
      }
    }
  }, [currentQuestion, questions]);

  jwtStore.subscribe(() => {
    setJwt(jwtStore.getState());
  });

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      setJwt(localStorage.getItem("jwt"));
      jwtStore.dispatch({
        type: "jwt",
        payload: localStorage.getItem("jwt"),
      });
    }
  }, []);

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: "white",
        color: "#A4A1A0",
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "DM Sans, sans-serif",
        transition: "all 10s ease",
      }}
    >
      <Snackbar
        open={error}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      {showCommonComponent ? (
        <CommonComponent
          handleNext={handleCommonNext}
          section={currentSection}
        />
      ) : (
        <>
          <div
            style={{
              width: "33%",
              backgroundColor: "#E5FFFC",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              overflow: "hidden",
              fontFamily: "DM Sans, sans-serif",
              borderRadius: "40px",
              position: "fixed",
              top: "80px",
              left: "20px",
            }}
          >
            {isSearchOpen && (
              <div style={searchContainerStyles}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    marginTop: "10px",
                  }}
                >
                  <Paper
                    component="form"
                    sx={{
                      p: "2px 4px",
                      display: "flex",
                      alignItems: "center",
                      width: "90%",
                      margin: "0 auto",
                    }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSearch(1);
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search"
                      inputProps={{ "aria-label": "search" }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="search"
                      onClick={() => handleSearch(1)}
                    >
                      <SearchIcon />
                    </IconButton>
                  </Paper>
                </div>
                <div
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "0 20px",
                    overflowY: "auto",
                    height: "80%",
                  }}
                >
                  {searchResults.map((result, index) => (
                    <div key={index} style={{ marginBottom: "20px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedResults.includes(index)}
                            onChange={() => handleResultSelect(index)}
                          />
                        }
                        label={
                          <div>
                            <a
                              href={result.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#4D4556",
                                textDecoration: "none",
                              }}
                            >
                              <Typography
                                variant="h6"
                                style={{ color: "#4D4556" }}
                              >
                                {result.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                style={{ color: "grey" }}
                              >
                                {result.snippet}
                              </Typography>
                            </a>
                          </div>
                        }
                      />
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, page) => handleSearch(page)}
                    style={{ margin: "20px 0" }}
                  />
                )}
              </div>
            )}
            {isPdfOpen && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "90%",
                    marginBottom: "10px",
                  }}
                >
                  <Paper
                    component="form"
                    sx={{
                      p: "2px 4px",
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search in PDF..."
                      inputProps={{ "aria-label": "search in pdf" }}
                      value={pdfSearchQuery}
                      onChange={(e) => setPdfSearchQuery(e.target.value)}
                    />
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="search"
                      onClick={() => handlePdfSearch(pdfSearchQuery)}
                    >
                      <SearchIcon />
                    </IconButton>
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="close"
                      onClick={handlePdfClose}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Paper>
                </div>
                <div
                  style={{
                    width: "100%",
                    padding: "0 20px",
                    height: "calc(100% - 60px)",
                    overflowX: "auto",
                  }}
                >
                  <div>
                    {searchSummary.map((result, index) => (
                      <div
                        key={index}
                        style={{ marginBottom: "10px", color: "#4D4556" }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedPdfTexts.some(
                                (item) =>
                                  item.page === result.page &&
                                  item.text === result.text
                              )}
                              onChange={() => handlePdfTextSelect(result)}
                            />
                          }
                          label={
                            <Typography variant="body2">
                              Page {result.page}: {result.text}
                            </Typography>
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <Document
                    file={pdfFile}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    onLoadError={console.error}
                    renderMode="canvas"
                  >
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                  </Document>
                </div>
              </>
            )}
            {isReferenceTableOpen && (
              <div style={referenceTableStyles}>
                <Typography variant="h6" style={referenceTableHeaderStyles}>
                  References
                </Typography>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          borderBottom: "1px solid #A6A4A3",
                          paddingBottom: "10px",
                          color: "#4D4556",
                        }}
                      >
                        Select
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #A6A4A3",
                          paddingBottom: "10px",
                          color: "#4D4556",
                        }}
                      >
                        Search Result Title
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #A6A4A3",
                          paddingBottom: "10px",
                          color: "#4D4556",
                        }}
                      >
                        Preview Text
                      </th>
                      <th
                        style={{
                          borderBottom: "1px solid #A6A4A3",
                          paddingBottom: "10px",
                          color: "#4D4556",
                        }}
                      >
                        Link
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {references.map((reference, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            padding: "10px",
                            textAlign: "center",
                            color: "#4D4556",
                          }}
                        >
                          <Checkbox checked />
                        </td>
                        <td style={{ padding: "10px", color: "#4D4556" }}>
                          {reference.title}
                        </td>
                        <td style={{ padding: "10px", color: "#4D4556" }}>
                          {reference.snippet}
                        </td>
                        <td style={{ padding: "10px", color: "#4D4556" }}>
                          <a
                            href={reference.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "blue",
                              textDecoration: "none",
                            }}
                          >
                            {reference.link}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div
            className="max-w-5xl mx-auto"
            style={{
              flex: "1",
              backgroundColor: "2A2A2A",
              overflowY: "auto",
              height: "100vh",
              padding: "20px",
              maxWidth: "60vw",
              fontFamily: "DM Sans, sans-serif",
              transition: "all 10s ease",
              marginLeft: "33%",
            }}
          >
            <Typography
              variant="h4"
              className="text-white text-center mb-8"
              style={{
                fontFamily: "DM Sans, sans-serif",
                marginTop: "50px",
                color: "#2A2A2A",
                fontWeight: "bold",
                fontSize: "30px",
              }}
            >
              {currentSection}
            </Typography>
            <div style={questionStyles}>
              <Typography variant="h6" style={{ ...questionTextStyles }}>
                {questions.length === 0
                  ? ""
                  : questions[currentQuestion].itemTitle}
              </Typography>
              <Typography variant="h6" style={{ ...descStyles }}>
                {questions.length === 0
                  ? ""
                  : questions[currentQuestion].description}
              </Typography>
              <div
                style={{
                  maxWidth:
                    questions.length !== 0 &&
                    (questions[currentQuestion].type === "GRID" ||
                      questions[currentQuestion].type === "CHECKBOX_GRID")
                      ? "90vw"
                      : "100%",
                }}
              >
                {questions.length !== 0 &&
                  React.createElement(
                    typemap[questions[currentQuestion].type],
                    {
                      options:
                        questions[currentQuestion].type === "MULTIPLE_CHOICE" ||
                        questions[currentQuestion].type === "CHECKBOX"
                          ? Object.keys(
                              JSON.parse(questions[currentQuestion].choices)
                            )
                          : [],
                      minLabel:
                        questions[currentQuestion].type === "SCALE"
                          ? JSON.parse(questions[currentQuestion].bounds)[0]
                              .label
                          : "",
                      maxLabel:
                        questions[currentQuestion].type === "SCALE"
                          ? JSON.parse(questions[currentQuestion].bounds)[1]
                              .label
                          : "",
                      optionStyles: optionStyles,
                    }
                  )}
              </div>
              {isReferenceTableOpen && (
                <div style={referenceTableStyles}>
                  <Typography variant="h6" style={referenceTableHeaderStyles}>
                    References for this question
                  </Typography>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th
                          style={{
                            borderBottom: "1px solid #A6A4A3",
                            paddingBottom: "10px",
                            color: "#4D4556",
                          }}
                        >
                          Select
                        </th>
                        <th
                          style={{
                            borderBottom: "1px solid #A6A4A3",
                            paddingBottom: "10px",
                            color: "#4D4556",
                          }}
                        >
                          Search Result Title
                        </th>
                        <th
                          style={{
                            borderBottom: "1px solid #A6A4A3",
                            paddingBottom: "10px",
                            color: "#4D4556",
                          }}
                        >
                          Preview Text
                        </th>
                        <th
                          style={{
                            borderBottom: "1px solid #A6A4A3",
                            paddingBottom: "10px",
                            color: "#4D4556",
                          }}
                        >
                          Link
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {references.map((reference, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              padding: "10px",
                              textAlign: "center",
                              color: "#4D4556",
                            }}
                          >
                            <Checkbox checked />
                          </td>
                          <td style={{ padding: "10px", color: "#4D4556" }}>
                            {reference.title}
                          </td>
                          <td style={{ padding: "10px", color: "#4D4556" }}>
                            {reference.snippet}
                          </td>
                          <td style={{ padding: "10px", color: "#4D4556" }}>
                            <a
                              href={reference.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "blue",
                                textDecoration: "none",
                              }}
                            >
                              {reference.link}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {currentQuestion < questions.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  className=""
                  style={{
                    backgroundColor: "#449082",
                    color: "white",
                    marginTop: "20px",
                    width: "200px",
                    height: "40px",
                    fontSize: "16px",
                    display: "block",
                    margin: "20px auto 40px auto",
                    border: "1px solid #449082",
                    fontFamily: "DM Sans, sans-serif",
                    boxShadow: "none",
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  className="icon-slide-right"
                  style={{
                    backgroundColor: "#A9A7FF",
                    color: "white",
                    marginTop: "20px",
                    width: "200px",
                    height: "40px",
                    fontSize: "16px",
                    display: "block",
                    margin: "20px auto 40px auto",
                    border: "1px solid #A851FF",
                    fontFamily: "DM Sans, sans-serif",
                    boxShadow: "none",
                  }}
                >
                  Submit
                </Button>
              )}
            </div>
            <div style={progressBarContainerStyles}>
              <div
                style={{
                  ...progressFillStyles,
                  width: `${progressPercentage}%`,
                }}
              ></div>
              <div
                style={{
                  ...progressBarSegmentStyles,
                  color: "#2A2A2A",
                  opacity: 1,
                }}
              >
                {currentSection !== "" && (
                  <Tooltip
                    title={
                      <Typography variant="body2" style={{ fontSize: "36" }}>
                        {sectionDesc}
                      </Typography>
                    }
                    arrow
                  >
                    <IconButton>
                      <InfoIcon sx={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                )}
                {currentSection}
              </div>
            </div>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Questionnaire Submitted</DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  Your answers have been successfully submitted!
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseDialog}
                  style={{
                    backgroundColor: "#1EC8DF",
                    color: "white",
                  }}
                  variant="contained"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              variant="text"
              color="primary"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="glow-on-hover"
              style={{
                color: "#4D4556",
                top: "-5px",
                fontFamily: "DM Sans, sans-serif",
                transition: "0.3sec",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#2B675C";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#4D4556";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Tooltip title="Back">
                <ArrowBackIcon style={{ fontSize: 32 }} />
              </Tooltip>
            </Button>
            <Tooltip title="Open Search">
              <IconButton
                onClick={toggleSearchBar}
                style={menuIconStyles}
                sx={{ marginLeft: 1 }}
                onMouseOver={(e) => {
                  e.currentTarget.children[0].style.color = "#2B675C";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.children[0].style.color = "#4D4556";
                }}
              >
                <SearchIcon style={{ color: "#A4A1A0", fontSize: 32 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload PDF">
              <IconButton
                onClick={() => {
                  fileInputRef.current.click();
                  togglePdfUpload();
                }}
                style={menuIconStyles}
                sx={{ marginLeft: 1 }}
                onMouseOver={(e) => {
                  e.currentTarget.children[0].style.color = "#2B675C";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.children[0].style.color = "#4D4556";
                }}
              >
                <UploadFileIcon style={{ color: "#A4A1A0", fontSize: 32 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reference Table">
              <IconButton
                onClick={toggleReferenceTable}
                style={menuIconStyles}
                sx={{ marginLeft: 1 }}
                onMouseOver={(e) => {
                  e.currentTarget.children[0].style.color = "#2B675C";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.children[0].style.color = "#4D4556";
                }}
              >
                <ListAltIcon style={{ color: "#A4A1A0", fontSize: 32 }} />
              </IconButton>
            </Tooltip>
          </div>
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Tooltip title="Save and Exit" arrow>
              <Button
                variant="text"
                color="primary"
                onClick={handleSaveAndExit}
                className="glow-on-hover"
                style={{
                  color: "#4D4556",
                  backgroundColor: "transparent",
                  fontFamily: "DM Sans, sans-serif",
                  transition: "0.3s",
                }}
                startIcon={
                  <CloseIcon
                    style={{
                      fontSize: 30,
                      marginRight: "-5px",
                    }}
                  />
                }
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#FF2C5F";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#4D4556";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {/* The text has been removed */}
              </Button>
            </Tooltip>
          </div>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </>
      )}
    </div>
  );
};

export default Questionnaire;
