const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.pagar.me/core/v5/",
  headers: {
    Authorization:
      "Basic " + Buffer.from(`sk_test_MY6NAGzsWH6R01yD:`).toString("base64"),
    "Content-Type": "application/json",
  },
});

module.exports = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);

    return { error: false, data: response };
  } catch (err) {
    return {
      error: true,
      message: err.message,
      debug: JSON.stringify(err.response.data.errors[0]),
    };
  }
};
