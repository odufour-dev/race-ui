import React, { useEffect, useState, useMemo } from 'react';
import TimeRankingTable from './TimeRankingTable/TimeRankingTable';
import Grid from './Grid/Grid';

import './StageRanking.css';

export default function StageRanking({ data = [], helper, onChange }) {

    const computeBibStatus = (data) => {
        const bibs = data.map(item => ({bib: Number(item.bib), status: item.status}));
        bibs.sort((a,b) => a.bib - b.bib);
        return bibs;
    }

    const computeTimeRanking = (data) => {
        const ranking = data.filter(item => item.status == "done");
        ranking.sort((a,b) => a.position - b.position);
        return ranking;
    };

    const [ timeranking, setTimeRanking ]   = useState( computeTimeRanking(data) );
    const [ bibsstatus, setBibStatus ]      = useState( computeBibStatus(data) );

    const updateBibStatus = (data) => {

        const bibOcc = data.reduce((acc, item) => {
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
            }
            return b;
        }));

    }

    const updateRanking = (timeranking,bibsstatus) => {

        const ranking = data.map((d) => {
            const tr = timeranking.find((t) => t.bib == d.bib);
            const bs = bibsstatus.find((b) => b.bib == d.bib);
            d.position = tr ? tr.position : null;
            d.time     = tr ? tr.time : null;
            d.status   = bs ? bs.status : "unknown";
            return d;
        })
        onChange(ranking)
        
    };

    const handleBibStatusChange = (newBibsStatus) => {
        setBibStatus(newBibsStatus);
        updateRanking(timeranking, newBibsStatus);
    };

    const handleTimeRankingChange = (newTimeRanking) => {        
        setTimeRanking(newTimeRanking);
        updateBibStatus(newTimeRanking);
        updateRanking(newTimeRanking, bibsstatus);
    };

    return (
        <div>
            <Grid data={bibsstatus} onChange={handleBibStatusChange} />
            <TimeRankingTable data={timeranking} helper={helper} onChange={handleTimeRankingChange}/>
        </div>
    );
}