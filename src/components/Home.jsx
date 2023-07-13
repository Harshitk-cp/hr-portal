import { useState, useEffect } from "react";
import axios from "axios";
import { RingProgress, Text, Loader, Paper, createStyles } from "@mantine/core";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";
import { Navigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  section: {
    marginBottom: theme.spacing.md,
  },
  heading: {
    marginBottom: theme.spacing.xs,
  },
  jobItem: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    borderRadius: theme.radius.md,
  },
  applicationItem: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    borderRadius: theme.radius.md,
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

const Home = (props) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { classes } = useStyles();
  const [applications, setApplications] = useState([]);
  const [loggedin] = useState(isAuth());

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    props.funcNav(true);
    getJobs();
    getApplications();
  }, []);

  const getJobs = () => {
    let url = apiList.getJobs;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setJobs(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const getApplications = () => {
    let url = `${apiList.getApplications}/${localStorage.getItem(
      "userId"
    )}/hrApplications`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setApplications(response.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Calculate the count of hired, rejected, and ongoing applications for all jobs
  const calculateApplicationStatus = () => {
    const counts = {
      hired: 0,
      rejected: 0,
      ongoing: 0,
      applied: 0,
    };

    applications.forEach((application) => {
      if (application.status === "hired") {
        counts.hired++;
      } else if (application.status === "rejected") {
        counts.rejected++;
      } else if (application.status === "ongoing") {
        counts.ongoing++;
      } else if (application.status === "Applied") {
        counts.applied++;
      }
    });

    return counts;
  };

  // Calculate the total number of applications for all jobs
  const calculateTotalApplications = () => {
    return applications.length;
  };

  if (loading) {
    return <Loader />;
  }

  const applicationStatus = calculateApplicationStatus();
  const totalApplications = calculateTotalApplications();

  return loggedin ? (
    <div>
      <div>
        <Text>Total Applications: {totalApplications}</Text>
        <RingProgress
          label={
            <Text size="s" align="center">
              Application Distribution
            </Text>
          }
          size={300}
          thickness={25}
          sections={[
            {
              value: (applicationStatus.ongoing / totalApplications) * 100,
              color: "yellow",
              tooltip: `Ongoing: ${applicationStatus.ongoing}`,
            },
            {
              value: (applicationStatus.hired / totalApplications) * 100,
              color: "green",
              tooltip: `Hired: ${applicationStatus.hired}`,
            },
            {
              value: (applicationStatus.rejected / totalApplications) * 100,
              color: "red",
              tooltip: `Rejected: ${applicationStatus.rejected}`,
            },
            {
              value: (applicationStatus.applied / totalApplications) * 100,
              color: "blue",
              tooltip: `Applied: ${applicationStatus.applied}`,
            },
          ]}
        />
      </div>

      <div className={classes.section}>
        <Text variant="h3" className={classes.heading}>
          Jobs
        </Text>
        {jobs.length === 0 ? (
          <Paper className={classes.noJobsMessage}>
            <Text>No Jobs found</Text>
          </Paper>
        ) : (
          jobs.map((job) => (
            <Paper key={job._id} className={classes.jobItem}>
              <Text variant="h4">Title: {job.title}</Text>
              <Text>Description: {job.description}</Text>
              <Text>Total Applicants: {job.applicants.length}</Text>
            </Paper>
          ))
        )}
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default Home;
