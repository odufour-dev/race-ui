import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './InformationBanner.css';

function InformationBanner({ dataModel }) {

  const { t: translator } = useTranslation('InformationBanner');
  const [nbRacers, setNbRacers ] = useState(0);

  useEffect(() => {
    const racermanager = dataModel.getRacerManager();
    setNbRacers(racermanager.length);
    console.log('InformationBanner render with racermanager:', racermanager);
  }, [ dataModel ]);
  
  return (
  <div className="information-banner">
      <h1>{translator('title')}</h1>
      <span>{translator('nb_racer')} : { nbRacers }</span>
    </div>
  );
}

export default InformationBanner;