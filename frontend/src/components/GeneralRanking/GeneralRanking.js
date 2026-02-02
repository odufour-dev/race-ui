import React, { useState, useEffect } from 'react';

import './GeneralRanking.css';

export default function GeneralRanking({ competitionid, stage, connector, helper }) {
 
  const [ leaderboard, setLeaderboard ] = useState([]);
  const [ withdrawal, setWithdrawal ]   = useState([]);
  const [ missing, setMissing ]         = useState([]);

  // Update the data by querying the model when competitionid or stage change
  useEffect(() => {
      connector.fetchGeneralRanking(competitionid, stage)
          .then(data => {

            const done = data.results.filter(d => (d.status === 'done' && d.stage === stage));
            const leaderboard = done.map((d,idx) => ({
              position:     idx + 1,
              bib:          String(d.bib),
              time:         d.time,
              delay:        d.delay,
              firstname:    d.firstName,
              lastname:     d.lastName, 
              sex:          d.sex,
              club:         d.team,
              category:     d.category,
              age:          d.age > 0 ? String(d.age) : "",
              ffcid:        d.ffcID,
              uciid:        d.uciID,
              millisecs:    d.millis != null ? String(d.millis) : "",
              cumposition:  d.cumulated ? String(d.cumulated) : "",
              lastposition: d.rank ? String(d.rank) : ""
            }));console.log(leaderboard)
            setLeaderboard(leaderboard);

            const withdrawal = data.results.filter(d => (d.status !== 'done' && d.status !== 'unknown')).slice().map((d) => ({
              bib:          String(d.bib),
              status:       d.status,
              stage:        d.stage != null ? d.stage : "",
              firstname:    d.firstName,
              lastname:     d.lastName,
              sex:          d.sex,
              club:         d.team,
              category:     d.category,
              age:          d.age > 0 ? String(d.age) : "",
              ffcid:        d.ffcID,
              uciid:        d.uciID,
            }));
            setWithdrawal(withdrawal);

            const missing = data.results.filter(d => (d.status === 'unknown' || (d.status === 'done' && d.stage < stage))).slice().map((d) => ({
              bib:          String(d.bib),
              firstname:    d.firstName,
              lastname:     d.lastName,
              sex:          d.sex,
              club:         d.team,
              category:     d.category,
              age:          d.age > 0 ? String(d.age) : "",
              ffcid:        d.ffcID,
              uciid:        d.uciID,
            }));
            setMissing(missing);

          })
          .catch(err => console.error(err));
  }, [competitionid, stage, connector]);

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
