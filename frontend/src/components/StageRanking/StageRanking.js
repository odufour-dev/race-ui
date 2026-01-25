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

    const mergeRankingAndStatus = useCallback((timeRanking, bibsStatus) => {
        // Create a map of timeRanking for O(1) lookup
        const timeRankingMap = new Map(timeRanking.map(t => [t.bib, t]));

        // Merge timeRanking and bibsStatus
        const merged = bibsStatus.map(bib => {
            const timeData = timeRankingMap.get(bib.bib);
            return {
                bib: bib.bib,
                status: bib.status,
                position: timeData ? timeData.position : null,
                time: timeData ? timeData.time : null,
            };
        });

        return merged;
    }, []);

    //
    // --- STATE ---
    //

    const [data, setData] = useState(() => connector.fetchStageRanking(competitionid, stage).then(manager => manager ? manager.Ranking : []));
    const [timeRanking, setTimeRanking] = useState([]);
    const [bibsStatus, setBibsStatus]   = useState([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Store the last saved state to compare with current state
    const lastSavedStateRef = useRef(null);

    // Update the data by querying the model when competitionid or stage change
    useEffect(() => {
        connector.fetchStageRanking(competitionid, stage)
            .then(manager => {
                const rankingData = manager ? manager.Ranking : [];
                setData(rankingData);
                setTimeRanking(computeTimeRanking(rankingData));
                const bibs = computeBibStatus(rankingData);
                setBibsStatus(bibs);
                // Initialize saved state
                lastSavedStateRef.current = { timeRanking: computeTimeRanking(rankingData), bibsStatus: bibs };
                setHasUnsavedChanges(false);
            })
            .catch(err => console.error(err));
    }, [competitionid, stage, connector, computeTimeRanking, computeBibStatus]);

    // Track unsaved changes
    useEffect(() => {
        const savedState = lastSavedStateRef.current;
        if (savedState) {
            const timeRankingChanged = JSON.stringify(timeRanking) !== JSON.stringify(savedState.timeRanking);
            const bibsStatusChanged = JSON.stringify(bibsStatus) !== JSON.stringify(savedState.bibsStatus);
            setHasUnsavedChanges(timeRankingChanged || bibsStatusChanged);
        }
    }, [timeRanking, bibsStatus]);

    // Handle Ctrl+S shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (hasUnsavedChanges) {
                    handleSave();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasUnsavedChanges, timeRanking, bibsStatus]);

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
    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Merge timeRanking and bibsStatus into a single array
            const mergedData = mergeRankingAndStatus(timeRanking, bibsStatus);
            console.log('Saving merged data:', mergedData);
            // await connector.saveStageRanking(competitionid, stage, mergedData);
            
            // Update saved state reference
            lastSavedStateRef.current = { timeRanking, bibsStatus };
            setHasUnsavedChanges(false);
            console.log('Changes saved successfully');
        } catch (error) {
            console.error('Error saving changes:', error);
        } finally {
            setIsSaving(false);
        }
    };

    //
    // --- RENDER ---
    //

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: hasUnsavedChanges ? '#ff6b6b' : '#51cf66', fontWeight: 'bold' }}>
                    {hasUnsavedChanges ? '● Unsaved changes' : '✓ All changes saved'}
                </div>
                <button
                    onClick={handleSave}
                    disabled={!hasUnsavedChanges || isSaving}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: hasUnsavedChanges ? '#4dabf7' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: hasUnsavedChanges ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold',
                        opacity: hasUnsavedChanges ? 1 : 0.6,
                    }}
                >
                    {isSaving ? 'Saving...' : 'Save (Ctrl+S)'}
                </button>
            </div>
            <Grid data={bibsStatus} onChange={handleBibStatusChange} />
            <TimeRankingTable
                data={timeRanking}
                helper={helper}
                onChange={handleTimeRankingChange}
            />
        </div>
    );
}
