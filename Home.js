import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import Constants from "expo-constants";

//sql
import { useSQLiteContext } from "expo-sqlite/next";

const { width, height } = Dimensions.get("screen");

const Home = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [questionsData, setQuestionData] = useState([]);

  const db = useSQLiteContext();

  useEffect(() => {
    const fetchData2024 = async () => {
      try {
        const query = `SELECT * FROM 'questionsData'`;
        const data = await db.getAllAsync(query);
        setQuestionData(data);
      } catch (error) {
        console.log("Error fetching questions", error);
      }
    };
    fetchData2024();
  }, [questionsData]);

  const handleNextQuestion = () => {
    setQuestionIndex((prevIndex) =>
      prevIndex < questionsData.length - 1 ? prevIndex + 1 : prevIndex
    );

    if (questionIndex !== questionsData.length - 1) {
      setSelectedOption(null);
      setSubmitted(false);
    }
  };

  const handlePreviousQuestion = () => {
    setQuestionIndex((prevIndex) =>
      prevIndex === 0 ? prevIndex : prevIndex - 1
    );

    if (questionIndex !== 0) {
      setSelectedOption(null);
      setSubmitted(false);
    }
  };

  const handleOptionSelection = (option) => {
    setSelectedOption(option);
    setSubmitted(false);
  };

  const isOptionCorrect = () => {
    return selectedOption === questionsData[questionIndex].answer;
  };

  const submit = () => {
    setSubmitted(true);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
      {questionsData.length > 0 ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handlePreviousQuestion}>
              <MaterialIcons
                name="arrow-back-ios-new"
                size={24}
                color="black"
              />
            </TouchableOpacity>
            <Text style={styles.questionNumber}>
              Question {questionsData[questionIndex].id}
            </Text>
            <TouchableOpacity onPress={handleNextQuestion}>
              <MaterialIcons name="arrow-forward-ios" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.questionContainer}>
              <Text style={styles.questionNumber}>
                Q{questionsData[questionIndex].id}.{" "}
              </Text>
              <Text>{questionsData[questionIndex].question}</Text>
            </View>

            {questionsData[questionIndex].questionImage?.length > 0 && (
              <Image
                source={{
                  uri: questionsData[questionIndex].questionImage,
                }}
                style={styles.image}
              />
            )}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === questionsData[questionIndex].option1 && {
                    backgroundColor: "#BED4FF",
                  },
                ]}
                onPress={() =>
                  handleOptionSelection(questionsData[questionIndex].option1)
                }
              >
                <Text>{questionsData[questionIndex].option1}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === questionsData[questionIndex].option2 && {
                    backgroundColor: "#BED4FF",
                  },
                ]}
                onPress={() =>
                  handleOptionSelection(questionsData[questionIndex].option2)
                }
              >
                <Text>{questionsData[questionIndex].option2}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === questionsData[questionIndex].option3 && {
                    backgroundColor: "#BED4FF",
                  },
                ]}
                onPress={() =>
                  handleOptionSelection(questionsData[questionIndex].option3)
                }
              >
                <Text>{questionsData[questionIndex].option3}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === questionsData[questionIndex].option4 && {
                    backgroundColor: "#BED4FF",
                  },
                ]}
                onPress={() =>
                  handleOptionSelection(questionsData[questionIndex].option4)
                }
              >
                <Text>{questionsData[questionIndex].option4}</Text>
              </TouchableOpacity>
              {submitted ? (
                isOptionCorrect() ? (
                  <Text
                    style={{
                      color: "green",
                      marginLeft: width * 0.02,
                      marginVertical: height * 0.01,
                    }}
                  >
                    Congrats, Right Answer
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: "red",
                      marginLeft: width * 0.02,
                      marginVertical: height * 0.01,
                    }}
                  >
                    Wrong Answer
                  </Text>
                )
              ) : null}
            </View>
          </ScrollView>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={{
                padding: 15,
                paddingVertical: 10,
                backgroundColor: "#EFF1F6",
                marginRight: width * 0.04,
                borderRadius: 20,
                elevation: 3,
                width: width * 0.4,
                alignItems: "center",
              }}
              onPress={toggleModal}
            >
              <Text>Check solution</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 15,
                paddingVertical: 10,
                backgroundColor: "#257FFF",
                borderRadius: 20,
                elevation: 3,
                width: width * 0.4,
                alignItems: "center",
              }}
              onPress={submit}
            >
              <Text style={{ color: "white" }}>Submit Answer</Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            presentationStyle="overFullScreen"
            onRequestClose={toggleModal}
          >
            <View style={styles.modalContainer}>
              <ScrollView style={styles.innerModalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>Answer</Text>
                  <TouchableOpacity onPress={toggleModal}>
                    <Entypo name="cross" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: "#BED4FF",

                      width: width * 0.66,
                      marginTop: 20,
                      marginBottom: 20,
                    },
                  ]}
                >
                  <Text>{questionsData[questionIndex].answer}</Text>
                </View>
                <View style={{ width: width * 0.6 }}>
                  <Text style={{ fontWeight: "600", marginBottom: 5 }}>
                    Soultion explaination
                  </Text>
                  <Text>{questionsData[questionIndex].solution}</Text>
                  {questionsData[questionIndex].solutionImage?.length > 0 && (
                    <Image
                      source={{
                        uri: questionsData[questionIndex].solutionImage,
                      }}
                      style={styles.solutionImage}
                    />
                  )}
                </View>
              </ScrollView>
            </View>
          </Modal>
          <StatusBar style="black" />
        </View>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    width: width,
    height: height * 0.07,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.04,
    borderBottomWidth: 0.5,
  },
  questionNumber: {
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    marginVertical: height * 0.02,
  },
  questionContainer: {
    flexDirection: "row",
    width: width * 0.8,
  },
  questionText: {
    fontWeight: "600",
  },
  image: {
    width: width * 0.8,
    height: height * 0.3,
    resizeMode: "contain",
    alignSelf: "center",
  },
  optionsContainer: {
    marginTop: height * 0.03,
  },
  optionButton: {
    padding: 15,
    borderRadius: 50,
    elevation: 2,
    marginBottom: height * 0.01,
    width: width * 0.9,
    borderColor: "black",
    borderWidth: 0.2,
    backgroundColor: "white",
  },
  resultText: {
    marginLeft: width * 0.02,
    marginVertical: height * 0.01,
  },

  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  button: {
    padding: 15,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 3,
    width: width * 0.4,
    alignItems: "center",
    marginHorizontal: width * 0.02,
  },
  buttonText: {
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  innerModalContainer: {
    marginLeft: width * 0.4,
    width: width * 0.9,
    height: height * 0.91,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalHeaderText: {
    right: width * 0.12,
    fontWeight: "600",
  },
  answerContainer: {
    backgroundColor: "#BED4FF",
    width: width * 0.66,
    marginTop: 20,
    marginBottom: 20,
  },
  solutionContainer: {
    width: width * 0.6,
  },
  solutionTitle: {
    fontWeight: "600",
    marginBottom: 5,
  },
  solutionImage: {
    width: width * 0.66,
    height: height * 0.2,
    marginRight: 10,
    resizeMode: "contain",
  },
});

export default Home;
