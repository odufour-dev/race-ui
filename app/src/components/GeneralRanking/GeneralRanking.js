import React from 'react';

import './GeneralRanking.css';

export default function GeneralRanking({ data = [], helper }) {
 
  const classification = data.filter(d => d.status === 'done').slice();
  const leaderboard = classification.map((d,idx) => ({
    position:     idx + 1,
    bib:          String(d.bib),
    time:         helper.time.formatHMS(d.time),
    delay:        helper.time.formatMS(d.time - classification[0].time),
    firstname:    d.firstname,
    lastname:     d.lastname, 
    sex:          d.sex,
    club:         d.club,
    category:     d.category,
    age:          d.age > 0 ? String(d.age) : "",
    ffcid:        d.ffcid,
    uciid:        d.uciid,
    millisecs:    d.millisecs != null ? String(d.millisecs) : "",
    cumposition:  d.cumposition ? String(d.cumposition) : "",
    lastposition: d.lastposition ? String(d.lastposition) : ""
  }));
  
  const withdrawal = data.filter(d => (d.status !== 'done' && d.status !== 'unknown')).slice().map((d) => ({
    bib:          String(d.bib),
    status:       d.status,
    stage:        d.stage != null ? d.stage : "",
    firstname:    d.firstname,
    lastname:     d.lastname,
    sex:          d.sex,
    club:         d.club,
    category:     d.category,
    age:          d.age > 0 ? String(d.age) : "",
    ffcid:        d.ffcid,
    uciid:        d.uciid,
  }));

  const missing = data.filter(d => (d.status === 'unknown')).slice().map((d) => ({
    bib:          String(d.bib),
    firstname:    d.firstname,
    lastname:     d.lastname,
    sex:          d.sex,
    club:         d.club,
    category:     d.category,
    age:          d.age > 0 ? String(d.age) : "",
    ffcid:        d.ffcid,
    uciid:        d.uciid,
  }));

  return (
    <div className="general-ranking">
      <div className="ranking-section">
        <h3 className="section-title ranked-title">{helper.translator("general.ranking")}</h3>
        <div className="section-card">
          <table className="general-table">
            <thead>
              <tr>
                <th>{helper.translator("general.position")}</th>
                <th>{helper.translator("general.bib")}</th>
                <th>{helper.translator("general.time")}</th>
                <th>{helper.translator("general.delay")}</th>
                <th>{helper.translator("general.firstname")}</th>
                <th>{helper.translator("general.lastname")}</th>
                <th>{helper.translator("general.sex")}</th>
                <th>{helper.translator("general.club")}</th>
                <th>{helper.translator("general.category")}</th>
                <th>{helper.translator("general.age")}</th>
                <th>{helper.translator("general.ffcid")}</th>
                <th>{helper.translator("general.uciid")}</th>
                <th>{helper.translator("general.millisecs")}</th>
                <th>{helper.translator("general.cumposition")}</th>
                <th>{helper.translator("general.lastposition")}</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((r, idx) => (
                <tr key={String(r.bib) + '-' + idx}>
                  <td className="rank">{r.position}</td>
                  <td className="bib">{r.bib}</td>
                  <td className="time">{r.time}</td>
                  <td className="delay">{r.delay}</td>
                  <td className="firstname">{r.firstname}</td>
                  <td className="lastname">{r.lastname}</td>
                  <td className="sex">{r.sex}</td>
                  <td className="club">{r.club}</td>
                  <td className="category">{r.category}</td>
                  <td className="age">{r.age}</td>
                  <td className="ffcid">{r.ffcid}</td>
                  <td className="uciid">{r.uciid}</td>
                  <td className="millisecs">{r.millisecs}</td>
                  <td className="cumposition">{r.cumposition}</td>
                  <td className="lastposition">{r.lastposition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="withdrawal-section">
        <h3 className="section-title withdrawal-title">{helper.translator("general.withdrawal")}</h3>
        <div className="section-card">
          <table className="withdrawal-table">
            <thead>
              <tr>
                <th>{helper.translator("general.bib")}</th>
                <th>{helper.translator("general.status")}</th>
                <th>{helper.translator("general.stage")}</th>
                <th>{helper.translator("general.firstname")}</th>
                <th>{helper.translator("general.lastname")}</th>
                <th>{helper.translator("general.sex")}</th>
                <th>{helper.translator("general.club")}</th>
                <th>{helper.translator("general.category")}</th>
                <th>{helper.translator("general.age")}</th>
                <th>{helper.translator("general.ffcid")}</th>
                <th>{helper.translator("general.uciid")}</th>
              </tr>
            </thead>
            <tbody>
              {withdrawal.map((r, idx) => (
                <tr key={r.bib + '-u-' + idx}>
                  <td className="bib">{r.bib}</td>
                  <td className="status">{r.status}</td>
                  <td className="stage">{r.stage}</td>
                  <td className="firstname">{r.firstname}</td>
                  <td className="lastname">{r.lastname}</td>
                  <td className="sex">{r.sex}</td>
                  <td className="club">{r.club}</td>
                  <td className="category">{r.category}</td>
                  <td className="age">{r.age}</td>
                  <td className="ffcid">{r.ffcid}</td>
                  <td className="uciid">{r.uciid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="missing-section">
        <h3 className="section-title missing-title">{helper.translator("general.missing")}</h3>
        <div className="section-card">
          <table className="missing-table">
            <thead>
              <tr>
                <th>{helper.translator("general.bib")}</th>
                <th>{helper.translator("general.firstname")}</th>
                <th>{helper.translator("general.lastname")}</th>
                <th>{helper.translator("general.sex")}</th>
                <th>{helper.translator("general.club")}</th>
                <th>{helper.translator("general.category")}</th>
                <th>{helper.translator("general.age")}</th>
                <th>{helper.translator("general.ffcid")}</th>
                <th>{helper.translator("general.uciid")}</th>
              </tr>
            </thead>
            <tbody>
              {missing.map((r, idx) => (
                <tr key={r.bib + '-m-' + idx}>
                  <td className="bib">{r.bib}</td>
                  <td className="firstname">{r.firstname}</td>
                  <td className="lastname">{r.lastname}</td>
                  <td className="sex">{r.sex}</td>
                  <td className="club">{r.club}</td>
                  <td className="category">{r.category}</td>
                  <td className="age">{r.age}</td>
                  <td className="ffcid">{r.ffcid}</td>
                  <td className="uciid">{r.uciid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
