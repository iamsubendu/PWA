import axios from "axios";

const URL = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "0f083c9ca49ea5a30aced50d9a174c06";

export const fetchWeather = async (query) => {
  const { data } = await axios.get(URL, {
    params: {
      q: query,
      units: "metric",
      APPID: apiKey,
    },
  });
  return data;
};
