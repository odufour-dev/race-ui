import { render, screen, fireEvent } from '@testing-library/react';
import TimeRankingTable from './TimeRankingTable';

import { Time } from '../../../tools/Time/Time'

describe('TimeRankingTable', () => {

    it('Constructor - default', () => {
        
        const changeMock = jest.fn();
        const timefcn = new Time();
        const { container } = render(<TimeRankingTable data={[]} time={timefcn} onChange={changeMock} />);

        const ranks = container.querySelectorAll('.rank-cell');
        expect(ranks).toHaveLength(1);
        expect(ranks[0].textContent).toBe('1');

        const bibs = container.querySelectorAll('.bib-cell');
        expect(bibs).toHaveLength(1);
        expect(bibs[0].textContent).toBe('');

        const time = container.querySelectorAll('.time-cell');
        expect(time).toHaveLength(1);
        expect(time[0].textContent).toBe('');

        const delay = container.querySelectorAll('.delay-cell');
        expect(delay).toHaveLength(1);
        expect(delay[0].textContent).toBe('');

    });
/*
    it('Constructor - input data', () => {

        const changeMock = jest.fn();
        const timefcn = new Time();

        const data = [
            {id: 4, time: 124},
        ];
        
        const { container } = render(<TimeRankingTable data={data} time={timefcn} onChange={changeMock} />);

        const ranks = container.querySelectorAll('.rank-cell');
        expect(ranks).toHaveLength(2);
        expect(ranks[0].textContent).toBe('1');
        expect(ranks[1].textContent).toBe('2');

        const bibs = container.querySelectorAll('.bib-cell');
        expect(bibs).toHaveLength(2);
        expect(bibs[0].textContent).toBe('4');
        expect(bibs[1].textContent).toBe('');

        const time = container.querySelectorAll('.time-cell');
        expect(time).toHaveLength(2);
        expect(time[0].textContent).toBe('');
        expect(time[1].textContent).toBe('00:02:04');

        const delay = container.querySelectorAll('.delay-cell');
        expect(delay).toHaveLength(2);
        expect(delay[0].textContent).toBe('00:00:00');
        expect(delay[1].textContent).toBe('');

    });
*/
});
