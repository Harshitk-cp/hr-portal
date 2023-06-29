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
}));

const Home = (props) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { classes } = useStyles();
  const [applications, setApplications] = useState([]);
  const [loggedin, setLoggedin] = useState(isAuth());

  useEffect(() => {
    getJobs();
    getApplications();
  }, []);

  const getJobs = () => {
    let url = apiList.getJobs;
    console.log(localStorage.getItem("token"));
    console.log(localStorage.getItem("userId"));
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setJobs(response.data.data);
        setLoading(false);
        console.log(response);
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
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Calculate the count of selected, rejected, and ongoing applications for all jobs
  const calculateApplicationStatus = () => {
    const counts = {
      selected: 0,
      rejected: 0,
      ongoing: 0,
      applied: 0,
    };

    applications.forEach((application) => {
      if (application.status === "Selected") {
        counts.selected++;
      } else if (application.status === "Rejected") {
        counts.rejected++;
      } else if (application.status === "Ongoing") {
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
              value: (applicationStatus.selected / totalApplications) * 100,
              color: "green",
              tooltip: `Selected: ${applicationStatus.selected}`,
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
        {jobs.map((job) => (
          <Paper key={job._id} className={classes.jobItem}>
            {/* Display job information here */}
            <Text variant="h4">{job.title}</Text>
            <Text>{job.description}</Text>
          </Paper>
        ))}
      </div>

      <div className={classes.section}>
        <Text variant="h3" className={classes.heading}>
          Applications
        </Text>
        {applications.map((application) => (
          <Paper key={application._id} className={classes.applicationItem}>
            {/* Display application information here */}
            <Text variant="h4">Application ID: {application._id}</Text>
            <Text>Status: {application.status}</Text>
          </Paper>
        ))}
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default Home;
