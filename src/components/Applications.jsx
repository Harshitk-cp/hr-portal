import { useState, useEffect } from "react";

import axios from "axios";

import apiList from "../lib/apiList";
import {
  Button,
  Loader,
  Paper,
  Text,
  TextInput,
  createStyles,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { CheckIcon, CrossCircledIcon } from "@radix-ui/react-icons";

const useStyles = createStyles((theme) => ({
  applicationItem: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    borderRadius: theme.radius.md,
  },
  applicationDetails: {
    flex: 1,
    marginRight: "theme.spacing.md",
  },
  applicationTitle: {
    marginBottom: "theme.spacing.xs",
    fontWeight: 500,
  },
  userCard: {
    background: theme.colors.dark[5],
    padding: theme.spacing.md,
    margin: theme.spacing.md,
    marginRight: "200px",
    borderRadius: theme.radius.md,
  },
  searchBar: {
    marginBottom: theme.spacing.md,
  },
}));

const Applications = (props) => {
  const [applications, setApplications] = useState([]);
  const { classes } = useStyles();
  const [expandedUser, setExpandedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalApplications, setOriginalApplications] = useState([]);
  const [reviewResponses, setReviewResponses] = useState({});

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [searchTerm]);

  const handleSearch = () => {
    filterApplications();
  };

  const filterApplications = () => {
    if (searchTerm.trim() === "") {
      // If search term is empty, display all applications
      setApplications(originalApplications);
    } else {
      // Filter applications based on the search term
      const filteredApplications = originalApplications.filter((application) =>
        application.user.data.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setApplications(filteredApplications);
    }
  };

  const handleExpandUser = (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  const getReview = async (userId, description) => {
    const url = apiList.getReview;

    try {
      notifications.show({
        id: "load-data",
        loading: true,
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.blue[6],
            borderColor: theme.colors.blue[6],

            "&::before": { backgroundColor: theme.white },
          },

          title: { color: theme.white },
          description: { color: theme.white },
          loader: { color: theme.white },
          closeButton: {
            color: theme.white,
            "&:hover": { backgroundColor: theme.colors.blue[7] },
          },
        }),
        title: "Generating Review",
        message: "Please wait...",
        autoClose: false,
        withCloseButton: false,
      });
      const response = await axios.post(url, {
        userId: userId,
        description: description,
      });
      const reviewResponse =
        "I am Harshit Kumar, a skilled and dedicated professional with a strong technical background. I have expertise in various programming languages such as Java, Kotlin, JavaScript, XML, and HTML. I am proficient in utilizing frameworks and technologies including Android Studio, Gradle, Node.JS, ExpressJS, MySQL, MongoDB, Rest API, and WebSockets. As a Flutter Developer Intern at Finplify, I had the opportunity to develop frontend applications for iOS and Android using the Flutter framework. I successfully integrated the RazorPay payment gateway, enabling seamless digital gold purchases. During my tenure as a Software Developer Intern at EvrFin, I developed an Android app to streamline financial management. I also hosted the app on the Google Play Store. I integrated the MoEngage SDK, a customer engagement platform, and utilized AWS S3 for secure storage of confidential user data. As a Mobile Developer Intern at IBDTD, I built Android apps using Android Studio, Java, and Kotlin. I worked on UIs made using XML, Jetpack with Data Binding and View Binding. I utilized Retrofit for making REST API requests and implemented WebSockets for real-time data updates. I always strive to write clean and maintainable code using the MVVM architecture. In addition to my internships, I have worked on various projects, including an online multiplayer Ping-Pong game developed using HTML, CSS, and JavaScript. I built the backend using NodeJS and established real-time communication between the client and server through WebSockets. I also developed a group live chat application where I integrated the frontend application using OkHTTP client and implemented end-to-end encryption (AES Cryptography) for secure message exchange.";

      const _reviewResponse = response.data.data.choices[0].message.content;

      notifications.update({
        id: "load-data",
        title: "Review",
        icon: <CheckIcon size="1rem" />,
        message: "Generated",
        autoClose: 2000,
      });

      setReviewResponses((prevState) => ({
        ...prevState,
        [userId]: _reviewResponse,
      }));
    } catch (error) {
      notifications.update({
        id: "load-data",
        title: "Error",
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.blue[6],
            borderColor: theme.colors.blue[6],

            "&::before": { backgroundColor: theme.white },
          },

          title: { color: theme.white },
          description: { color: theme.white },
          loader: { color: theme.white },
          closeButton: {
            color: theme.white,
            "&:hover": { backgroundColor: theme.colors.blue[7] },
          },
        }),
        icon: <CrossCircledIcon size="1rem" />,
        message: error.response.data.message,
        autoClose: 2000,
      });
    }
  };

  const getData = async () => {
    const url =
      apiList.getApplications +
      `${localStorage.getItem("userId")}/hrApplications`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const applicationsData = response.data.data;
      const updatedApplications = await Promise.all(
        applicationsData.map(async (application) => {
          const userId = application.applicantId;
          const userUrl = apiList.getUserDetails + `${userId}`;
          const jobUrl = apiList.getJobs + "648f11f79fd225b5d446f10a";
          const [userResponse, jobResponse] = await Promise.all([
            axios.get(userUrl),
            axios.get(jobUrl),
          ]);
          const userData = userResponse.data;

          const jobData = jobResponse.data;
          return {
            ...application,
            user: userData,
            job: jobData ?? { title: "Job not found" },
          };
        })
      );

      setOriginalApplications(updatedApplications);
      setApplications(updatedApplications);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.response.data.message,
      });
    }
  };

  return (
    <div>
      <TextInput
        className={classes.searchBar}
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search by title"
      />

      {applications.map((application, index) => (
        <Paper key={index} className={classes.applicationItem}>
          <div className={classes.applicationDetails}>
            <Text
              className={classes.applicationTitle}
              size="lg"
              weight={500}
              color="white"
            >
              {application.job.data.title}
            </Text>
            <Text size="md">{application.job.data.description}</Text>

            <Text size="lg" color="white">
              {application.user.data.name}
            </Text>

            <Button
              onClick={() => handleExpandUser(application.user.data._id)}
              variant="link"
              color="blue"
              size="xs"
            >
              {"show more ->"}
            </Button>

            {expandedUser === application.user.data._id && (
              <div className={classes.userCard}>
                <Text>Email: {application.user.data.email}</Text>
                <Text>Bio: {application.user.data.bio}</Text>
                <Text>Age: {application.user.data.age}</Text>
                <Text>Resume</Text>
                <Button
                  onClick={() =>
                    getReview(
                      application.user.data._id,
                      application.job.data.description
                    )
                  }
                  variant="outline"
                  color="blue"
                  size="sm"
                >
                  Ask AI for review
                </Button>
              </div>
            )}

            {reviewResponses[application.user.data._id] && (
              <div>
                <Text weight="bold" color="blue">
                  AI Review of applicant:
                </Text>
                {reviewResponses[application.user.data._id]}
              </div>
            )}
          </div>
          <Button
            onClick={() => handleUpdateApplication(application._id)}
            variant="outline"
            color="blue"
            size="sm"
          >
            Update Application
          </Button>
        </Paper>
      ))}
    </div>
  );
};

export default Applications;
