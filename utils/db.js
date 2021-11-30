const mongoose = require('mongoose');

exports.connect = (url) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(url)
      .then(() => {
        resolve();
      })
      .catch((err) => reject(err));
  });
};

exports.close = () => {
  return mongoose.disconnect();
};
