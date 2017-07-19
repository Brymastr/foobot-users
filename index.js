const
  Koa = require('koa'),
  app = new Koa(),
  bodyParser = require('koa-bodyparser'),
  mongoose = require('mongoose'),
  config = require('./config')();

mongoose.Promise = Promise;

main();

async function main() {
  app.use(bodyParser());
  app.use(require('./routes'));

  await connect(dbConnect, config.DB_CONNECTION_ATTEMPTS, config.DB_CONNECTION_RETRY_INTERVAL);

  app.listen(config.PORT);

  console.log('users service ready');
}

function dbConnect() {
  console.log('attempting db connection');
  mongoose.connect(config.DB, {useMongoClient: true});
  console.log('db connection successful');
}

function connect(func, attempts, interval) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await func());
    } catch(err) {
      // console.error(err)
      if(attempts === 1) {
        reject(new Error('Max connection attempts reached'));
        return;
      }
      setTimeout(async () => {
        resolve(await connect(func, --attempts, interval));
      }, interval);
    }
  });
}