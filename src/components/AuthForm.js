import { authService } from 'fbase';
import React, { useState } from 'react';

const AuthForm = () => {
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
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount) {
        //create New account
        await authService.createUserWithEmailAndPassword(email, password);
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

  return (
    <>
      <form onSubmit={onSubmit} className='container'>
        <input
          name='email'
          type='email'
          placeholder='Email'
          required
          value={email}
          className='authInput'
          onChange={onChange}
        />
        <input
          name='password'
          value={password}
          type='password'
          placeholder='Password'
          required
          className='authInput'
          onChange={onChange}
        />
        <input
          type='submit'
          className='authInput authSubmit'
          value={newAccount ? 'Create Account' : 'Log In'}
        />
        {error && <span className='authError'>{error}</span>}
      </form>
      <span onClick={setToggle} className='authSwitch'>
        {newAccount ? 'Log In' : 'Create Account'}
      </span>
    </>
  );
};

export default AuthForm;
