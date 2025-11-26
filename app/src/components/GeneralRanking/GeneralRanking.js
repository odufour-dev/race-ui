import React, { useEffect, useState } from 'react';

import './GeneralRanking.css';

export default function GeneralRanking({ data = [], time, translator }) {
/*
    const data = [
        {bib: 2, position: 4, time: 2345, status: "done", stage: 2, firstname: "Paul", lastname: "POULE", club: "GMC 38", category: "elite", age: "u23"},
    ];
*/
    const [ columns, setColumns ]   = useState( ["bib", "time", "firstname", "lastname", "club", "category", "age", "ffcid", "uciid" ] );
    const [ ranking, setRanking ]   = useState( data );

    useEffect(() => {
        let ranking = data.map((d) => columns.map((c) => c in d ? d[c] : ""));
        ranking = ranking.map((r) => r.time != "" ? time.formatHMS(r.time) : "");
        setRanking(ranking);
    }, [ columns, data ]);

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>{translator("column.position")}</th>
                        {columns.map(col => (<th key={col}>{translator("column." + col)}</th>))}
                    </tr>
                </thead>
                <tbody>
                {ranking.map(row => (
                    <tr key={"position-" + row.position}>
                        <td>{row.position}</td>
                        {Object.keys(row).map((d) => (<td>{row[d]}</td>))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}