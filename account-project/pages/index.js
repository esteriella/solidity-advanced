import { useState, useEffect } from "react";
import styles from '../styles/style.module.css';
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { acctFactoryAddress } from "../contractAddress";
import SimpleAccountFactory from "../artifacts/contracts/samples/SimpleAccountFactory.sol/SimpleAccountFactory.json";

export default function HomePage() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);
  const [address, setAddress] = useState(null);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    // Create a Web3Modal instance
    const web3Modal = new Web3Modal();

    // Connect to the user's Ethereum provider
    web3Modal.connect().then(async (provider) => {
      // Create an ethers.js provider using the Web3 provider
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      setProvider(ethersProvider);
      const signer = await ethersProvider.getSigner();
      const signerAddress = await signer.getAddress();
      const salt = 5;

      // Create an instance of the contract using the contract ABI and address
      const acctContract = new ethers.Contract(
        acctFactoryAddress,
        SimpleAccountFactory.abi,
        ethersProvider.getSigner()
      );
      setContract(acctContract);

      const createAccount = await acctContract.createAccount(signerAddress, salt);
      console.log("Account created", createAccount);
      const getAccount = await acctContract.getCreatedAddress(signerAddress, salt);
      console.log(getAccount);
      setAddress(getAccount);
      let balance = await acctContract.balanceOf(getAccount);
      balance = ethers.utils.formatEther(balance);
      setBalance(balance);
      setLoadingState(true);
    });
  }, []);

  const fundAccount = async (e) => {
    console.log("la fuq")
    try {
      e.preventDefault();
      const amount = e.target[0].value;
      const amt = ethers.utils.parseEther(amount);
      const accountTx = await contract.fundWallet(address, { value: amt });
      const receipt = await accountTx.wait();
      if (receipt.status === 1) {
        alert('Funding successful');
      }
      else {
        alert('Funding failed');
        return
      }
      let balance = await contract.balanceOf(getAccount);
      balance = ethers.utils.formatEther(balance);
      setBalance(balance);
    }
    catch (error) {
      console.log(error);
    }
  };
  

  return (
    <main className={styles.main}>
      {provider && (
        <>
            {loadingState === false ? (
              <p>Loading...</p>
            ):(
              <form onSubmit={fundAccount} className={styles.container}>
                <h3>Abstracted Wallet</h3>
                {address === null || address === undefined ? 
                  (<></>):(<p>Address:<br/><small className={styles.small}>{address}</small></p>)              
                }
                <p>Balance: {balance}</p>
                <input
                  type="number"
                  step="0.000001"
                  inputMode="decimal"
                  placeholder="Amount"
                  className={styles.input}
                />
                <button className={styles.button} type="submit">Fund</button>
              </form>
            )}
        </>
      )}
    </main>
  )
}
