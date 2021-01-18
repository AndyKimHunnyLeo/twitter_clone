import Tweet from 'components/Tweet';
import { dbService, storageService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [attechment, setAttechment] = useState();
  useEffect(() => {
    dbService.collection('tweets').onSnapshot((snapshot) => {
      const newArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(newArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attechmentUrl = '';
    if (attechment) {
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await fileRef.putString(attechment, 'data_url');
      attechmentUrl = await response.ref.getDownloadURL();
    }
    const newTweet = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attechmentUrl,
    };
    await dbService.collection('tweets').add(newTweet);
    setTweet('');
    cancelUpload();
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttechment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const cancelUpload = () => {
    setAttechment(null);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type='text'
          placeholder='What is on your mind'
          maxLength={120}
          onChange={onChange}
          value={tweet}
        />
        <input type='file' accept='image/*' onChange={onFileChange} />
        <input type='submit' value='Tweet' />
        {attechment && (
          <div>
            <img src={attechment} alt='' width='40px' />
            <button onClick={cancelUpload}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
