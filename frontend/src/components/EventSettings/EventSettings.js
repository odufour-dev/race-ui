import React, { useEffect, useState } from 'react';
import './EventSettings.css';
import { AnnexItemFactory } from './AnnexItemFactory';

/**
 * EventSettings
 */
export default function EventSettings({ helper, connector, competitionid }) {
  
  // Use safe defaults so inputs never receive `undefined` which causes
  // React's controlled -> uncontrolled warning.
  const [ raceManager, setRaceManager ]     = useState( {} );
  const [ annexType, setAnnexType ]         = useState( "" );
  
  useEffect(() => {
      connector.fetchConfiguration(competitionid)
          .then(manager => {
              setRaceManager(manager);
              setAnnexType(manager.annexTypes[0]);              
              //lastSavedStateRef.current = { timeRanking: manager.computeTimeRanking(), bibsStatus: manager.computeBibStatus() };
              //setHasUnsavedChanges(false);
          })
          .catch(err => console.error(err));
  }, [competitionid, connector]);

  return (
    <div className="event-settings">
      <h2>{helper.translator("event.settings.title")}</h2>

      <div className="field">
        <label>{helper.translator("event.settings.nstages")}</label>
        <div className="stage-list">
          {(!raceManager.stages || raceManager.stages.length === 0) && <div className="muted">{helper.translator("event.settings.nostage")}</div>}
          {(raceManager.stages || []).map((s, idx) => (
            <AnnexItemFactory
              type="stage"
              helper={helper}
              data={s}
              onApply={ (stage) => setRaceManager(raceManager.update({stages: raceManager.stages.map((stg) => stg.id === s.id ? stage : stg)})) }
              onRemove={() => setRaceManager(raceManager.update({stages: raceManager.stages.filter((_,i) => i != idx)}))}
            />
          ))}
        </div>
        <div className="stage-actions">
          <button type="button" className="btn" onClick={() => setRaceManager( raceManager.addStage() )}>{helper.translator("event.settings.addstage")}</button>
        </div>
      </div>

      <div className="field">
        <label>{helper.translator("event.settings.annexrankings")}</label>
        <div className="annex-list">
          {(!raceManager.annexRankings || raceManager.annexRankings.length === 0) && <div className="muted">{helper.translator("event.settings.noannexranking")}</div>}
          {(raceManager.annexRankings || []).map((data) => (
            <AnnexItemFactory 
              type={data.type}
              helper={helper}
              data={data}
              onApply={ (annex) => setRaceManager(raceManager.update({annexRankings: raceManager.annexRankings.map((r) => r.id === data.id ? annex : r)})) }
              onRemove={ () => setRaceManager(raceManager.update({annexRankings: raceManager.annexRankings.filter((r) => r.id != data.id)})) } 
            />
          ))}          
          <div className="annex-actions">
            <select value={annexType} onChange={e => setAnnexType(e.target.value)}>
            {
              (raceManager.annexTypes || []).map((t) => (
                <option key={t} value={t}>{helper.translator("event.settings.annex.type." + t)}</option>
              ))
            }
            </select>
            <button 
              type="button" 
              className="btn" 
              onClick={() => setRaceManager( raceManager.addAnnexRanking(annexType) )}
            >{helper.translator("event.settings.addannexranking")}</button>
          </div>
        </div>
      </div>

    </div>
  );
}
