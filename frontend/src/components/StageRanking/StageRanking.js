import React, { useEffect, useState, useCallback, useRef } from 'react';
import TimeRankingTable from './TimeRankingTable/TimeRankingTable';
import Grid from './Grid/Grid';

import './StageRanking.css';

export default function StageRanking({ competitionid, stage, connector, helper }) {

    //
    // --- FUNCTIONS PURES (sans mutation) ---
    //

    const computeBibStatus = useCallback((data) => {
        return data
            .map(item => ({
                bib: Number(item.bib),
                status: item.status || "unknown",
            }))
            .sort((a, b) => {
                const aNum = Number(a.bib);
                const bNum = Number(b.bib);
                return aNum - bNum;
            });
    }, []);

    const computeTimeRanking = useCallback((data) => {
        return data
            .filter(item => item.status === "done")
            .map(item => ({
                bib:        Number(item.bib),
                position:   Number(item.position),
                time:       Number(item.time),
            }))
            .sort((a, b) => a.position - b.position);
    }, []);

    const computeUpdatedBibStatus = useCallback((prevBibs, timeRanking) => {
        // On compte les occurrences de chaque bib dans le timeRanking
        const bibOcc = timeRanking.reduce((acc, item) => {
            const bib = Number(item.bib);
            acc[bib] = (acc[bib] || 0) + 1;
            return acc;
        }, {});

        // Update existing bibs
        const updated = prevBibs.map(b => {
            const bib = Number(b.bib);

            // On ne touche jamais aux statuts manuels
            if (b.status === "dns" || b.status === "dnf") {
                return b;
            }

            const occ = bibOcc[bib] || 0;

            if (occ > 1) {
                return { ...b, status: "duplicate" };
            }
            if (occ === 1) {
                return { ...b, status: "done" };
            }

            // Si le bib n'est plus dans le timeRanking et qu'il était "done",
            // on le remet à "unknown"
            if (b.status === "done") {
                return { ...b, status: "unknown" };
            }

            return b;
        });

        // Add new bibs from timeRanking that don't exist in prevBibs yet
        const existingBibs = new Set(prevBibs.map(b => Number(b.bib)));
        const newBibs = [];
        timeRanking.forEach(t => {
            const bib = Number(t.bib);
            if (!existingBibs.has(bib)) {
                const occ = bibOcc[bib] || 0;
                const status = occ > 1 ? "duplicate" : "done";
                newBibs.push({ bib, status });
            }
        });

        return [...updated, ...newBibs].sort((a, b) => a.bib - b.bib);
    }, []);

    //
    // --- STATE ---
    //

    const [data, setData] = useState(() => connector.fetchStageRanking(competitionid, stage).then(manager => manager ? manager.Ranking : []));
    const [timeRanking, setTimeRanking] = useState([]);
    const [bibsStatus, setBibsStatus]   = useState([]);

    // Update the data by querying the model when competitionid or stage change
    useEffect(() => {
        connector.fetchStageRanking(competitionid, stage)
            .then(manager => {
                const rankingData = manager ? manager.Ranking : [];
                setData(rankingData);
                setTimeRanking(computeTimeRanking(rankingData));
                setBibsStatus(computeBibStatus(rankingData));
            })
            .catch(err => console.error(err));
    }, [competitionid, stage, connector]);

    //
    // --- HANDLERS ---
    //

    // Changement manuel des statuts (grid)
    const handleBibStatusChange = (newBibsStatus) => {console.log(newBibsStatus,bibsStatus);
        setBibsStatus(newBibsStatus);
    };

    // FOR DEBUG
    useEffect(() => {
        console.log("Bib status changed", bibsStatus);
    }, [bibsStatus]);

    // Changement du classement (table)
    const handleTimeRankingChange = (newTimeRanking) => {
        setTimeRanking(newTimeRanking);
        setBibsStatus(prevBibsStatus => computeUpdatedBibStatus(prevBibsStatus, newTimeRanking));
    };

    //
    // --- RENDER ---
    //

    return (
        <div>
            <Grid data={bibsStatus} onChange={handleBibStatusChange} />
            <TimeRankingTable
                data={timeRanking}
                helper={helper}
                onChange={handleTimeRankingChange}
            />
        </div>
    );
}
