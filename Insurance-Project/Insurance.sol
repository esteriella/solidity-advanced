// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title Insurance
 * @dev An abstract contract defining the basic structure of an insurance policy.
 */
abstract contract Insurance {
    address public insurer;        // Address of the insurer (the one who created the contract)
    address public insured;        // Address of the insured (the person being covered)
    uint public premium;           // Premium amount paid by the insured
    uint public coverageAmount;    // The coverage amount in case of a claim
    bool public isActive;          // Indicates if the insurance policy is active

    /**
     * @dev Constructor function to set up the insurance policy.
     * @param _insured Address of the insured.
     * @param _premium Premium amount to be paid.
     * @param _coverageAmount Coverage amount for potential claims.
     */
    constructor(address _insured, uint _premium, uint _coverageAmount) {
        insurer = msg.sender;        // The creator of the contract is the insurer
        insured = _insured;          // Set the insured's address
        premium = _premium;          // Set the premium amount
        coverageAmount = _coverageAmount;  // Set the coverage amount
        isActive = true;             // The policy is initially active
    }

    /**
     * @dev Allows the insured to pay the premium for the insurance policy.
     * The premium amount must be sent along with the transaction.
     */
    function payPremium() public payable {
        require(msg.sender == insured, "Only the insured can pay the premium");
        require(msg.value == premium, "Must pay the exact premium amount");
    }

    /**
     * @dev Abstract function to be implemented in derived contracts.
     * Used for the insured to claim insurance in case of a covered event.
     */
    function claimInsurance() public virtual;
}
