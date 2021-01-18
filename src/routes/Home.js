import Tweet from 'components/Tweet';
import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);

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
    if (tweet.length > 0) {
      await dbService.collection('tweets').add({
        text: tweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
    }
    setTweet('');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
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
        <input type='submit' value='Tweet' />
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
