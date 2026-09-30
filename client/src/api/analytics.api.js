import api from "./client";

export const getAnalytics = async () => {
  const response = await api.get("/analytics");
  return response.data;
};

export const getAnalyticsTrends = async () => {
  const response = await api.get("/analytics/trends");
  return response.data;
};
