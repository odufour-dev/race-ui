import React, { useEffect, useState } from 'react';
import './FinishRanking.css';

// Helpers: parse/format time
function parseHMS(input) {
  if (input == null) return null;
  const s = String(input).trim();
  if (!s) return null;
  const parts = s.split(':').map(p => p.trim());
  // allow ss, mm:ss, hh:mm:ss
  if (parts.length === 1) {
    const sec = Number(parts[0]);
    return Number.isFinite(sec) ? Math.floor(sec) : null;
  }
  if (parts.length === 2) {
    const m = Number(parts[0]);
    const sec = Number(parts[1]);
    if (!Number.isFinite(m) || !Number.isFinite(sec)) return null;
    return Math.floor(m * 60 + sec);
  }
  if (parts.length === 3) {
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    const sec = Number(parts[2]);
    if (![h,m,sec].every(Number.isFinite)) return null;
    return Math.floor(h * 3600 + m * 60 + sec);
  }
  return null;
}

function formatHMS(secs) {
  const s = Number(secs) || 0;
  const abs = Math.max(0, Math.floor(s));
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const sec = abs % 60;
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function parseMS(input) {
  if (input == null) return null;
  const s = String(input).trim();
  if (!s) return null;
  const parts = s.split(':').map(p => p.trim());
  if (parts.length === 1) {
    const sec = Number(parts[0]);
    return Number.isFinite(sec) ? Math.floor(sec) : null;
  }
  if (parts.length === 2) {
    const m = Number(parts[0]);
    const sec = Number(parts[1]);
    if (!Number.isFinite(m) || !Number.isFinite(sec)) return null;
    return Math.floor(m * 60 + sec);
  }
  return null;
}

function formatMS(secs) {
  const s = Number(secs) || 0;
  const abs = Math.max(0, Math.floor(s));
  const m = Math.floor(abs / 60);
  const sec = abs % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  return `${mm}:${ss}`;
}

// Row shape: { id, bib, timeSeconds, delaySeconds, mode }
export default function FinishRanking({ data = [], onChange }) {
  // Initialize rows from data prop. data expected as array of { id?, bib?, time?: 'HH:MM:SS' }
  const buildRows = (src) => {
    const rows = (src || []).map((r, idx) => {
      const id = r.id ?? `r${idx}`;
      const timeSeconds = r.time != null ? parseHMS(r.time) : null;
      return { id, bib: r.bib ?? '', timeSeconds, delaySeconds: null, mode: null, editTime: timeSeconds != null ? formatHMS(timeSeconds) : '', editDelay: '' };
    });
    // compute delays relative to first row time if available
    const firstTime = rows[0] && rows[0].timeSeconds != null ? rows[0].timeSeconds : null;
    rows.forEach((row, i) => {
      if (i === 0) {
        // first row delay = 0
        row.delaySeconds = 0;
        row.mode = 'time';
        if (row.timeSeconds == null) {
          row.timeSeconds = 0; row.editTime = formatHMS(0);
        }
        row.editDelay = formatMS(0);
      } else {
        if (row.timeSeconds != null && firstTime != null) {
          row.delaySeconds = Math.max(0, row.timeSeconds - firstTime);
          row.editDelay = formatMS(row.delaySeconds);
        } else {
          row.delaySeconds = null;
          row.editDelay = '';
        }
      }
    });
    return rows;
  };

  const [rows, setRows] = useState(buildRows(data));
  const refsMap = React.useRef({});
  const pendingFocus = React.useRef(null);

  function setCellRef(id, col, el) {
    if (!refsMap.current[id]) refsMap.current[id] = {};
    refsMap.current[id][col] = el;
  }

  function focusCellById(id, col) {
    const rec = refsMap.current[id];
    const el = rec && rec[col];
    if (el && typeof el.focus === 'function') {
      try { el.focus(); } catch (e) { /* ignore */ }
      // if time column, also select the text for quick replace
      try { if (col === 'time' && typeof el.select === 'function') el.select(); } catch (e) { /* ignore */ }
      return true;
    }
    return false;
  }

  function getRowIndexById(id) {
    return rows.findIndex(r => r.id === id);
  }

  const COLS = ['bib', 'time', 'delay'];

  function isCellEditable(rowIdx, col) {
    const r = rows[rowIdx];
    if (!r) return false;
    if (col === 'bib') return true;
    if (col === 'time') return !(r.mode === 'delay' && rowIdx !== 0);
    if (col === 'delay') return !(rowIdx === 0 || r.mode === 'time');
    return false;
  }

  function findNextEditable(fromRow, fromColIndex, forward = true) {
    const total = rows.length * COLS.length;
    let start = fromRow * COLS.length + fromColIndex;
    let i = start;
    while (true) {
      i = forward ? i + 1 : i - 1;
      if (i < 0 || i >= total) break;
      const row = Math.floor(i / COLS.length);
      const col = COLS[i % COLS.length];
      if (isCellEditable(row, col)) return { row, col };
    }
    return null;
  }

  // pendingFocus: { row, col }
  useEffect(() => {
    if (pendingFocus.current) {
      const p = pendingFocus.current;
      if (p.row < rows.length) {
        const id = rows[p.row].id;
        focusCellById(id, p.col);
        pendingFocus.current = null;
      }
    }
  }, [rows]);

  // ensure there is exactly one trailing empty row
  function ensureTrailingEmpty(next) {
    const copy = (next || []).slice();
    // remove extra empty rows at end
    while (copy.length > 1) {
      const a = copy[copy.length - 1];
      const b = copy[copy.length - 2];
      const aEmpty = !(String(a.bib || '').trim() || String(a.editTime || '').trim() || String(a.editDelay || '').trim());
      const bEmpty = !(String(b.bib || '').trim() || String(b.editTime || '').trim() || String(b.editDelay || '').trim());
      if (aEmpty && bEmpty) {
        // drop the last one
        copy.pop();
      } else break;
    }
    // append empty if last is not empty
    if (copy.length === 0 || (String(copy[copy.length - 1].bib || '').trim() || String(copy[copy.length - 1].editTime || '').trim() || String(copy[copy.length - 1].editDelay || '').trim())) {
      const id = `r${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
      copy.push({ id, bib: '', timeSeconds: null, delaySeconds: null, mode: null, editTime: '', editDelay: '' });
    }
    return copy;
  }

  useEffect(() => {
    setRows(prev => ensureTrailingEmpty(buildRows(data)));
  }, [JSON.stringify(data)]);

  useEffect(() => {
    if (typeof onChange === 'function') {
      // expose simplified data to parent
      const out = rows.map(r => ({ id: r.id, bib: r.bib, time: r.timeSeconds != null ? formatHMS(r.timeSeconds) : null, delay: r.delaySeconds != null ? formatMS(r.delaySeconds) : null }));
      onChange(out);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  function updateRow(id, patch) {
    setRows(prev => {
      const next = prev.map(r => r.id === id ? { ...r, ...patch } : r);
      // if first row time changed, recompute all delays
      const first = next[0];
      const firstTime = first && first.timeSeconds != null ? first.timeSeconds : null;
      return next.map((r, idx) => {
        const copy = { ...r };
        if (idx === 0) {
          copy.delaySeconds = 0;
          copy.editDelay = formatMS(0);
          if (copy.timeSeconds == null) { copy.timeSeconds = 0; copy.editTime = formatHMS(0); }
        } else {
          if (copy.mode === 'time') {
            // ensure delay updates from time
            if (copy.timeSeconds != null && firstTime != null) {
              copy.delaySeconds = Math.max(0, copy.timeSeconds - firstTime);
              copy.editDelay = formatMS(copy.delaySeconds);
            }
          } else if (copy.mode === 'delay') {
            // ensure time updates from delay
            if (copy.delaySeconds != null && firstTime != null) {
              copy.timeSeconds = firstTime + copy.delaySeconds;
              copy.editTime = formatHMS(copy.timeSeconds);
            }
          } else {
            // if neither mode set, keep computed delay if possible
            if (copy.timeSeconds != null && firstTime != null) {
              copy.delaySeconds = Math.max(0, copy.timeSeconds - firstTime);
              copy.editDelay = formatMS(copy.delaySeconds);
            }
          }
        }
        return copy;
      });
    });
    // ensure trailing empty row
    setRows(prev => ensureTrailingEmpty(prev));
  }

  function onBibChange(id, value) {
    updateRow(id, { bib: value });
  }

  function onTimeFocus(id) {
    setRows(prev => {
      const idx = prev.findIndex(r => r.id === id);
      const next = prev.map((r, i) => ({ ...r, mode: r.id === id ? 'time' : (i === 0 ? 'time' : r.mode) }));
      // if current row has no editTime, inherit previous row time (convenience)
      if (idx > 0) {
        const cur = next[idx];
        const prevRow = prev[idx - 1];
        if (prevRow && prevRow.timeSeconds != null && (!cur.editTime || !String(cur.editTime).trim())) {
          next[idx] = { ...cur, timeSeconds: prevRow.timeSeconds, editTime: formatHMS(prevRow.timeSeconds), mode: 'time' };
          // recompute delays relative to first row
          const firstTime = next[0] && next[0].timeSeconds != null ? next[0].timeSeconds : null;
          for (let i = 0; i < next.length; i++) {
            const r = next[i];
            if (i === 0) {
              r.delaySeconds = 0;
              r.editDelay = formatMS(0);
              if (r.timeSeconds == null) { r.timeSeconds = 0; r.editTime = formatHMS(0); }
            } else {
              if (r.mode === 'time') {
                if (r.timeSeconds != null && firstTime != null) {
                  r.delaySeconds = Math.max(0, r.timeSeconds - firstTime);
                  r.editDelay = formatMS(r.delaySeconds);
                }
              } else if (r.mode === 'delay') {
                if (r.delaySeconds != null && firstTime != null) {
                  r.timeSeconds = firstTime + r.delaySeconds;
                  r.editTime = formatHMS(r.timeSeconds);
                }
              } else {
                if (r.timeSeconds != null && firstTime != null) {
                  r.delaySeconds = Math.max(0, r.timeSeconds - firstTime);
                  r.editDelay = formatMS(r.delaySeconds);
                }
              }
            }
          }
        }
      }
      return next;
    });
    // select the time input content shortly after focus (works for mouse or programmatic focus)
    setTimeout(() => {
      const rec = refsMap.current[id];
      const el = rec && rec.time;
      if (el && typeof el.select === 'function') {
        try { el.select(); } catch (e) { /* ignore */ }
      }
    }, 0);
  }

  function onDelayFocus(id) {
    // only allow delay editing for non-first rows
    setRows(prev => prev.map((r, idx) => ({ ...r, mode: (r.id === id && idx !== 0) ? 'delay' : (idx===0 ? 'time' : r.mode) })));
  }

  function onTimeChange(id, text) {
    // always update edit buffer, but only commit numeric parse on blur or enter
    setRows(prev => prev.map(r => r.id === id ? { ...r, editTime: text } : r));
  }

  function handleKeyDown(e, id, col, idx) {
    const colIndex = COLS.indexOf(col);
    if (e.key === 'Enter') {
      e.preventDefault();
      if (col === 'time') commitTime(id);
      if (col === 'delay') commitDelay(id);
      const nextRow = idx + 1;
      if (nextRow < rows.length) {
        // focus first editable in next row
        for (const c of COLS) {
          if (isCellEditable(nextRow, c)) {
            focusCellById(rows[nextRow].id, c);
            return;
          }
        }
      }
      // need to ensure trailing row and focus it
      pendingFocus.current = { row: nextRow, col: 'bib' };
      setRows(prev => ensureTrailingEmpty(prev));
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (col === 'time') commitTime(id);
      if (col === 'delay') commitDelay(id);
      const next = findNextEditable(idx, colIndex, true);
      if (next) {
        focusCellById(rows[next.row].id, next.col);
        return;
      }
      // add/ensure trailing and focus
      pendingFocus.current = { row: rows.length, col: 'bib' };
      setRows(prev => ensureTrailingEmpty(prev));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = findNextEditable(idx, colIndex, true);
      if (next) focusCellById(rows[next.row].id, next.col);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = findNextEditable(idx, colIndex, false);
      if (prev) focusCellById(rows[prev.row].id, prev.col);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      // find next row with same col editable
      for (let r = idx + 1; r < rows.length; r++) {
        if (isCellEditable(r, col)) { focusCellById(rows[r].id, col); return; }
      }
      // ensure trailing and focus
      pendingFocus.current = { row: rows.length, col };
      setRows(prev => ensureTrailingEmpty(prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      for (let r = idx - 1; r >= 0; r--) {
        if (isCellEditable(r, col)) { focusCellById(rows[r].id, col); return; }
      }
    }
  }

  function commitTime(id) {
    const r = rows.find(x => x.id === id);
    if (!r) return;
    const secs = parseHMS(r.editTime);
    if (secs == null) return; // ignore invalid
    updateRow(id, { timeSeconds: secs });
  }

  function onDelayChange(id, text) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, editDelay: text } : r));
  }

  function commitDelay(id) {
    const r = rows.find(x => x.id === id);
    if (!r) return;
    const secs = parseMS(r.editDelay);
    if (secs == null) return;
    updateRow(id, { delaySeconds: secs });
  }

  return (
    <div className="finish-ranking">
      <table className="finish-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Bib</th>
            <th>Time (HH:MM:SS)</th>
            <th>Delay (MM:SS)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id} className={idx===0 ? 'winner' : ''}>
              <td className="rank-cell">{idx + 1}</td>
              <td>
                <input
                  ref={el => setCellRef(r.id, 'bib', el)}
                  onKeyDown={e => handleKeyDown(e, r.id, 'bib', idx)}
                  className="bib-input"
                  value={r.bib}
                  onChange={e => onBibChange(r.id, e.target.value)}
                />
              </td>
              <td>
                <input
                  ref={el => setCellRef(r.id, 'time', el)}
                  onKeyDown={e => handleKeyDown(e, r.id, 'time', idx)}
                  className="time-input"
                  value={r.editTime}
                  onFocus={() => onTimeFocus(r.id)}
                  onChange={e => onTimeChange(r.id, e.target.value)}
                  onBlur={() => commitTime(r.id)}
                  disabled={r.mode === 'delay' && idx !== 0}
                />
              </td>
              <td>
                <input
                  ref={el => setCellRef(r.id, 'delay', el)}
                  onKeyDown={e => handleKeyDown(e, r.id, 'delay', idx)}
                  className="delay-input"
                  value={r.editDelay}
                  onFocus={() => onDelayFocus(r.id)}
                  onChange={e => onDelayChange(r.id, e.target.value)}
                  onBlur={() => commitDelay(r.id)}
                  disabled={idx === 0 || r.mode === 'time'}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
