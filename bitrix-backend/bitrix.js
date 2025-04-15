const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const TOKEN_FILE = "./token.json";

function loadToken() {
  return JSON.parse(fs.readFileSync(TOKEN_FILE));
}

function saveToken(data) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(data, null, 2));
}

async function refreshToken() {
  const tokenData = loadToken();
  const response = await axios.get("https://oauth.bitrix.info/oauth/token/", {
    params: {
      grant_type: "refresh_token",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: tokenData.refresh_token,
    },
  });
  saveToken(response.data);
  return response.data.access_token;
}

async function callBitrixAPI(method, params = {}) {
  let { access_token } = loadToken();
  const url = `https://${process.env.BITRIX_DOMAIN}/rest/${method}`;

  try {
    const response = await axios.post(url, { ...params, auth: access_token });
    return response.data;
  } catch (error) {
    if (error.response?.data?.error === "expired_token") {
      access_token = await refreshToken();
      const retry = await axios.post(url, { ...params, auth: access_token });
      return retry.data;
    }
    throw error;
  }
}

module.exports = { callBitrixAPI, refreshToken, saveToken };
