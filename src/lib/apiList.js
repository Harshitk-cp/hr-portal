// export const server = `http://${window.location.hostname}:3005/api/v1`;
export const server = `http://localhost:8000/api/v1`;

const apiList = {
  login: `${server}/users/login`,
  signup: `${server}/users/signup`,
  getUserDetails: `${server}/users/`,
  getJobs: `${server}/jobs/`,
  getApplications: `${server}/jobs/`,
  getReview: `${server}/review/`,
  deleteJob: `${server}/jobs/`,
  updateJob: `${server}/jobs/`,
  updateApplication: `${server}/jobs/`,
  createJob: `${server}/jobs/`,
};

export default apiList;
