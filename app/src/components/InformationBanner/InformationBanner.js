import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './InformationBanner.css';

function InformationBanner({ helper, dataModel }) {

  const [nbRacers, setNbRacers ] = useState(0);

  useEffect(() => {
    const racermanager = dataModel.Racers;
    setNbRacers(racermanager.length);
    //console.log('InformationBanner render with data model:', dataModel);const { t: translator } = useTranslation('InformationBanner');
  }, [ dataModel ]);
  
  return (
  <div className="information-banner">
      <h1>{helper.translator('title')}</h1>
      <span>{helper.translator('nb_racer')} : { nbRacers }</span>
    </div>
  );
}

export default InformationBanner;