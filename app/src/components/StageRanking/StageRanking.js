import React, { useEffect, useState, useMemo } from 'react';
import TimeRankingTable from './TimeRankingTable/TimeRankingTable';
import Grid from './Grid/Grid';

import './StageRanking.css';

export default function StageRanking({ data = [], time, onChange }) {

    let allBibs = [];
    for (let i = 1; i < 100; i++){
        if ((i % 10) > 0 && (i % 10) < 7){
            allBibs.push({ id: i, status: "unknown" });
        }
    }

    const [ timeranking, setTimeRanking ] = useState( [] );
    const [ status, setStatus ] = useState( allBibs );

    // Update the Grid status when TimeRanking is updated
    //  Bib set in TimeRanking shall be set as "done" in the Grid
    useEffect(() => {
        const bibs = timeranking.map(item => Number(item.bib));
        const bibSet = new Set(bibs);
        const bibOcc = bibs.reduce((acc, item) => {
            acc[item] = (acc[item] || 0) + 1;
            return acc;
        }, {});
        setStatus(status.map(item =>{
            if (item.id in bibOcc && bibOcc[item.id] > 1){
                return { ...item, status: "duplicate" };
            } else if (bibSet.has(item.id)){
                return { ...item, status: "done" };
            } else if (item.status === "done") {
                return { ...item, status: "unknown"};
            } else {
                return item;
            }
        }));
    }, [ timeranking ]);

    useEffect(() => {
        // Add "done" status to all elements of timeranking
        const out = timeranking.map((tr) => {return {bib: Number(tr.bib), position: tr.position, time: tr.time, status: "done"};});
        // Append bibs with non "done" status
        status.map((s) => {
            if (s.status !== "done"){
                out.push({bib: s.id, position: -1, time: "00:00:00", status: s.status});
            }
        })
        onChange(out);
    }, [ timeranking, status ]);

    return (
        <div>
            <Grid data={status} onChange={setStatus} />
            <TimeRankingTable data={timeranking} time={time} onChange={setTimeRanking}/>
        </div>
    );
}