// Load dependencies
const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

// Load compiled artifacts
const TestToken = contract.fromArtifact('TestToken');

// Start test block
describe('TestToken', function () {
  const [ owner ] = accounts;

  beforeEach(async function () {
    // Deploy a new TestToken contract for each test
    this.contract = await TestToken.new({ from: owner });
  });

  // Test case
  it('initializes the token symbol', async function () {
    // Store a value - recall that only the owner account can do this!
    await this.contract.initialize('TestToken', 'TST', 1000, { from: owner });

    // Note that we need to use strings to compare the 256 bit integers
    expect((await this.contract.symbol()).toString()).to.equal('TST');
  });
});