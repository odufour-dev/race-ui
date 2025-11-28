import React, { useEffect, useState, useMemo } from 'react';
import TimeRankingTable from './TimeRankingTable/TimeRankingTable';
import Grid from './Grid/Grid';

import './StageRanking.css';
import { use } from 'i18next';

export default function StageRanking({ data = [], time, onChange }) {

    const [ timeranking, setTimeRanking ]   = useState( [] );
    const [ bibsstatus, setBibStatus ]      = useState( [] );

    useEffect(() => {
        
        const bibs = data.map(item => ({bib: Number(item.bib), status: item.status}));
        bibs.sort((a,b) => a - b);
        setBibStatus(bibs);

        const ranking = data.filter(item => item.status == "done");
        ranking.sort((a,b) => a.position - b.position);
        setTimeRanking(ranking);

    }, [ data ]);

    // Update the Grid status when TimeRanking is updated
    //  Bib set in TimeRanking shall be set as "done" in the Grid
    useEffect(() => {

        const bibOcc = timeranking.reduce((acc, item) => {
                acc[item.bib] = (acc[item.bib] || 0) + 1;
            return acc;
        }, {});

        setBibStatus(bibsstatus.map(b =>{
            if (b.bib in bibOcc && bibOcc[b.bib] > 1){
                b.status = "duplicate";
            } else if (b.bib in bibOcc){
                b.status = "done";
            } else if (b.status === "done") { // Reset status if the bib was removed from the timeranking
                b.status = "unknown";
            }console.log(b);
            return b;
        }));

    }, [ timeranking ]);

    useEffect(() => {
        //console.log(timeranking,bibsstatus)
        //onChange(timeranking.map((tr) => {return {bib: Number(tr.bib), position: tr.position, time: tr.time, status: "done"};}));
    }, [ timeranking, bibsstatus ]);

    return (
        <div>
            <Grid data={bibsstatus} onChange={setBibStatus} />
            <TimeRankingTable data={timeranking} time={time} onChange={setTimeRanking}/>
        </div>
    );
}