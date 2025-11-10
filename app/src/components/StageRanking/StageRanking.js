import React, { useEffect, useState, useMemo } from 'react';
import TimeRankingTable from './TimeRankingTable/TimeRankingTable';

import './StageRanking.css';

export default function StageRanking({ data = [], time, onChange }) {

    return (
        <TimeRankingTable data={data} time={time} onChange={onChange}/>
    );
}