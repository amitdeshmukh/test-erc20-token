const Web3 = require('web3');
const { setupLoader } = require('@openzeppelin/contract-loader');
const { SuperHDWalletProvider, ManualSignProvider } = require('super-web3-provider');
const { infuraPID, mnemonic } = require('../secrets.json');
const token = require('./tokenConfig');

const infuraProjectId = process.env.INFURA_PROJECT_ID || infuraPID;
const superblocksProjectId = process.env.SUPERBLOCKS_PROJECT_ID;
const superblocksToken = process.env.SUPERBLOCKS_TOKEN;
const deployerAddress = process.env.DEPLOYER_ADDRESS;

const owner = process.env.TOKEN_OWNER || token.owner;
const name = process.env.TOKEN_NAME || token.name
const symbol = process.env.TOKEN_SYMBOL || token.symbol
const supply = process.env.TOKEN_SUPPLY || token.supply
const decimals = process.env.TOKEN_DECIMALS || token.decimals

async function main(network) {
  let provider;
  if (process.env.PROVIDER_URL) {
    provider = process.env.PROVIDER_URL 
  } 
  
  else if (network === 'rinkeby_metamask') {
      provider = new ManualSignProvider({
      projectId: superblocksProjectId,
      token: superblocksToken,
      networkId: '4',      
      endpoint: `https://rinkeby.infura.io/v3/${infuraProjectId}`,
      from: deployerAddress,
      metadata: {},
    });
  } 
  
  else {
    provider = new SuperHDWalletProvider({
      projectId: superblocksProjectId,
      token: superblocksToken,
      mnemonic: mnemonic,
      networkId: '4',
      endpoint: `https://rinkeby.infura.io/v3/${infuraProjectId}`,
      metadata: {},
    });
  }

  const web3 = new Web3(provider);
  const loader = setupLoader({ provider: web3 }).web3;

  // Load TestToken from Artifacts
  const TestToken = loader.fromArtifact('TestToken');

  // Retrieve accounts from the local node, we will use the first one to send the transaction
  const accounts = await web3.eth.getAccounts();

  // Deploy contract
  const estimateGas = await TestToken.deploy().estimateGas();
  const gasPrice = await web3.eth.getGasPrice();

  console.log('\nDeploying contract...');
  const TestTokenInstance = await TestToken.deploy()
    .send({ from: accounts[0], gas: estimateGas, gasPrice });

  // Initialize TestToken contract
  console.log('\nInitializing contract...');
  await TestTokenInstance.methods.initialize(owner, name, symbol, supply, decimals)
    .send({ from: accounts[0], gas: 50000, gasPrice: 1e6 });

  // Call the value() function of the deployed Counter contract
  const value = await counterInstance.methods.value().call();
  console.log(value);

  process.exit();
}

if (require.main === module) {
  const network = process.argv[2];
  main(network);
}