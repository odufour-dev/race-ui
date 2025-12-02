import React, { useEffect, useState, useMemo } from 'react';
import './TimeRankingTable.css';

export default function TimeRankingTable({ data = [], helpers, onChange }) {
    
    // 
    //
    //
    // From rows (table component values) to data (input values)
    const computeData = (values) => {

      let referencetime = 0;
      return values.map((v, idx) => {

        let time = helpers.time.parseHMS(v.time);
        if (idx == 0){
          referencetime = time;
        } else if (editMode == "delay"){
          time = helpers.time.parseMS(v.delay) + referencetime;
        }

        return {
          position: Number(v.rank),
          bib:      Number(v.bib),
          time:     time
        }

      }).filter(v => v.position > 0 && v.bib > 0 && v.time >= 0);

    };

    // From data (input values) to rows (table component values)
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

    const [ editMode, setEditMode ] = useState( "delay" );
    const [ rows, setRows ]         = useState(() => computeRows(data));

    //
    //
    //
    const handleKeyDown = (e, rowid, col, row) => {

    };

    const commitRow = () => {
      const data = computeData(rows);
      setRows(computeRows(data));
      onChange(data);
    }

    const onCellFocus = (evt) => {
      evt.target.select();
    }
    
    const onBibChange = (evt, rowid) => {
      setRows(prev => prev.map(r => r.id === rowid ? { ...r, bib: evt.target.value } : r));
    }

    const onTimeChange = (evt,rowid) => {
      setRows(prev => prev.map(r => r.id === rowid ? { ...r, time: evt.target.value } : r));
    }

    const onDelayChange = (evt,rowid) => {
      setRows(prev => prev.map(r => r.id === rowid ? { ...r, delay: evt.target.value } : r));
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
                  onFocus={ e => onCellFocus(e)}
                  onChange={e => onBibChange(e, r.id)}
                  onBlur={() => commitRow()}
                />
              </td>
              <td className="time-cell">
                <input
                  onKeyDown={e => handleKeyDown(e, r.id, 'time', idx)}
                  className="time-input"
                  placeholder="00:00:00"
                  value={r.time}
                  onFocus={ e => onCellFocus(e)}
                  onChange={e => onTimeChange(e, r.id)}
                  onBlur={() => commitRow()}
                  disabled={idx !== 0 && editMode != 'time'}
                />
              </td>
              <td className="delay-cell">
                <input
                  onKeyDown={e => handleKeyDown(e, r.id, 'delay', idx)}
                  className="delay-input"
                  placeholder="00:00"
                  value={r.delay}
                  onFocus={ e => onCellFocus(e)}
                  onChange={e => onDelayChange(e, r.id)}
                  onBlur={() => commitRow()}
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