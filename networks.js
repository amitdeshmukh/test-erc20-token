const { infuraPID, mnemonic } = require('./secrets.json')
const infuraProjectId = process.env.INFURA_PROJECT_ID || infuraPID;
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  networks: {
    development: {
      protocol: 'http',
      host: 'localhost',
      port: 8545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: '*',
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraProjectId}`),
      networkId: 4,
      gasPrice: 10e9
    }
  },
};
