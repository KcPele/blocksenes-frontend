//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/YourContract.sol";
import "./DeployHelpers.s.sol";
import "../contracts/OracleDataReader.sol";

contract DeployYourContract is ScaffoldETHDeploy {
    // use `deployer` from `ScaffoldETHDeploy`
    function run() external ScaffoldEthDeployerRunner {
        // YourContract yourContract = new YourContract(deployer);
        // console.logString(
        //     string.concat(
        //         "YourContract deployed at: ",
        //         vm.toString(address(yourContract))
        //     )
        // );

        // Use the UpgradeableProxy address from your local blockchain
        address proxyAddress = 0xc04b335A75C5Fa14246152178f6834E3eBc2DC7C;
        OracleDataReader oracleReader = new OracleDataReader(proxyAddress);

        console.log(
            "OracleDataReader deployed at:",
            vm.toString(address(oracleReader))
        );
    }
}
