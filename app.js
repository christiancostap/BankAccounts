import express from 'express';
import mongoose from 'mongoose';
import { accountsRouter } from './routes/accounts.js';

//Db connection through mongoose
mongoose.connect(
  '<Rota para conexão>',
  { useNewUrlParser: true, useUnifiedTopology: true }
).catch((err) => console.log('Erro ao tentar conectar: ' + err));


const app = express();
app.use(express.json());
app.use('/accounts', accountsRouter)


app.listen(3000, () => console.log('API iniciada'))