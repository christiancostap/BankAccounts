import accountsModel from '../models/accounts.js'

const accountsSetOne = async (req, res, next) => {
  try {
    const account = new accountsModel(req.body);
    await account.save();
    res.send(account);
  } catch (error) {
    res.status(500).send(error);
  }
}

const accountsGetAll = async (req, res, next) => {
  try {
    const accounts = await accountsModel.find();
    res.send(accounts);
  } catch (error) {
    res.status(500).send(error);
  }
}

const accountsUpdateOneById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const account = await accountsModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });
    res.send(account);
  } catch (error) {
    res.status(500).send(error);
  }
}

const accountsUpdateOneByAccount = async (req, res, next) => {
  try {
    const data = {
      agencia: req.body.agencia,
      conta: req.body.conta
    }
    const value = req.body.value
    const account = await accountsModel.findOneAndUpdate(data, { $inc: { 'balance': value } }, { new: true });
    if (!account) {
      res.status(404).send("Documento não encontrado no banco.");
    } else {
      res.status(200).send(account);
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

const getAccountBalance = async (req, res, next) => {
  try {
    const data = {
      agencia: req.body.agencia,
      conta: req.body.conta
    }
    const account = await accountsModel.findOne(data);
    if (!account) {
      res.status(404).send("Documento não encontrado no banco.");
    } else {
      res.status(200).send({
        saldo: account.balance
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

const transfer = async (req, res, next) => {
  try {
    const sourceAccount = {
      conta: req.body.sourceAccount,
    }
    const destinationAccount = {
      conta: req.body.destinationAccount
    }
    let value = req.body.transferValue

    const searchSource = await accountsModel.findOne(sourceAccount)
    if (!searchSource) {
      res.status(404).send({
        message: 'Conta de Origem não encontrada.'
      });
    }
    const searchDestination = await accountsModel.findOne(destinationAccount)
    if (!searchDestination) {
      res.status(404).send({
        message: 'Conta de Destino não encontrada.'
      });
    }
    const distinctAgencies = searchSource.agencia !== searchDestination.agencia;
    if (distinctAgencies) {
      value += 8;
    }
    console.log(value);
    const source = await accountsModel.findOneAndUpdate(sourceAccount, { $inc: { 'balance': -value } }, { new: true });
    const destination = await accountsModel.findOneAndUpdate(destinationAccount, { $inc: { 'balance': value } }, { new: true });
    res.status(200).send([
      { 'source': source },
      { 'destination': destination }
    ]);
  } catch (error) {
    res.status(500).send(error);
  }
}

const accountsDeleteOne = async (req, res, next) => {
  try {
    const data = {
      agencia: req.body.agencia,
      conta: req.body.conta
    }
    const deletedAccount = await accountsModel.findOneAndDelete(data);
    console.log(deletedAccount);
    const remainingAccountsCount = await accountsModel.find({ 'agencia': data.agencia });
    console.log(remainingAccountsCount);
    if (!deletedAccount) {
      res.status(404).send("Documento não encontrado no banco para deletar.");
    }
    res.status(200).send({ message: 'contas restantes na agência: ' + remainingAccountsCount.length });

  } catch (error) {
    res.status(500).send(error);
  }
}

const getAvgBalance = async (req, res, next) => {
  try {
    const agencia = req.body.agencia;
    const accounts = await accountsModel.find({ 'agencia': agencia });
    if (!accounts) {
      res.status(404).send('Não existem documentos para a agência buscada');
    }
    const balanceSum = accounts.reduce((acc, actualValue) => {
      return {
        balance: acc.balance + actualValue.balance
      }
    });
    const balanceAvg = balanceSum.balance / accounts.length
    res.send({
      message: 'Média de saldo das contas na agência ' + agencia + ': ' + balanceAvg,
      saldo: balanceAvg
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

const getSmallestBalanceAccounts = async (req, res, next) => {
  try {
    const clientsCount = req.body.qtdClientes
    const accounts = await accountsModel.aggregate([
      { $sort: { balance: 1 } },
      { $limit: clientsCount }
    ]);
    if (!accounts) {
      res.status(500).send('Retorno inesperado. Favor entrar em contato com o desenvolvedor.');
    }
    res.status(200).send(accounts)
  } catch (error) {
    res.status(500).send(error);
  }
}

const getBiggestBallanceAccounts = async (req, res, next) => {
  try {
    const clientsCount = req.body.qtdClientes;
    const accounts = await accountsModel.aggregate([
      { $sort: { balance: -1, name: 1 } },
      { $limit: clientsCount }
    ]);

    if (!accounts) {
      res.status(500).send('Retorno inesperado. Favor entrar em contato com o desenvolvedor.');
    }
    res.status(200).send(accounts)
  } catch (error) {
    res.status(500).send(error);
  }
}

const accountsToPrivate = async (req, res, next) => {
  try {
    const agencies = await accountsModel.distinct('agencia');

    const accountsToUpdate = await Promise.all(agencies.map(async (agency) => {
      let topAccount = await accountsModel.aggregate([
        { $match: { 'agencia': agency } },
        { $sort: { 'balance': -1 } },
        { $limit: 1 }
      ]);
      topAccount = topAccount[0];
      await accountsModel.findOneAndUpdate(topAccount, { 'agencia': 99 });
      return topAccount;
    }));
    res.send(accountsToUpdate);
  } catch (error) {
    res.status(500).send(error);
  }
}

export { accountsSetOne, accountsGetAll, accountsUpdateOneById, accountsUpdateOneByAccount, getAccountBalance, transfer, accountsDeleteOne, getAvgBalance, getSmallestBalanceAccounts, getBiggestBallanceAccounts, accountsToPrivate };