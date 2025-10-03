import express from 'express';
import dotenv from 'dotenv';
import { getAllMessage } from './services/fetchData.js';

dotenv.config()

const app = express();
    app.use((req:any, res:any, next:any) => {
      const authHeader = req.headers.authorization;
      const {user} = req.query;
      if (authHeader) {
        // Example for Bearer Token
        const token = authHeader.split(' ')[1]; // Extracts the token after "Bearer"
        req.token =token;
        req.user =user;
      }
      next();
    });

app.get('/messages',async (req,res)=>{
  const imapService = getAllMessage(req.token,req.user);
  const messages = await imapService.fetchIndex();
  return res.json(messages)});

app.get('/test', (req, res) => {
  console.log(req.oidc);
  res.json(req.oidc.user);
});
app.get('/profile', (req, res) => {
  res.json(req.oidc.user);
});
app.get('/callback', (req, res) => {
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
});
