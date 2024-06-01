import inter from "../fonts/Inter-ExtraLight.ttf";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getQByQID } from "../api";

Font.register({
  family: "inter",
  format: "truetype",
  src: inter,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    fontFamily: "inter",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
  },
  subtext: {
    fontSize: 10,
    fontWeight: 1,
  },
});

const Report = () => {
  const [jwt, setJwt] = useState("");
  const [id, setId] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const getQ = async (id, jwt) => {
    let res = await getQByQID(id, jwt);
    console.log(res.scores);
  };

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      setJwt(localStorage.getItem("jwt"));
    } else {
      console.log("error");
    }
    setId(searchParams.get("id"));
  });

  useEffect(() => {
    getQ(id, jwt);
  }, [jwt, id]);
  return (
    <PDFViewer style={{ width: "100%", height: "100%" }} showToolbar={true}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Global company LLC</Text>
            <Text style={styles.subtext}>
              Time frame of analysis: 2024-2029
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default Report;
