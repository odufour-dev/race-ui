import React, { useEffect, useState, useMemo } from 'react';
import './TimeRankingTable.css';

export default function TimeRankingTable({ data = [], helpers, onChange }) {

    const [ editMode, setEditMode ] = useState( "delay" );

    // 
    //
    //
    const computeRows = (values) => {
        const r = [];
        // id : string based on bib - position
        // class (array of strings) : winner (1st row), duplicate
        // rank (numeric)
        // bib (numeric) : -1 for invalid value
        // time : string with format HH:MM:SS
        // delay : string with format MM:SS
        let last = {rank:0,time:"",delay:""};
        values.map((d) => {
            const t = helpers.time.formatHMS(d.time);
            const l = helpers.time.formatMS(d.time - values[0].time);
            const c = [];
            if (d.position == 1){c.push("winner")}
            r.push({id: "id-" + d.bib + "_" + d.position, class: c, rank: d.position, bib: d.bib, time: t, delay: l});
            last = {rank: d.position, time: t, delay: l};
        })
        r.push({id: "", class: [], rank: last.rank + 1, bib: -1, time: last.time, delay: last.delay});
        return r;
    }
    //const rows = useMemo(() => computeRows(data), [data]);
    const [ rows, setRows ] = useState(() => computeRows(data));

    //
    //
    //
    const handleKeyDown = (e, rowid, col, row) => {

    };

    const onBibFocus = (evt, rowid) => {
      evt.target.select();
    }
    const onBibChange = (evt, rowid) => {
      setRows(prev => prev.map(r => r.id === rowid ? { ...r, bib: evt.target.value } : r));

    }
    const commitBib = (rowid,bibvalue) => {

    }

    const onTimeFocus = (rowid) => {

    }
    const onTimeChange = (rowid) => {

    }
    const commitTime = (rowid,bibvalue) => {

    }

    const onDelayFocus = (rowid) => {

    }
    const onDelayChange = (rowid) => {

    }
    const commitDelay = (rowid,bibvalue) => {

    }

    const insertRowAt = (idx) => {

    }

    const deleteRowAt = (idx) => {

    }


    //
    //
    //
    return (
    <div className="time-ranking-table">
      <div className="edit-toggle">
        <span className="muted">Editable column:</span>
        <button className={editMode == 'time' ? 'active' : ''} onClick={() => setEditMode("time")}>Time</button>
        <button className={editMode == 'delay' ? 'active' : ''} onClick={() => setEditMode("delay")}>Delay</button>
      </div>
      <table className="ranking-table">
        <thead>
          <tr>
            <th>helpers.translator("rank")</th>
            <th>helpers.translator("bib")</th>
            <th>helpers.translator("time")</th>
            <th>helpers.translator("delay")</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id} className={r.class.join(' ')}>
              
              <td className="rank-cell">{r.rank}</td>
              <td className="bib-cell">
                <input
                  onKeyDown={e => handleKeyDown(e, r.id, 'bib', idx)}
                  className="bib-input"
                  value={r.bib >= 0 ? r.bib : ""}
                  onFocus={ e => onBibFocus(e, r.id)}
                  onChange={e => onBibChange(e, r.id)}
                  onBlur={  e => commitBib(e, r.id)}
                />
              </td>
              <td className="time-cell">
                <input
                  onKeyDown={e => handleKeyDown(e, r.id, 'time', idx)}
                  className="time-input"
                  value={r.time}
                  onFocus={() => onTimeFocus(r.id)}
                  onChange={e => onTimeChange(r.id, e.target.value)}
                  onBlur={()  => commitTime(r.id)}
                  disabled={idx !== 0 && editMode != 'time'}
                />
              </td>
              <td className="delay-cell">
                <input
                  onKeyDown={e => handleKeyDown(e, r.id, 'delay', idx)}
                  className="delay-input"
                  value={r.delay}
                  onFocus={() => onDelayFocus(r.id)}
                  onChange={e => onDelayChange(r.id, e.target.value)}
                  onBlur={() => commitDelay(r.id)}
                  disabled={idx == 0 || editMode != 'delay'}
                />
              </td>
              <td className="actions">
                <button title={`Insert row after ${idx + 1}`} className="insert" onClick={() => insertRowAt(idx + 1)}>＋</button>
                <button title={`Delete row ${idx + 1}`} className="delete" onClick={() => deleteRowAt(idx)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
}