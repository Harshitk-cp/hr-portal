import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import axios from "axios";

import apiList from "../lib/apiList";
import {
  Button,
  Modal,
  Paper,
  Text,
  TextInput,
  createStyles,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { CheckIcon, CrossCircledIcon } from "@radix-ui/react-icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
  noJobsMessage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "200px",
    backgroundColor: theme.colors.dark[6],
    marginTop: "20px",
  },
  btnResumeGroup: {
    marginTop: "20px",
  },
}));

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [application, setApplication] = useState([]);
  const { classes } = useStyles();
  const [expandedUser, setExpandedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalApplications, setOriginalApplications] = useState([]);
  const [reviewResponses, setReviewResponses] = useState({});
  const [opened, setOpened] = useState(false);
  const [resumeOpened, setResumeOpened] = useState(false);
  const [action, setAction] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    filterApplications();
  });

  const filterApplications = () => {
    if (searchTerm.trim() === "") {
      // If search term is empty, display all applications
      setApplications(originalApplications);
    } else {
      // Filter applications based on the search term
      const filteredApplications = originalApplications.filter((application) =>
        application.job.data.title
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

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const viewResume = (resumeData) => {
    const { buffer } = new Uint8Array(resumeData.data);
    setSelectedResume(buffer);
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
          const jobUrl = apiList.getJobs + `${application.jobId}`;
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

  const updateApplication = () => {
    let url = `${apiList.updateApplication}/${application._id}/update`;
    axios
      .post(
        url,
        {
          applicationId: application._id,
          action: action,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        notifications.show({
          title: "Success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        notifications.show({
          title: "error",
          message: err.response.data.message,
        });
      });
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setAction("");
        }}
        title="Update Application"
        centered
      >
        <div style={{ marginTop: 20 }}>
          <label>
            <input
              type="radio"
              name="status"
              value="reject"
              onChange={() => setAction("reject")}
            />
            Reject
          </label>
          <label style={{ marginLeft: 20 }}>
            <input
              type="radio"
              name="status"
              value="accept"
              onChange={() => setAction("accept")}
            />
            Move Forward
          </label>
        </div>

        <div style={{ marginTop: 20 }}>
          <Button variant="outline" onClick={() => setOpened(false)}>
            Cancel
          </Button>
          <span style={{ marginLeft: 20 }}>
            <Button
              variant="filled"
              color="blue"
              onClick={() => {
                setOpened(false);
                updateApplication();
              }}
              disabled={!action}
            >
              Save Changes
            </Button>
          </span>
        </div>
      </Modal>

      <Modal
        opened={resumeOpened}
        onClose={() => {
          setResumeOpened(false);
        }}
        transitionProps={{ transition: "fade", duration: 200 }}
        title="RESUME"
        size={"auto"}
        centered
      >
        <div style={{ marginTop: 20 }}>
          {
            <div className="pdf-container">
              {selectedResume && (
                <div>
                  <Document
                    file={selectedResume}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                  <p style={{ textAlign: "center" }}>
                    Page {pageNumber} of {numPages}
                  </p>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <button
                      onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
                    >
                      &lt; Prev
                    </button>
                    <button
                      onClick={() =>
                        setPageNumber(Math.min(pageNumber + 1, numPages))
                      }
                    >
                      Next &gt;
                    </button>
                  </div>
                </div>
              )}
            </div>
          }
        </div>
      </Modal>

      <div>
        <TextInput
          className={classes.searchBar}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by title"
        />

        {applications.length === 0 ? (
          <Paper className={classes.noJobsMessage}>
            <Text>No Application found</Text>
          </Paper>
        ) : (
          applications.map((application, index) => (
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
                <Text size="md">
                  Total Rounds: {application.job.data.noOfRounds}
                </Text>

                <Text size="lg" color="white">
                  {application.user.data.name}
                </Text>

                <Button
                  onClick={() => handleExpandUser(application._id)}
                  variant="link"
                  color="blue"
                  size="xs"
                >
                  {"show more ->"}
                </Button>

                {expandedUser === application._id && (
                  <div className={classes.userCard}>
                    <Text>Email: {application.user.data.email}</Text>
                    <Text>Bio: {application.user.data.bio}</Text>
                    <Text>Current Round: {application.currentRound}</Text>
                    <Text>Status: {application.status}</Text>
                    <div className={classes.btnResumeGroup}>
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
                        style={{ marginRight: "10px" }}
                      >
                        Ask AI for review
                      </Button>

                      <Button
                        onClick={() => {
                          viewResume(application.user.data.resume);
                          setResumeOpened(true);
                        }}
                        variant="outline"
                        color="blue"
                        size="sm"
                      >
                        View Resume
                      </Button>
                    </div>
                  </div>
                )}

                {expandedUser === application._id &&
                  reviewResponses[application.user.data._id] && (
                    <div>
                      <Text weight="bold" color="blue">
                        AI Review of applicant:
                      </Text>
                      {reviewResponses[application.user.data._id]}
                    </div>
                  )}
              </div>
              <Button
                onClick={() => {
                  setOpened(true);
                  setApplication(application);
                }}
                variant="outline"
                color="blue"
                size="sm"
                disabled={
                  application.status == "rejected" ||
                  application.status == "hired"
                }
              >
                Update Application
              </Button>
            </Paper>
          ))
        )}
      </div>
    </>
  );
};

export default Applications;
