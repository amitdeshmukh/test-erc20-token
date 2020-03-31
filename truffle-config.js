const path = require('path');
const { infuraPID, mnemonic } = require('./secrets.json')
const infuraProjectId = process.env.INFURA_PROJECT_ID || infuraPID;
const deployerAddress = process.env.DEPLOYER_ADDRESS || '0x23aC38f9B3EDEaFBDdEF8D6c0585E03F3D4f1aBF';
const { SuperHDWalletProvider, ManualSignProvider } = require('super-web3-provider');

// IMPORTANT: We need to globally store these providers here due to the fact that Truffle decides to call
// the provider() function multiple times during a deployment, therefore we would be re-creating
// a deployment on every call. 
let rinkebyProvider;
let rinkebyMetamaskProvider;
let mainnetProvider;

/**
 * PRO TIP: If you want to run all this inside your terminal to try things out, simply assign the variables 
 * here and good to go. We do recommend though to put all this as ENV variables when running in a CI, so
 * you never actually commit this values into your repository
 */

// Make sure to login into Superblocks, and create a new deployment space in a project. You can find 
// the deployment space id inside the space settings by clicking the gear icon next to the name
const superblocksProjectId = process.env.SUPERBLOCKS_PROJECT_ID;

// You need to create a new token in order to authenticate against the service. Login into the dashboard,
// select the project you want to deploy into, and in the project settings you will find a Project Token 
// section. 
const superblocksToken = process.env.SUPERBLOCKS_TOKEN;

// Simply your 12 seeds word associated with your wallet. This is used only for the SuperHDWallet provider
// so you can sign the txs client side, but still keep track fo the deployment within Superblocks.
const mnemonic = process.env.MNEMONIC;

module.exports = {
  plugins: ['truffle-security'],

  // Compiler version
  compilers: {
    solc: {
      version: '0.5.17'
    }
  },

  // See <http://truffleframework.com/docs/advanced/configuration> to customize Truffle configuration
  contracts_build_directory: path.join(__dirname, 'build/contracts'),
  networks: {
    develop: {
      port: 8545
    },

    // Check note below regarding provider before using
    rinkeby: {
      provider: () => {
        // Let's not double create the provider (as we will create many deployments) as Truffle calls this function many times (◔_◔)
        if (!rinkebyProvider) {
          rinkebyProvider = new SuperHDWalletProvider({
            superblocksProjectId,
            superblocksToken,
            mnemonic,
            networkId: '4',
            // NOTE: `provider` here should probably be `endpoint` ?
            provider: `https://rinkeby.infura.io/v3/${infuraProjectId}`
          });
        }
        return rinkebyProvider;
      },
      network_id: '4'
    },

    rinkeby_metamask: {
      provider: () => {
        // Let's not double create the provider (as we will create many deployments) as Truffle calls this function many times (◔_◔)
        if (!rinkebyMetamaskProvider) {
          rinkebyMetamaskProvider = new ManualSignProvider({ 
            superblocksProjectId,
            superblocksToken,
            from: deployerAddress,
            endpoint: `https://rinkeby.infura.io/v3/${infuraProjectId}`,
            networkId: '4',
          })
        }
        return rinkebyMetamaskProvider;
      },
      network_id: '4'
    },

    mainnet: {
      provider: () => {
        // Let's not double create the provider (as we will create many deployments) as Truffle calls this function many times (◔_◔)
        if (!mainnetProvider) {
          mainnetProvider = new ManualSignProvider({ 
            superblocksProjectId,
            superblocksToken,
            from: deployerAddress, 
            endpoint: `https://rinkeby.infura.io/v3/${infuraProjectId}`,
            networkId: '1',
          })
        }
        return mainnetProvider;
      },
      network_id: '1'
    }
  }
};