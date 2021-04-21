import express from 'express';
import mongoose from 'mongoose';
import { accountsRouter } from './routes/accounts.js';
import dotenv from 'dotenv';

dotenv.config();

//Db connection through mongoose
mongoose.connect(
  `mongodb+srv://${process.env.USERDB}:${process.env.PWDDB}@cluster0.przra.mongodb.net/trabalhoPratico?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
).catch((err) => console.log('Erro ao tentar conectar: ' + err));


const app = express();
app.use(express.json());
app.use('/accounts', accountsRouter)


app.listen(process.env.PORT, () => console.log('API iniciada'))