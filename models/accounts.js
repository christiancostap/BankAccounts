import mongoose from "mongoose";

const accountsSchema = new mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
    validate(agencia) {
      if (agencia < 0) {
        throw new Error("Não é possível gerar valor negativo para agência")
      }
    }
  },
  conta: {
    type: Number,
    required: true,
    min: 1
  },
  name: {
    type: String,
    required: true,
    validate(name) {
      if (name === '') {
        throw new Error("Não é possível gerar nome vazio");
      }
    }
  },
  balance: {
    type: Number,
    required: true,
    min: 0
  },
  lastModified: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model('accounts', accountsSchema);

const accountsModel = mongoose.model('accounts');

export default accountsModel;