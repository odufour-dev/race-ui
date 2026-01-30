import React, { useEffect, useState, useCallback, useRef } from 'react';
import TimeRankingTable from './TimeRankingTable/TimeRankingTable';
import Grid from './Grid/Grid';

import './StageRanking.css';

export default function StageRanking({ competitionid, stage, connector, helper, savebar }) {

    //
    // --- FUNCTIONS PURES (sans mutation) ---
    //

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

    const [data,        setData]        = useState([]);
    const [timeRanking, setTimeRanking] = useState([]);
    const [bibsStatus,  setBibsStatus]  = useState([]);
    const [isDirty,     setIsDirty]     = useState(false);
    
    // Store the last saved state to compare with current state
    const lastSavedStateRef = useRef(null);

    // Update the data by querying the model when competitionid or stage change
    useEffect(() => {
        connector.fetchStageRanking(competitionid, stage)
            .then(manager => {
                setData(manager);
                setTimeRanking(manager.computeTimeRanking());
                setBibsStatus(manager.computeBibStatus());
                // Initialize saved state
                lastSavedStateRef.current = { timeRanking: manager.computeTimeRanking(), bibsStatus: manager.computeBibStatus() };
                setIsDirty(false);
            })
            .catch(err => console.error(err));
    }, [competitionid, stage, connector]);

    // Track unsaved changes
    useEffect(() => {
        const savedState = lastSavedStateRef.current;
        if (savedState) {
            const timeRankingChanged = JSON.stringify(timeRanking) !== JSON.stringify(savedState.timeRanking);
            const bibsStatusChanged  = JSON.stringify(bibsStatus)  !== JSON.stringify(savedState.bibsStatus);
            
            setIsDirty(timeRankingChanged || bibsStatusChanged);
        }
    }, [timeRanking, bibsStatus]);

    //
    // --- HANDLERS ---
    //

    // Changement manuel des statuts (grid)
    const handleBibStatusChange = (newBibsStatus) => {
        setBibsStatus(newBibsStatus);
    };

    // Changement du classement (table)
    const handleTimeRankingChange = (newTimeRanking) => {
        setTimeRanking(newTimeRanking);
        setBibsStatus(prevBibsStatus => computeUpdatedBibStatus(prevBibsStatus, newTimeRanking));
    };

    // Save changes (backend call will be added here)
    const saveCallback = async () => {
        const jsondata = data.updateFromRankingAndStatus(timeRanking, bibsStatus).toJSON();
        await connector.saveStageRanking(competitionid, stage, jsondata);
        setIsDirty(false);
    };

    //
    // --- RENDER ---
    //

    return (
        <div>
            {savebar(isDirty,saveCallback)}
            <Grid data={bibsStatus} onChange={handleBibStatusChange} />
            <TimeRankingTable
                data={timeRanking}
                helper={helper}
                onChange={handleTimeRankingChange}
            />
        </div>
    );
}
