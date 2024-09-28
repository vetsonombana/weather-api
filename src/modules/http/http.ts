import axios from "axios";

const WeatherClient = axios.create({
  baseURL: process.env.API_BASE_URL,
});

WeatherClient.interceptors.request.use((request) => {
  request.params = {
    ...request.params,
    key: process.env.API_KEY,
  };
  return request;
});

export { WeatherClient };
