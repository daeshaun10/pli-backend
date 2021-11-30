const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  contactNo: Number,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  cardDetails: {
    type: String,
    required: true,
  },
  notifications: [
    {
      message: String,
      viewed: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = new model('User', userSchema);
