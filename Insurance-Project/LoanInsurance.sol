// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Insurance.sol"; // Import the Insurance contract from the same directory

contract LoanInsurance is Insurance {
    // Constructor to initialize the insurance contract
    constructor(address _insured, uint _premium, uint _coverageAmount) Insurance(_insured, _premium, _coverageAmount) {}

    // Function to allow the insured to claim the insurance
    function claimInsurance() public override {
        require(msg.sender == insured, "Only the insured can claim the insurance");
        require(isActive, "The insurance must be active");

        // Transfer the coverage amount to the insured
        address payable payableInsured = payable(insured);
        payableInsured.transfer(coverageAmount);
    }
}
