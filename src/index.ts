import express from 'express';
import dotenv from 'dotenv';
import { getAllMessage } from './services/fetchData.js';
import mongoose from 'mongoose';

dotenv.config()

const app = express();
    app.use((req:any, res:any, next:any) => {
      const authHeader = req.headers.authorization;
      const user = req.query.User;
      if (authHeader) {
        // Example for Bearer Token
        const token = authHeader.split(' ')[1]; // Extracts the token after "Bearer"
        req.token =token;
        req.user =user;
      }
      next();
    });

const connectDB = async()=>{
try{
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
  console.log("connected to db");
}
catch(e){
  console.log("unable to connect")
}
}
connectDB();
app.get('/messages',async (req,res)=>{
  try{
    console.log("ImapService init -> user:", req.user, "accessToken:", req.token?.slice(0,20));
    const imapService = getAllMessage(req.token,req.user);
    const messages = await imapService.fetchIndex();
    return res.json(messages);
  }catch(e){
    console.log(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {

  res.json("hi hello");
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
