import React, { useState, useEffect, useCallback } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
  Image,
} from "@react-pdf/renderer";
import { useSearchParams } from "react-router-dom";
import { getQByQID } from "../api";
import inter from "../fonts/Inter-ExtraLight.ttf";
import BubbleChart from "./BubbleChart";

Font.register({
  family: "inter",
  format: "truetype",
  src: inter,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    fontFamily: "inter",
    padding: 30,
    position: "relative",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 8,
    marginBottom: 5,
  },
  reportSummary: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dynamicField: {
    border: "1pt dotted #000",
    padding: 5,
    marginVertical: 5,
    flexGrow: 1,
  },
  chartContainer: {
    height: 100,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  smallChartContainer: {
    width: "40%",
    height: "auto",
    marginLeft: "auto",
    marginRight: 0,
  },
  referenceTable: {
    width: "100%",
    marginTop: 10,
    border: "1pt dotted #000",
    padding: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },
  headerContainer: {
    flexDirection: "column",
    marginBottom: 5,
  },
  heading: {
    fontSize: 10,
  },
  updateInfo: {
    position: "absolute",
    bottom: 10,
    right: 30,
    fontSize: 8,
  },
  pageNum: {
    position: "absolute",
    bottom: 10,
    left: 30,
    fontSize: 8,
  },
});

const Report = () => {
  const [jwt, setJwt] = useState("");
  const [id, setId] = useState("");
  const [data, setData] = useState({});
  const [searchParams] = useSearchParams();
  const [chartImage, setChartImage] = useState("");

  const getQ = async (id, jwt) => {
    const res = await getQByQID(id, jwt);
    setData(res.data);
  };

  useEffect(() => {
    const storedJwt = localStorage.getItem("jwt");
    if (storedJwt) {
      setJwt(storedJwt);
    } else {
      console.error("No JWT found in localStorage");
    }
    setId(searchParams.get("id"));
  }, [searchParams]);

  useEffect(() => {
    if (id && jwt) {
      getQ(id, jwt);
    }
  }, [id, jwt]);

  const handleImageGenerated = useCallback((image) => {
    setChartImage(image);
  }, []);

  return (
    <>
      <BubbleChart onImageGenerated={handleImageGenerated} />
      <PDFViewer style={{ width: "100%", height: "100vh" }}>
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.title}>{data.company_name || "Global Company LLC"}</Text>
              <Text style={styles.subtitle}>Time frame of analysis: {data.time_frame || "2024-2029"}</Text>
            </View>
            <View style={styles.section}>
              <View style={styles.headerContainer}>
                <Text style={styles.heading}>Report Summary:</Text>
                <View style={styles.dynamicField}>
                  <Text>Blank, user-editable text areas, in future server-generated text may go here. Rich text formatting: bold, italic, underline, and hyperlink.</Text>
                </View>
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.headerContainer}>
                <Text style={styles.heading}>Context:</Text>
                <View style={styles.dynamicField}>
                  <Text>Research framework and methodologies</Text>
                </View>
                <View style={styles.dynamicField}>
                  <Text>Case-specific notes</Text>
                </View>
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.headerContainer}>
                <Text style={styles.heading}>Analysis:</Text>
                <View style={styles.dynamicField}>
                  <Text>Performance Analysis</Text>
                </View>
                <View style={styles.dynamicField}>
                  <Text>Confidence Analysis</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View style={[styles.dynamicField, { height: 50, flex: 1 }]}>
                    <Text>Opinion</Text>
                  </View>
                  <View style={styles.smallChartContainer}>
                    {chartImage ? (
                      <Image src={chartImage} style={{ width: "100%", height: "auto" }} />
                    ) : (
                      <Text>Loading chart...</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.updateInfo}>
              <Text style={styles.text}>Last update: 2024-04-01 09:15</Text>
              <Text style={styles.text}>Current print: 2024-05-23 08:00</Text>
            </View>
            <Text style={styles.pageNum}>Page: 1 of 2</Text>
          </Page>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.title}>{data.company_name || "Global Company LLC"}</Text>
              <Text style={styles.subtitle}>Time frame of analysis: {data.time_frame || "2024-2029"}</Text>
            </View>
            <View style={styles.section}>
              <View style={styles.headerContainer}>
                <Text style={styles.heading}>Analysis continued:</Text>
                <View style={{ flexDirection: "row" }}>
                  <View style={[styles.dynamicField, { height: 150, flex: 1 }]}>
                    <Text>Opinion (continued):</Text>
                  </View>
                  <View style={styles.smallChartContainer}>
                    {chartImage ? (
                      <Image src={chartImage} style={{ width: "100%", height: "auto" }} />
                    ) : (
                      <Text>Loading chart...</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.headerContainer}>
                <Text style={styles.heading}>Conclusion:</Text>
                <View style={[styles.dynamicField, { height: 60 }]}></View>
              </View>
            </View>
            <View style={styles.section}>
              <View style={styles.headerContainer}>
                <Text style={styles.heading}>References:</Text>
                <View style={styles.referenceTable}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>S/N</Text>
                    <Text style={styles.tableCell}># refs</Text>
                    <Text style={styles.tableCell}>Document</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>1</Text>
                    <Text style={styles.tableCell}>17</Text>
                    <Text style={styles.tableCell}>Global Company LLC Annual Report 2023</Text>
                  </View>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>2</Text>
                    <Text style={styles.tableCell}>5</Text>
                    <Text style={styles.tableCell}>Global Company LLC CSR report 2022</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.updateInfo}>
              <Text style={styles.text}>Last update: 2024-04-01 09:15</Text>
              <Text style={styles.text}>Current print: 2024-05-23 08:00</Text>
            </View>
            <Text style={styles.pageNum}>Page: 2 of 2</Text>
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
};

export default Report;
