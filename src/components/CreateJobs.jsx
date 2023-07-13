import { useState, useEffect } from "react";

import axios from "axios";

import apiList from "../lib/apiList";
import { Button, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";

const CreateJobs = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobEmail, setJobEmail] = useState("");
  const [jobTags, setJobTags] = useState("");
  const [jobAddress, setJobAddress] = useState("");
  const [jobSalaryRange, setJobSalaryRange] = useState("");
  const [jobPositions, setJobPositions] = useState("");
  const [jobEdu, setJobEdu] = useState("");
  const [jobExp, setJobExp] = useState("");
  const [jobRounds, setJobRounds] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {}, []);

  const clearFields = () => {
    setJobTitle("");
    setJobDesc("");
    setJobEmail("");
    setJobTags("");
    setJobAddress("");
    setJobSalaryRange("");
    setJobPositions("");
    setJobEdu("");
    setJobExp("");
    setJobRounds("");
    setJobType("");
  };

  const createJob = () => {
    let url = apiList.createJob;
    axios
      .post(
        url,
        {
          userId: localStorage.getItem("userId"),
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
        clearFields();
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

              createJob();
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
            Create Job
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateJobs;
