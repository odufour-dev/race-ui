import React, { useEffect, useState, useCallback } from 'react';
import TimeRankingTable from './TimeRankingTable/TimeRankingTable';
import Grid from './Grid/Grid';

import './StageRanking.css';

export default function StageRanking({ data = [], helper, onChange }) {

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
                ...item,
                bib: Number(item.bib),
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

    const computeRankingOutput = useCallback((data, timeRanking, bibsStatus) => {
        return data.map(d => {
            const bib = Number(d.bib);

            const tr = timeRanking.find(t => Number(t.bib) === bib);
            const bs = bibsStatus.find(b => b.bib === bib);

            return {
                ...d,
                bib,
                position: tr ? tr.position : null,
                time: tr ? tr.time : null,
                status: bs ? bs.status : "unknown",
            };
        });
    }, []);

    //
    // --- STATE ---
    //

    const [timeRanking, setTimeRanking] = useState(() => computeTimeRanking(data));
    const [bibsStatus, setBibsStatus] = useState(() => computeBibStatus(data));

    

    //
    // --- SYNC AVEC data ---
    //
    // Si data change réellement (par ex. retour serveur avec statuts mis à jour),
    // on recalcule les états à partir de cette "source de vérité".
    // Cependant, on préserve les statuts manuels (dns, dnf) qui ont été définis localement.
    useEffect(() => {
        const incomingBibs = computeBibStatus(data);
        
        setBibsStatus(prevBibs => {
            // Merge incoming data with existing state, preserving manual statuses (dns, dnf)
            return incomingBibs.map(inBib => {
                const existingBib = prevBibs.find(b => b.bib === inBib.bib);
                // If the bib had a manual status (dns or dnf), keep it
                if (existingBib && (existingBib.status === 'dns' || existingBib.status === 'dnf')) {
                    return existingBib;
                }
                // Otherwise use the incoming status
                return inBib;
            });
        });

        const tr = computeTimeRanking(data);
        setTimeRanking(tr);
    }, [data, computeBibStatus, computeTimeRanking]);

    //
    // --- HANDLERS ---
    //

    // Changement manuel des statuts (grid)
    const handleBibStatusChange = (newBibsStatus) => {
        // On veille à normaliser les bibs au cas où
        const normalized = newBibsStatus.map(b => ({
            ...b,
            bib: Number(b.bib),
        }));

        setBibsStatus(normalized);

        const updated = computeRankingOutput(data, timeRanking, normalized);
        onChange(updated);
    };

    // Changement du classement (table)
    const handleTimeRankingChange = (newTimeRanking) => {

        setTimeRanking(newTimeRanking);

        setBibsStatus(prev => {
            const updatedBibs = computeUpdatedBibStatus(prev, newTimeRanking);
            const updatedRanking = computeRankingOutput(data, newTimeRanking, updatedBibs);
            onChange(updatedRanking);
            return updatedBibs;
        });
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
