import { useState, useEffect, useContext } from "react";

import axios from "axios";

import apiList from "../lib/apiList";
import {
  Avatar,
  Button,
  Modal,
  Paper,
  Tabs,
  Text,
  TextInput,
  createStyles,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
}));

const Jobs = (props) => {
  const [jobs, setJobs] = useState([]);
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);

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

  return (
    <>
      <div>
        {jobs.map((job) => (
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
                <Text>Salary Range: ${job.salaryRange}</Text>
              </div>
            </div>
            <div className={classes.jobButtons}>
              <Button
                className={classes.deleteButton}
                variant="outline"
                onClick={() => deleteJob(job._id)}
              >
                Delete
              </Button>
              <Button
                className={classes.updateButton}
                variant="outline"
                onClick={open}
              >
                Update
              </Button>
            </div>
          </Paper>
        ))}
      </div>
      <Modal opened={opened} onClose={close} title="Update Job" centered>
        <Tabs>
          <Text>Hello</Text>
          <TextInput color="white" placeholder="helo"></TextInput>
        </Tabs>
      </Modal>
    </>
  );
};

export default Jobs;
