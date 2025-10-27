import React from 'react';
import { useTranslation } from 'react-i18next';
import './InformationBanner.css';

function InformationBanner({ dataModel }) {
  const { t: translator } = useTranslation('InformationBanner');
  const racermanager = dataModel.getRacerManager();
  //console.log('InformationBanner render with racermanager:', racermanager);
  return (
  <div className="information-banner">
      <h1>{translator('title')}</h1>
      <span>{translator('nb_racer')} : {racermanager.length}</span>
    </div>
  );
}

export default InformationBanner;