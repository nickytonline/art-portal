import type { NextPage } from 'next';
import Head from 'next/head';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import { ErrorDescription } from '@ethersproject/abi/lib/interface';

// Extend the window object.
declare global {
  interface Window {
    ethereum: any; // TODO, type this out at some point.
  }
}

const fadeInfadeOut = keyframes`
  from {
  	opacity: 0;
  }
  to {
 	opacity: 1;
  }
`;

const web3Styles = {
  color: 'accent',
  opacity: 1,
  '@media screen and (prefers-reduced-motion: no-preference)': {
    animation: `${fadeInfadeOut} 2.5s ease-in-out infinite`,
  },
};

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [error, setError] = useState('');

  async function requestArt() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        setError('You need the MetaMask browser extension!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error: any) {
      console.log(error);

      if (
        error.message.includes(
          `Request of type 'wallet_requestPermissions' already pending`,
        )
      ) {
        setError(
          `You've already requested to connect your Metamask wallet. Click on the Metamask wallet extension to bring it back to focus so you can connect your wallet.`,
        );
      } else if (error.message.includes(`User rejected the request.`)) {
        setError(`That's so sad. You decided to not connect your wallet. 😭`);
      } else {
        setError('An unknown error occurred');
      }
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have metamask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <>
      <Head>
        <title>Welcome to the Art Portal 🎨</title>
        <meta name="description" content="Welcome to Web3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header sx={{ margin: '1rem 0' }}>
        <h1 sx={{ fontFamily: 'heading' }}>
          Welcome to the <span sx={web3Styles}>art portal 🎨</span>
        </h1>
      </header>
      <main>
        <p>
          <em>Hi! 👋</em> I&apos;m Nick. Connect your Metamask Ethereum wallet
          and request some art!
        </p>

        <button onClick={requestArt}>Request a piece of art!</button>
        {error && (
          <p aria-live="assertive" sx={{ color: 'darkred', fontWeight: 700 }}>
            {error}
          </p>
        )}
      </main>
    </>
  );
};

export default Home;
