pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract CarServiceContract{
    uint serviceCount = 0;
    address public owner;

    struct Service{
        uint id;
        string vin;
        string fileHash;
    }

    mapping(uint => Service) public services;

    constructor () public {
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Access denied");
        _;
    }

    function addService(string memory _vin, string memory _hash) public onlyOwner {
        services[serviceCount] = Service(serviceCount, _vin, _hash);
        serviceCount++;
    }

    function getServices(string memory _vin) public view returns(string[] memory){
        string[] memory temp = new string[](serviceCount);
        uint counter = 0;

        for(uint i =0; i < serviceCount; i++){
            if( keccak256(bytes(services[i].vin)) == keccak256(bytes(_vin)) ){
                temp[counter] = services[i].fileHash;
                counter++;
            }
        }

        string[] memory result = new string[](counter);
        for (uint j = 0; j < counter; j++){
            result[j] = temp[j];
        }

        return result;
    }
}