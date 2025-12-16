import React from 'react';

export default function GeneralRanking({ data = [], helper }) {

  const ranked = (data || []).filter(d => d.status === 'done').slice().sort((a,b) => {
    const ta = Number(a.time || 0);
    const tb = Number(b.time || 0);
    return ta - tb;
  });

  const unranked = (data || []).filter(d => d.status !== 'done');

  return (
    <div className="general-ranking">
      <table className="general-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Bib</th>
            <th>Time</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Sex</th>
            <th>Club</th>
            <th>Category</th>
            <th>Age</th>
            <th>FFCid</th>
            <th>UCIid</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((r, idx) => (
            <tr key={String(r.bib) + '-' + idx}>
              <td className="rank">{idx + 1}</td>
              <td className="bib">{String(r.bib)}</td>
              <td className="time">{helper && helper.time ? helper.time.formatHMS(r.time) : String(r.time || '')}</td>
              <td className="firstname">{r.firstname || ''}</td>
              <td className="lastname">{r.lastname || ''}</td>
              <td className="sex">{r.sex || ''}</td>
              <td className="club">{r.club || ''}</td>
              <td className="category">{r.category || ''}</td>
              <td className="age">{r.age != null ? String(r.age) : ''}</td>
              <td className="ffcid">{r.ffcid || ''}</td>
              <td className="uciid">{r.uciid || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="unranked-table">
        <thead>
          <tr>
            <th>Bib</th>
            <th>Status</th>
            <th>Stage</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Sex</th>
            <th>Club</th>
            <th>Category</th>
            <th>Age</th>
            <th>FFCid</th>
            <th>UCIid</th>
          </tr>
        </thead>
        <tbody>
          {unranked.map((r, idx) => (
            <tr key={String(r.bib) + '-u-' + idx}>
              <td className="bib">{String(r.bib)}</td>
              <td className="status">{r.status || ''}</td>
              <td className="stage">{r.stage != null ? String(r.stage) : ''}</td>
              <td className="firstname">{r.firstname || ''}</td>
              <td className="lastname">{r.lastname || ''}</td>
              <td className="sex">{r.sex || ''}</td>
              <td className="club">{r.club || ''}</td>
              <td className="category">{r.category || ''}</td>
              <td className="age">{r.age != null ? String(r.age) : ''}</td>
              <td className="ffcid">{r.ffcid || ''}</td>
              <td className="uciid">{r.uciid || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
