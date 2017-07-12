module.exports = () => {
  const env = process.env;
  return config = {
    PORT: env.PORT || 3003,
    DB: env.DB || 'mongodb://localhost/foobot-users',
    
    DB_CONNECTION_ATTEMPTS: 10,
    DB_CONNECTION_RETRY_INTERVAL: 3000,
  }
};

