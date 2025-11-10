import React, { useEffect, useState, useMemo } from 'react';
import TimeRankingTable from './TimeRankingTable/TimeRankingTable';
import Grid from './Grid/Grid';

import './StageRanking.css';

export default function StageRanking({ data = [], time, onChange }) {


    return (
        <div>
            <Grid />
            <TimeRankingTable data={[]} time={time} onChange={(d) => {
                onChange(d);
                }}/>
        </div>
    );
}