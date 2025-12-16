import React, { useEffect, useState } from 'react';

import './GeneralRanking.css';

export default function GeneralRanking({ data = [], time, translator }) {

    const [ columns, setColumns ]   = useState( ["bib", "time", "firstname", "lastname", "club", "category", "age", "ffcid", "uciid" ] );
    const [ ranking, setRanking ]   = useState( data );

    /*
    useEffect(() => {
        let ranking = data.map((d) => columns.map((c) => c in d ? d[c] : ""));console.debug(ranking)
        ranking = ranking.map(r => ({...r, time: r.time != "" ? time.formatHMS(r.time) : "" }));
        setRanking(ranking);
    }, [ columns, data ]);
*/
    return (
        <div className="general-ranking-table">
            <table className="general-table">
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