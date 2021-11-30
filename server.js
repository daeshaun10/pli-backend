const app = require('./app');

const PORT = process.env.PORT || 8001;

const server = app.listen(PORT, () => {
  console.log(`App started on ${PORT}`);
});

module.exports = server;
