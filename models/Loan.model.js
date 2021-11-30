const { Schema, model } = require('mongoose');

const loanSchema = new Schema({
  approved: {
    type: Boolean,
    default: false,
  },
  rejected: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  amount: {
    type: Number,
    required: true,
  },
  installment: {
    type: Number,
    required: true,
  },
  noInstallments: {
    type: Number,
    required: true,
  },
  paid: {
    type: Number,
    default: 0,
  },
  dueDate: {
    type: String,
    required: true,
  },
  finished: {
    type: Boolean,
    default: false,
  },
});

module.exports = new model('Loan', loanSchema);
