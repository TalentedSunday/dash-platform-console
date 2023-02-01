import { Client } from 'dash';

// const Dash = require('dash');

// const { Mnemonic } = Dash.Core;
// const mnemnonic = new Mnemonic().toString();

const clientOpts = {
  network: 'local',
  wallet: {
    // mnemnoic: mnemnonic,
    mnemonic: 'manage hungry open friend ankle sight fury announce female ill ethics fox',
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 769, // only sync from early-2022
    },
  },
};
const client = new Client(clientOpts);

export async function generateUnusedAddress() {
  const account = await client.wallet.getAccount();
  const { address } = account.getUnusedAddress();
  console.log('Mnemnoic: ', clientOpts.wallet.mnemonic);
  console.log(`Unused external address: ${address}`);
}

export async function showBalance() {
  const account = await client.wallet.getAccount();
  const totalBalance = account.getTotalBalance();
  const confirmedBalance = account.getConfirmedBalance();
  const unconfirmedBalance = account.getUnconfirmedBalance();
  console.log(`Account balance:
    Confirmed: ${confirmedBalance}
    Unconfirmed: ${unconfirmedBalance}
    Total: ${totalBalance}
  `);
}

export function createIdentity() {
  const identity = client.platform.identities.register();
  return identity;
}

export function retrieveIdentity() {
  return client.platform.identities.get('an identity ID goes here');
}
