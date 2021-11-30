const { Schema, model } = require('mongoose');

const AdminSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = new model('Admin', AdminSchema);
