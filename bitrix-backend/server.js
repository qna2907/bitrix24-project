const express = require("express");
const fs = require("fs");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ===== CONTACT =====
const CONTACT_FILE_PATH = path.join(__dirname, "token.json");

function loadContacts() {
  try {
    const data = fs.readFileSync(CONTACT_FILE_PATH);
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveContacts(contacts) {
  fs.writeFileSync(CONTACT_FILE_PATH, JSON.stringify(contacts, null, 2));
}

app.get("/api/contact", (req, res) => {
  const contacts = loadContacts();
  const { name } = req.query;

  if (name) {
    const keyword = name.toLowerCase();
    const filtered = contacts.filter((c) =>
      c.NAME?.toLowerCase().includes(keyword)
    );
    res.json(filtered);
  } else {
    res.json(contacts);
  }
});

app.post("/api/contact", (req, res) => {
  const contacts = loadContacts();
  const newContact = { ID: Date.now(), ...req.body };
  contacts.push(newContact);
  saveContacts(contacts);
  res.json(newContact);
});

app.put("/api/contact/:id", (req, res) => {
  let contacts = loadContacts();
  const id = parseInt(req.params.id);
  contacts = contacts.map((c) => (c.ID === id ? { ...c, ...req.body } : c));
  saveContacts(contacts);
  res.json({ success: true });
});

app.delete("/api/contact/:id", (req, res) => {
  let contacts = loadContacts();
  const id = parseInt(req.params.id);
  contacts = contacts.filter((c) => c.ID !== id);
  saveContacts(contacts);
  res.json({ success: true });
});

// ===== REQUISITES (Phần mở rộng cho Contact) =====
function getContactById(id) {
  const contacts = loadContacts();
  return contacts.find((c) => c.ID === id);
}

app.get("/api/contact/:contactId/requisites", (req, res) => {
  const contactId = parseInt(req.params.contactId);
  const contact = getContactById(contactId);
  if (!contact) return res.status(404).json({ error: "Contact not found" });
  res.json(contact.requisites || []);
});

app.get("/api/contact/:contactId/requisites/:reqId", (req, res) => {
  const contactId = parseInt(req.params.contactId);
  const reqId = parseInt(req.params.reqId);
  const contact = getContactById(contactId);
  if (!contact) return res.status(404).json({ error: "Contact not found" });
  const requisite = (contact.requisites || []).find((r) => r.id === reqId);
  if (!requisite) return res.status(404).json({ error: "Requisite not found" });
  res.json(requisite);
});

app.post("/api/contact/:contactId/requisites", (req, res) => {
  const contactId = parseInt(req.params.contactId);
  const contacts = loadContacts();
  const contactIndex = contacts.findIndex((c) => c.ID === contactId);
  if (contactIndex === -1)
    return res.status(404).json({ error: "Contact not found" });
  const newReq = { id: Date.now(), ...req.body };
  if (!contacts[contactIndex].requisites)
    contacts[contactIndex].requisites = [];
  contacts[contactIndex].requisites.push(newReq);
  saveContacts(contacts);
  res.json(newReq);
});

app.put("/api/contact/:contactId/requisites/:reqId", (req, res) => {
  const contactId = parseInt(req.params.contactId);
  const reqId = parseInt(req.params.reqId);
  const contacts = loadContacts();
  const contactIndex = contacts.findIndex((c) => c.ID === contactId);
  if (contactIndex === -1)
    return res.status(404).json({ error: "Contact not found" });
  const requisites = contacts[contactIndex].requisites || [];
  const reqIndex = requisites.findIndex((r) => r.id === reqId);
  if (reqIndex === -1)
    return res.status(404).json({ error: "Requisite not found" });
  requisites[reqIndex] = { ...requisites[reqIndex], ...req.body };
  contacts[contactIndex].requisites = requisites;
  saveContacts(contacts);
  res.json({ success: true });
});

app.delete("/api/contact/:contactId/requisites/:reqId", (req, res) => {
  const contactId = parseInt(req.params.contactId);
  const reqId = parseInt(req.params.reqId);
  const contacts = loadContacts();
  const contactIndex = contacts.findIndex((c) => c.ID === contactId);
  if (contactIndex === -1)
    return res.status(404).json({ error: "Contact not found" });
  let requisites = contacts[contactIndex].requisites || [];
  requisites = requisites.filter((r) => r.id !== reqId);
  contacts[contactIndex].requisites = requisites;
  saveContacts(contacts);
  res.json({ success: true });
});

// ===== BITRIX24 TOKEN =====
const BITRIX_TOKEN_PATH = path.join(__dirname, "bitrix_token.json");

function loadBitrixToken() {
  try {
    const data = fs.readFileSync(BITRIX_TOKEN_PATH);
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

function saveBitrixToken(tokenData) {
  fs.writeFileSync(BITRIX_TOKEN_PATH, JSON.stringify(tokenData, null, 2));
}

async function ensureValidToken() {
  const token = loadBitrixToken();
  if (!token) throw new Error("Chưa có token Bitrix");
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = token.created_at + token.expires_in;
  if (now < expiresAt - 60) {
    return token.access_token;
  }
  const refreshUrl = `https://${process.env.BITRIX_DOMAIN}/oauth/token/?grant_type=refresh_token&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&refresh_token=${token.refresh_token}`;
  const response = await axios.get(refreshUrl);
  const newToken = {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
    expires_in: response.data.expires_in,
    created_at: Math.floor(Date.now() / 1000),
  };
  saveBitrixToken(newToken);
  return newToken.access_token;
}

// ===== INSTALL APP =====
app.get("/install", async (req, res) => {
  const { code, domain } = req.query;
  if (!code || !domain)
    return res.status(400).send("Thiếu mã code hoặc domain");
  try {
    const url = `https://${domain}/oauth/token/?grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`;
    const response = await axios.get(url);
    const tokenData = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
      created_at: Math.floor(Date.now() / 1000),
    };
    saveBitrixToken(tokenData);
    res.send("Đã cài đặt ứng dụng và lưu token thành công!");
  } catch (err) {
    console.error("Lỗi khi nhận mã và lưu token:", err.message);
    res.status(500).send("Lỗi khi cài đặt ứng dụng");
  }
});

// ===== GỌI API BITRIX24 =====
app.get("/api/bitrix/user", async (req, res) => {
  try {
    const accessToken = await ensureValidToken();
    const result = await axios.get(
      `https://${process.env.BITRIX_DOMAIN}/rest/user.current.json?auth=${accessToken}`
    );
    res.json(result.data);
  } catch (err) {
    console.error("Lỗi gọi API Bitrix:", err.message);
    res.status(500).json({ error: "Lỗi gọi API Bitrix" });
  }
});

app.get("/auth/callback", async (req, res) => {
  const { code, domain } = req.query;
  if (!code || !domain)
    return res.status(400).send("Thiếu mã code hoặc domain");

  try {
    const url = `https://${domain}/oauth/token/?grant_type=authorization_code&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`;
    const response = await axios.get(url);

    const tokenData = {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
      created_at: Math.floor(Date.now() / 1000),
    };
    saveBitrixToken(tokenData);

    res.send("Đã cài đặt ứng dụng và lưu token thành công!");
  } catch (err) {
    console.error("Lỗi khi nhận mã và lưu token:", err.message);
    res.status(500).send("Lỗi khi cài đặt ứng dụng");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
