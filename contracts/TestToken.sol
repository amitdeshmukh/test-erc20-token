pragma solidity ^0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/ownership/Ownable.sol";

/**
 * @title TestToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the sender.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 */
contract TestToken is Initializable, ERC20, ERC20Detailed {
    // Track holdings
    mapping(address => uint256) public holdings;

    /**
     * @dev initialize and mint tokens to msg.sender
     */
    function initialize(address tokenOwner, string memory _name, string memory _symbol, uint supply, uint8 decimal) public initializer {
        // Initialize
        ERC20Detailed.initialize(_name, _symbol, decimal);

        // Mint to address of sender
        _mint(tokenOwner, supply * (10 ** uint256(decimals())));

        // Record holdings
        holdings[tokenOwner] = supply;
    }

    /**
    * return holdings for msg.sender
    */
    // function getUserHoldings(address tokenOwner) public view returns (uint256) {
    //     return holdings[tokenOwner];
    // }

}