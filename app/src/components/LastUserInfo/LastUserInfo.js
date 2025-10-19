import React from 'react';
import { useTranslation } from 'react-i18next';
import './LastUserInfo.css';

function LastUserInfo({ dataModel }) {
  const { t: translator } = useTranslation('ExcelReader');
  const racermanager = dataModel.getRacerManager();
  return (
  <div className="last-user-info">
      <span>{translator('nb_racer')} : {racermanager.length}</span>
    </div>
  );
}

export default LastUserInfo;