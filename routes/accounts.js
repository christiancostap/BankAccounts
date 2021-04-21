import express from 'express';
import { accountsSetOne, accountsGetAll, accountsUpdateOneById, accountsUpdateOneByAccount, accountsDeleteOne, getAccountBalance, transfer, getAvgBalance, getSmallestBalanceAccounts, getBiggestBallanceAccounts, accountsToPrivate } from '../controllers/accounts.js';

const app = express();

app.post('/', accountsSetOne);
app.get('/', accountsGetAll);
app.get('/getAccountBalance', getAccountBalance);
app.get('/getAvgBalance', getAvgBalance);
app.get('/getSmallestBalanceAccounts', getSmallestBalanceAccounts);
app.get('/getBiggestBallanceAccounts', getBiggestBallanceAccounts)
app.patch('/byId/id', accountsUpdateOneById);
app.patch('/', accountsUpdateOneByAccount);
app.patch('/transfer', transfer);
app.patch('/accountsToPrivate', accountsToPrivate)
app.delete('/accountsDeleteOne', accountsDeleteOne);


export { app as accountsRouter };