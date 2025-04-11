import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let refreshTimeout;
const scheduleRefreshToken = (maxAge) => {
  clearTimeout(refreshTimeout);
  refreshTimeout = setTimeout(async () => {
    try {
      await axiosInstance.get("/api/auth/refresh-token");
    } catch (error) {
      console.log(error);
    }
  }, maxAge - 5000);
};

axiosInstance.interceptors.response.use(
  (response) => {
    const maxAgeAccessToken = 16 * 60 * 60 * 1000;
    scheduleRefreshToken(maxAgeAccessToken);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axiosInstance.get("/api/auth/refresh-token");

        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Error refresh token:", err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
