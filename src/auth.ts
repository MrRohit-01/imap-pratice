import express from 'express';
import pkg from 'express-openid-connect';
import dotenv from 'dotenv';

dotenv.config();

const { auth, requiresAuth } = pkg;

const app = express();
// console.log(process.env);
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.use(auth(config));

app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in ✅' : 'Logged out ❌');
});

app.get('/test', (req, res) => {
  console.log(req.oidc);
  res.json(req.oidc.user);
});
app.get('/profile', requiresAuth(), (req, res) => {
  res.json(req.oidc.user);
});
app.get('/callback', requiresAuth(), (req, res) => {
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
});
