import React, { useEffect, useState, useRef } from 'react';
import './TimeRankingTable.css';

export default function TimeRankingTable({ data = [], helpers, onChange }) {
    
    // 
    //
    //
    // From rows (table component values) to data (input values)
    const computeData = (values, editMode) => {

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
            r.push({id: "id-" + d.position, class: c, rank: d.position, bib: d.bib, time: t, delay: l});
            last = {rank: d.position, time: t, delay: l};
        })
        r.push({id: "", class: [], rank: last.rank + 1, bib: -1, time: last.time, delay: last.delay});
        return r;
    }


    const [ editMode, setEditMode ] = useState( "delay" );
    const [ rows, setRows ]         = useState(() => computeRows(data));
    const [ focusTarget, setFocusTarget ] = useState( {row:0, col:0} );
    
    const refs = useRef(
      rows.map(() => [React.createRef(), React.createRef(), React.createRef()])
    );

    useEffect(() => {
      if (focusTarget) {
        const { row, col } = focusTarget;
        const cellRef = refs.current[row]?.[col];
        if (cellRef?.current) {
          cellRef.current.focus();
        }
      }
    }, [ focusTarget, rows ]);

    //
    //
    //
    const handleTab = (e, row,col) => {
      
      e.preventDefault();

      const availableCols = (row == 0 || editMode == "time") ? [0,1] : [0,2];
      const nextIdx = availableCols.findIndex(v => v == col) + 1;

      const nextRow = nextIdx >= availableCols.length && refs.current.length > row+1 ? row + 1 : row;
      const nextCol = nextIdx < availableCols.length ? availableCols[nextIdx] : 0;
      
      setFocusTarget({ row: nextRow, col: nextCol });

    }
    const handleEnter = (e, row,col) => {

      e.preventDefault();
      
      const nextRow = row + 1;
      const nextCol = 0;

      refs.current[row][col].current.blur(); // Force cell validation
      setFocusTarget({ row: nextRow, col: nextCol });

    }
    const handleArrowUp = (e, row,col) => {
      e.preventDefault();
      const nextRow = row > 0 ? row - 1 : 0;
      const nextCol = nextRow == 0 && col > 0 ? 1 : col;
      setFocusTarget({ row: nextRow, col: nextCol });
    }
    const handleArrowDown = (e, row,col) => {
      e.preventDefault();
      const nextRow = row < (rows.length - 1) ? row + 1 : rows.length - 1;
      const nextCol = row == 0 && col > 0 && editMode == "delay" ? 2 : col;
      setFocusTarget({ row: nextRow, col: nextCol });
    }
    const handleArrowLeft = (e, row,col) => {
      e.preventDefault();
      const availableCols = (row == 0 || editMode == "time") ? [0,1] : [0,2];
      const nextIdx = availableCols.findIndex(v => v == col) - 1;
      const nextRow = row;
      const nextCol = nextIdx >= 0 ? availableCols[nextIdx] :  availableCols[0];
      setFocusTarget({ row: nextRow, col: nextCol });
    }
    const handleArrowRight = (e, row,col) => {
      e.preventDefault();
      const availableCols = (row == 0 || editMode == "time") ? [0,1] : [0,2];
      const nextIdx = availableCols.findIndex(v => v == col) + 1;
      const nextRow = row;
      const nextCol = nextIdx < availableCols.length ? availableCols[nextIdx] :  availableCols[availableCols.length-1];
      setFocusTarget({ row: nextRow, col: nextCol });
    }

    const handleKeyDown = (e, row, col) => {

      if      (e.key == "Tab"       )   {handleTab       (e,row,col);} 
      else if (e.key == "Enter"     )   {handleEnter     (e,row,col);} 
      else if (e.key == "ArrowRight")   {handleArrowRight(e,row,col);} 
      else if (e.key == "ArrowLeft" )   {handleArrowLeft (e,row,col);} 
      else if (e.key == "ArrowUp"   )   {handleArrowUp   (e,row,col);} 
      else if (e.key == "ArrowDown" )   {handleArrowDown (e,row,col);}

    };

    const timeoutRef = useRef(null);
    const commitRow = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        const data = computeData(rows, editMode);
        setRows(computeRows(data));
        onChange(data);
      }, 300);
    };

    const onCellFocus = (evt,row,col) => {
      evt.target.select();
      setFocusTarget({row: row,col: col})
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
            <th>{helpers.translator("rank")}</th>
            <th>{helpers.translator("bib")}</th>
            <th>{helpers.translator("time")}</th>
            <th>{helpers.translator("delay")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => {
            if (!refs.current[idx]) {
              refs.current[idx] = [React.createRef(), React.createRef(), React.createRef()];
            }
            return (
            <tr key={r.id} className={r.class.join(' ')}>
              
              <td className="rank-cell">{r.rank}</td>
              <td className="bib-cell">
                <input
                  ref={refs.current[idx][0]}
                  onKeyDown={e => handleKeyDown(e, idx, 0)}
                  className="bib-input"
                  value={r.bib >= 0 ? r.bib : ""}
                  onFocus={ e => onCellFocus(e,idx,0)}
                  onChange={e => onBibChange(e, r.id)}
                  onBlur={() => commitRow()}
                />
              </td>
              <td className="time-cell">
                <input
                  ref={refs.current[idx][1]}
                  onKeyDown={e => handleKeyDown(e, idx, 1)}
                  className="time-input"
                  placeholder="00:00:00"
                  value={r.time}
                  onFocus={ e => onCellFocus(e,idx,1)}
                  onChange={e => onTimeChange(e, r.id)}
                  onBlur={() => commitRow()}
                  disabled={idx !== 0 && editMode != 'time'}
                />
              </td>
              <td className="delay-cell">
                <input
                  ref={refs.current[idx][2]}
                  onKeyDown={e => handleKeyDown(e, idx, 2)}
                  className="delay-input"
                  placeholder="00:00"
                  value={r.delay}
                  onFocus={ e => onCellFocus(e,idx,2)}
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
          )})}
        </tbody>
      </table>
    </div>
    );
}