import { Client } from 'dash';


const client = new Client({
  dapiAddresses: [
    '127.0.0.1:3000:3010',
    '127.0.0.2:3000:3010',
  ],
});

async function connect() {
  // eslint-disable-next-line no-return-await
  return await client.getDAPIClient().core.getBestBlockHash();
}

connect()
  .then(d => console.log('Connected. Best block hash:\n', d))
  .catch(e => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect());
