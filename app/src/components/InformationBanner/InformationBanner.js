import React from 'react';
import { useTranslation } from 'react-i18next';
import './InformationBanner.css';

function InformationBanner({ dataModel }) {
  const { t: translator } = useTranslation('InformationBanner');
  const racermanager = dataModel.getRacerManager();
  return (
  <div className="information-banner">
      <span>{translator('nb_racer')} : {racermanager.length}</span>
    </div>
  );
}ExcelReader

export default InformationBanner;