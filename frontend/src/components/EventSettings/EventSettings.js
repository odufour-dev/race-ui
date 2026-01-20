import React, { useEffect, useState } from 'react';
import './EventSettings.css';
import { AnnexItemFactory } from './AnnexItemFactory';

/**
 * EventSettings
 * Props:
 * - settings: the RaceModel instance (mutated directly when Apply is clicked)
 * - onApply?: optional callback(settings) called after applying settings
 * - onCancel?: optional callback() called when user cancels
 */
export default function EventSettings({ helper, settings, annexRanking, onApply }) {
  
  // Use safe defaults so inputs never receive `undefined` which causes
  // React's controlled -> uncontrolled warning.
  const [ evtSettings, setEvtSettings ]     = useState( settings );
  const [ annexType, setAnnexType ]         = useState( annexRanking.list[0] );
  console.log("EventSettings render", evtSettings);
  useEffect(() => { onApply && onApply( evtSettings ) }, [ evtSettings ]);

  return (
    <div className="event-settings">
      <h2>{helper.translator("event.settings.title")}</h2>

      <div className="field">
        <label>{helper.translator("event.settings.nstages")}</label>
        <div className="stage-list">
          {evtSettings.stages.length === 0 && <div className="muted">{helper.translator("event.settings.nostage")}</div>}
          {(evtSettings.stages || []).map((s, idx) => (
            <AnnexItemFactory
              type="stage"
              helper={helper}
              data={s}
              onApply={ (stage) => setEvtSettings(evtSettings.update({stages: evtSettings.stages.map((stg) => stg.id === s.id ? stage : stg)})) }
              onRemove={() => setEvtSettings(evtSettings.update({stages: evtSettings.stages.filter((_,i) => i != idx)}))}
            />
          ))}
        </div>
        <div className="stage-actions">
          <button type="button" className="btn" onClick={() => setEvtSettings( evtSettings.addStage() )}>{helper.translator("event.settings.addstage")}</button>
        </div>
      </div>

      <div className="field">
        <label>{helper.translator("event.settings.annexrankings")}</label>
        <div className="annex-list">
          {evtSettings.annexRankings.length === 0 && <div className="muted">{helper.translator("event.settings.noannexranking")}</div>}
          {(evtSettings.annexRankings || []).map((data) => (
            <AnnexItemFactory 
              type={data.type}
              helper={helper}
              data={data}
              onApply={ (annex) => setEvtSettings(evtSettings.update({annexRankings: evtSettings.annexRankings.map((r) => r.id === data.id ? annex : r)})) }
              onRemove={ () => setEvtSettings(evtSettings.update({annexRankings: evtSettings.annexRankings.filter((r) => r.id != data.id)})) } 
            />
          ))}          
          <div className="annex-actions">
            <select value={annexType} onChange={e => setAnnexType(e.target.value)}>
            {
              annexRanking.list.map((t) => (
                <option key={t} value={t}>{helper.translator("event.settings.annex.type." + t)}</option>
              ))
            }
            </select>
            <button 
              type="button" 
              className="btn" 
              onClick={() => setEvtSettings( evtSettings.addAnnexRanking(annexRanking.build(annexType,evtSettings.annexRankings.length + 1)) )}
            >{helper.translator("event.settings.addannexranking")}</button>
          </div>
        </div>
      </div>

    </div>
  );
}
