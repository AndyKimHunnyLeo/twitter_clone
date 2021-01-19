import React, { useState } from 'react';
import { authService } from 'fbase';
import { useHistory } from 'react-router-dom';

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };

  // const getMyTweet = async () => {
  //   const tweets = await dbService
  //     .collection('tweets')
  //     .where('creatorId', '==', userObj.uid)
  //     .orderBy('createdAt')
  //     .get();
  //   console.log(tweets.docs.map((doc) => doc.data()));
  // };

  // useEffect(() => {
  //   getMyTweet();
  // }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
      window.alert('completed');
    }
  };
  return (
    <div className='container'>
      <form onSubmit={onSubmit} className='profileForm'>
        <input
          onChange={onChange}
          type='text'
          placeholder='Display name'
          value={newDisplayName}
          autoFocus
          className='formInput'
        />
        <input
          type='submit'
          value='Update Profile'
          className='formBtn'
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className='formBtn cancelBtn logOut' onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
