pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract BurnableToken is Initializable, ERC20Burnable, ERC20Detailed {

    function initialize(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply
    ) 
        public 
        initializer
    {
        super.initialize(name, symbol, decimals);
        _mint(msg.sender, initialSupply);
    }
}
