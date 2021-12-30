const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const PORT = process.env.PORT || 5000;

// TODO: Add connection to MongoDB

const server = app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');;
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  })
});