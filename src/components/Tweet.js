import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const deleteTweet = async () => {
    const ok = window.confirm('Are you sure you want to delete your tweet');
    if (ok) {
      await dbService.doc(`tweets/${tweetObj.id}`).delete();
      await storageService.refFromURL(tweetObj.attechmentUrl).delete();
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`tweets/${tweetObj.id}`).update({
      text: newTweet,
    });
    setEditing(false);
  };
  return (
    <div className='tweet'>
      {editing ? (
        <>
          <form onSubmit={onSubmit} className='container tweetEdit'>
            <input value={newTweet} onChange={onChange} required />
            <input type='submit' value='Edit' className='formBtn' />
          </form>
          <span onClick={toggleEditing} className='formBtn cancelBtn'>
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>

          {tweetObj.attechmentUrl && (
            <img src={tweetObj.attechmentUrl} alt='' />
          )}
          {isOwner && (
            <>
              <div class='tweet__actions'>
                <span onClick={deleteTweet}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
