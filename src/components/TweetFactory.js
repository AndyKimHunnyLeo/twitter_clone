import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from 'fbase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const TweetFactory = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [attechment, setAttechment] = useState();

  const onSubmit = async (event) => {
    if (tweet === '') {
      return;
    }
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
    setAttechment('');
  };
  return (
    <form onSubmit={onSubmit} className='factoryForm'>
      <div className='factoryInput__container'>
        <input
          className='factoryInput__input'
          value={tweet}
          onChange={onChange}
          type='text'
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type='submit' value='&rarr;' className='factoryInput__arrow' />
      </div>
      <label for='attach-file' className='factoryInput__label'>
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id='attach-file'
        type='file'
        accept='image/*'
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      <input type='submit' value='Tweet' />
      {attechment && (
        <div className='factoryForm__attachment'>
          <img
            src={attechment}
            style={{
              backgroundImage: attechment,
            }}
            alt=''
          />
          <div className='factoryForm__clear' onClick={cancelUpload}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;
