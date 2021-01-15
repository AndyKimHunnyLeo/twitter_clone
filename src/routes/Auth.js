import React, { useState } from 'react';
import { authService, firebaseInstance } from 'fbase';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    // if (event.target.name === 'email') {
    //   setEmail(event.target.value);
    // } else {
    //   setPassword(event.target.value);
    // }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount) {
        //create New account
        const data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
        console.log(data);
      } else {
        //login
        const data = await authService.signInWithEmailAndPassword(
          email,
          password
        );
        console.log(data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const setToggle = () => setNewAccount((prev) => !prev);

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === 'google') {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    const data = await authService.signInWithPopup(provider);
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name='email'
          type='email'
          placeholder='Email'
          required
          value={email}
          onChange={onChange}
        />
        <input
          name='password'
          value={password}
          type='password'
          placeholder='Password'
          required
          onChange={onChange}
        />
        <input type='submit' value={newAccount ? 'Create Account' : 'Log In'} />
        {error}
      </form>
      <span onClick={setToggle}>
        {newAccount ? 'Log In' : 'Create Account'}
      </span>
      <div>
        <button onClick={onSocialClick} name='google'>
          Continue with Google
        </button>
        <button onClick={onSocialClick} name='github'>
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default Auth;
