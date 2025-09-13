import React from 'react';
import './LastUserInfo.css';

function LastUserInfo({ lastUser }) {
  return (
  <div className="last-user-info">
      {lastUser ? (
        <span>Dernier utilisateur : {lastUser.firstName} {lastUser.lastName}</span>
      ) : (
        <span>Aucun utilisateur</span>
      )}
    </div>
  );
}

export default LastUserInfo;