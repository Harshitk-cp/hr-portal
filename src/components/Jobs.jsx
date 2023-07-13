import { useState, useEffect } from "react";

import axios from "axios";

import apiList from "../lib/apiList";
import {
  Avatar,
  Button,
  Modal,
  Paper,
  Text,
  TextInput,
  createStyles,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
  jobItem: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    borderRadius: theme.radius.md,
  },
  companyLogo: {
    width: "theme.spacing(8)",
    height: "theme.spacing(8)",
    marginRight: theme.spacing.md,
  },
  jobDetails: {
    flex: 1,
    marginRight: "theme.spacing.md",
  },
  jobTitle: {
    marginBottom: "theme.spacing.xs",
    fontWeight: 500,
  },
  jobLocation: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[6],
  },
  applyButton: {
    marginLeft: "auto",
  },
  deleteButton: {
    marginRight: "10px",
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
}));

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [jobDesc, setJobDesc] = useState(null);
  const [jobEmail, setJobEmail] = useState(null);
  const [jobTags, setJobTags] = useState(null);
  const [jobAddress, setJobAddress] = useState(null);
  const [jobSalaryRange, setJobSalaryRange] = useState(null);
  const [jobPositions, setJobPositions] = useState(null);
  const [jobEdu, setJobEdu] = useState(null);
  const [jobExp, setJobExp] = useState(null);
  const [jobRounds, setJobRounds] = useState(null);
  const [jobType, setJobType] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let url = apiList.getJobs;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setJobs(response.data.data);
      })
      .catch((err) => {
        notifications.show({
          title: "error",
          message: err.response.data.message,
        });
      });
  };

  const deleteJob = (jobId) => {
    let url = `${apiList.deleteJob}/${jobId}`;
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
        notifications.show({
          title: "Success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        console.log(err);
        notifications.show({
          title: "error",
          message: err.response.data.message,
        });
      });
  };

  const updateJob = () => {
    console.log(jobId);
    let url = `${apiList.updateJob}/${jobId}`;
    axios
      .put(
        url,
        {
          jobId: jobId,
          title: jobTitle,
          description: jobDesc,
          email: jobEmail,
          tags: jobTags,
          address: jobAddress,
          salaryRange: jobSalaryRange,
          noOfPositions: jobPositions,
          education: jobEdu,
          experience: jobExp,
          noOfRounds: jobRounds,
          jobType: jobType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        notifications.show({
          title: "Success",
          message: response.data.message,
        });
        getData();
      })
      .catch((err) => {
        console.log(err);
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
        onClose={() => setOpened(false)}
        title="Update Job"
        centered
      >
        <div style={{ padding: 16 }}>
          <TextInput
            label="Job Title"
            value={jobTitle}
            onChange={(event) => setJobTitle(event.currentTarget.value)}
          />
          <TextInput
            label="Job Description"
            multiline
            rows={4}
            value={jobDesc}
            onChange={(event) => setJobDesc(event.currentTarget.value)}
          />
          <TextInput
            label="Email"
            value={jobEmail}
            onChange={(event) => setJobEmail(event.currentTarget.value)}
          />
          <TextInput
            label="Tags"
            value={jobTags}
            onChange={(event) => setJobTags(event.currentTarget.value)}
          />
          <TextInput
            label="Address"
            value={jobAddress}
            onChange={(event) => setJobAddress(event.currentTarget.value)}
          />
          <TextInput
            label="Salary Range"
            value={jobSalaryRange}
            onChange={(event) => setJobSalaryRange(event.currentTarget.value)}
          />
          <TextInput
            label="No of Positions"
            value={jobPositions}
            onChange={(event) => setJobPositions(event.currentTarget.value)}
          />
          <TextInput
            label="Education"
            value={jobEdu}
            onChange={(event) => setJobEdu(event.currentTarget.value)}
          />
          <TextInput
            label="Experience"
            value={jobExp}
            onChange={(event) => setJobExp(event.currentTarget.value)}
          />
          <TextInput
            label="No of Rounds"
            value={jobRounds}
            onChange={(event) => setJobRounds(event.currentTarget.value)}
          />
          <TextInput
            label="Job Type"
            value={jobType}
            onChange={(event) => setJobType(event.currentTarget.value)}
          />
          <div style={{ marginTop: 20 }}>
            <Button variant="outline" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <span style={{ marginLeft: 20 }}>
              <Button
                variant="filled"
                color="blue"
                onClick={() => {
                  if (
                    !jobTitle ||
                    !jobDesc ||
                    !jobEmail ||
                    !jobTags ||
                    !jobAddress ||
                    !jobSalaryRange ||
                    !jobPositions ||
                    !jobEdu ||
                    !jobExp ||
                    !jobRounds ||
                    !jobType
                  ) {
                    return;
                  }

                  setOpened(false);
                  updateJob();
                }}
                disabled={
                  !jobTitle ||
                  !jobDesc ||
                  !jobEmail ||
                  !jobTags ||
                  !jobAddress ||
                  !jobSalaryRange ||
                  !jobPositions ||
                  !jobEdu ||
                  !jobExp ||
                  !jobRounds ||
                  !jobType
                }
              >
                Save Changes
              </Button>
            </span>
          </div>
        </div>
      </Modal>

      <div>
        {jobs.length === 0 ? (
          <Paper className={classes.noJobsMessage}>
            <Text>No Jobs found</Text>
          </Paper>
        ) : (
          jobs.map((job) => (
            <Paper key={job._id} className={classes.jobItem}>
              <Avatar
                src={
                  "https://static.vecteezy.com/system/resources/previews/008/214/517/original/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg"
                }
                alt={
                  "https://static.vecteezy.com/system/resources/previews/008/214/517/original/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg"
                }
                className={classes.companyLogo}
              />
              <div className={classes.jobDetails}>
                <Text className={classes.jobTitle} size="lg" weight={500}>
                  {job.title}
                </Text>
                <Text className={classes.jobLocation}>{job.address}</Text>
                <Text>{job.description}</Text>
                <div className={classes.jobInfo}>
                  <Text>Job Type: {job.jobType}</Text>
                  <Text>Education: {job.education}</Text>
                  <Text>Experience: {job.experience}</Text>
                  <Text>No. of Positions: {job.noOfPositions}</Text>
                  <Text>Salary Range: ₹{job.salaryRange}</Text>
                </div>
              </div>
              <div className={classes.jobButtons}>
                <Button
                  className={classes.deleteButton}
                  variant="outline"
                  color="red"
                  onClick={() => deleteJob(job._id)}
                >
                  Delete
                </Button>
                <Button
                  className={classes.updateButton}
                  variant="outline"
                  onClick={() => {
                    setJobId(job._id);
                    setJobTitle(job.title);
                    setJobDesc(job.description);
                    setJobEmail(job.email);
                    setJobTags(job.tags);
                    setJobAddress(job.address);
                    setJobSalaryRange(job.salaryRange);
                    setJobPositions(job.noOfPositions);
                    setJobEdu(job.education);
                    setJobExp(job.experience);
                    setJobRounds(job.noOfRounds);
                    setJobType(job.jobType);
                    setOpened(true);
                  }}
                >
                  Update
                </Button>
              </div>
            </Paper>
          ))
        )}
      </div>
    </>
  );
};

export default Jobs;
