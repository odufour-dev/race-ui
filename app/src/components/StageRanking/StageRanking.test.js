
import { render, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import StageRanking from './StageRanking';

import { Helper } from '../../tools/Helper'

describe('Stage Ranking - Unit tests', () => {

    it('Constructor - default', () => {

        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<StageRanking data={[]} helper={helper} onChange={changeMock} />);

        const gridCells = container.querySelectorAll('.grid .row .cell');
        expect(gridCells).toHaveLength(0);

        const rankrows = container.querySelectorAll('.rank-row');
        expect(rankrows).toHaveLength(1);

        const ranks = container.querySelectorAll('.rank-cell');
        expect(ranks).toHaveLength(1);
        expect(ranks[0].textContent).toBe('1');

        const bibs = container.querySelectorAll('.bib-cell');
        expect(bibs).toHaveLength(1);
        expect(bibs[0].textContent).toBe('');

        const times = container.querySelectorAll('.time-cell');
        expect(times).toHaveLength(1);
        expect(times[0].textContent).toBe('');

        const delays = container.querySelectorAll('.delay-cell');
        expect(delays).toHaveLength(1);
        expect(delays[0].textContent).toBe('');

    });

    it('No ranking', () => {

        const data = [
            {bib: 1, category: "Open",  firstname: "Paul",      lastname: "POULE",      position: null, time: null, status: "unknown"},
            {bib: 2, category: "Open",  firstname: "Jacques",   lastname: "BEAUREGARD", position: null, time: null, status: "unknown"},
            {bib: 3, category: "Access",firstname: "René",      lastname: "TAUPE",      position: null, time: null, status: "unknown"},
            {bib: 4, category: "Open",  firstname: "Pierre",    lastname: "PONCE",      position: null, time: null, status: "unknown"},
            {bib: 5, category: "Access",firstname: "Jean",      lastname: "CROISSANT",  position: null, time: null, status: "unknown"},
        ];

        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<StageRanking data={data} helper={helper} onChange={changeMock} />);

        const gridCells = container.querySelectorAll('.grid .row .cell');
        expect(gridCells).toHaveLength(5);
        expect(gridCells[0].textContent).toBe('1')
        expect(gridCells[0]).toHaveClass("status-unknown")
        expect(gridCells[1].textContent).toBe('2')
        expect(gridCells[1]).toHaveClass("status-unknown")
        expect(gridCells[2].textContent).toBe('3')
        expect(gridCells[2]).toHaveClass("status-unknown")
        expect(gridCells[3].textContent).toBe('4')
        expect(gridCells[3]).toHaveClass("status-unknown")
        expect(gridCells[4].textContent).toBe('5')
        expect(gridCells[4]).toHaveClass("status-unknown")

        const rankrows = container.querySelectorAll('.rank-row');
        expect(rankrows).toHaveLength(1);

        const ranks = container.querySelectorAll('.rank-cell');
        expect(ranks).toHaveLength(1);
        expect(ranks[0].textContent).toBe('1');

        const bibs = container.querySelectorAll('.bib-cell input');
        expect(bibs).toHaveLength(1);
        expect(bibs[0]).toHaveValue('');

        const times = container.querySelectorAll('.time-cell input');
        expect(times).toHaveLength(1);
        expect(times[0]).toHaveValue('');

        const delays = container.querySelectorAll('.delay-cell input');
        expect(delays).toHaveLength(1);
        expect(delays[0]).toHaveValue('');

    });

    it('Full ranking', () => {

        const data = [
            {bib: 1, category: "Open",  firstname: "Paul",      lastname: "POULE",      position: 2,    time: 125,  status: "done"},
            {bib: 2, category: "Open",  firstname: "Jacques",   lastname: "BEAUREGARD", position: null, time: null, status: "dnf"},
            {bib: 3, category: "Access",firstname: "René",      lastname: "TAUPE",      position: 1,    time: 120,  status: "done"},
            {bib: 4, category: "Open",  firstname: "Pierre",    lastname: "PONCE",      position: null, time: null, status: "abs"},
            {bib: 5, category: "Access",firstname: "Jean",      lastname: "CROISSANT",  position: 3,    time: 180,  status: "done"},
        ];

        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<StageRanking data={data} helper={helper} onChange={changeMock} />);

        const gridCells = container.querySelectorAll('.grid .row .cell');
        expect(gridCells).toHaveLength(5);
        expect(gridCells[0].textContent).toBe('1')
        expect(gridCells[0]).toHaveClass("status-done")
        expect(gridCells[1].textContent).toBe('2')
        expect(gridCells[1]).toHaveClass("status-dnf")
        expect(gridCells[2].textContent).toBe('3')
        expect(gridCells[2]).toHaveClass("status-done")
        expect(gridCells[3].textContent).toBe('')
        expect(gridCells[3]).toHaveClass("status-abs")
        expect(gridCells[4].textContent).toBe('5')
        expect(gridCells[4]).toHaveClass("status-done")

        const rankrows = container.querySelectorAll('.rank-row');
        expect(rankrows).toHaveLength(4);

        const ranks = container.querySelectorAll('.rank-cell');
        expect(ranks).toHaveLength(4);
        expect(ranks[0].textContent).toBe('1');
        expect(ranks[1].textContent).toBe('2');
        expect(ranks[2].textContent).toBe('3');
        expect(ranks[3].textContent).toBe('4');

        const bibs = container.querySelectorAll('.bib-cell input');
        expect(bibs).toHaveLength(4);
        expect(bibs[0]).toHaveValue('3');
        expect(bibs[1]).toHaveValue('1');
        expect(bibs[2]).toHaveValue('5');
        expect(bibs[3]).toHaveValue('');

        const times = container.querySelectorAll('.time-cell input');
        expect(times).toHaveLength(4);
        expect(times[0]).toHaveValue('00:02:00');
        expect(times[1]).toHaveValue('00:02:05');
        expect(times[2]).toHaveValue('00:03:00');
        expect(times[3]).toHaveValue('00:03:00');

        const delays = container.querySelectorAll('.delay-cell input');
        expect(delays).toHaveLength(4);
        expect(delays[0]).toHaveValue('00:00');
        expect(delays[1]).toHaveValue('00:05');
        expect(delays[2]).toHaveValue('01:00');
        expect(delays[3]).toHaveValue('01:00');

    });

});

describe('Stage Ranking - Use cases', () => {

    it('Fill ranking', async () => {

        jest.useFakeTimers();

        const data = [
            {bib: 1, category: "Open",  firstname: "Paul",      lastname: "POULE",      position: null, time: null, status: "unknown"},
            {bib: 2, category: "Open",  firstname: "Jacques",   lastname: "BEAUREGARD", position: null, time: null, status: "unknown"},
            {bib: 3, category: "Access",firstname: "René",      lastname: "TAUPE",      position: null, time: null, status: "unknown"},
            {bib: 4, category: "Open",  firstname: "Pierre",    lastname: "PONCE",      position: null, time: null, status: "unknown"},
            {bib: 5, category: "Access",firstname: "Jean",      lastname: "CROISSANT",  position: null, time: null, status: "unknown"},
        ];

        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<StageRanking data={data} helper={helper} onChange={changeMock} />);

        const gridCells = container.querySelectorAll('.grid .row .cell');
        expect(gridCells).toHaveLength(5);
        expect(gridCells[0].textContent).toBe('1')
        expect(gridCells[0]).toHaveClass("status-unknown")
        expect(gridCells[1].textContent).toBe('2')
        expect(gridCells[1]).toHaveClass("status-unknown")
        expect(gridCells[2].textContent).toBe('3')
        expect(gridCells[2]).toHaveClass("status-unknown")
        expect(gridCells[3].textContent).toBe('4')
        expect(gridCells[3]).toHaveClass("status-unknown")
        expect(gridCells[4].textContent).toBe('5')
        expect(gridCells[4]).toHaveClass("status-unknown")

        // Enter the first racer
        const bibs = container.querySelectorAll('.bib-cell input');
        await act(async() => {
            await userEvent.type(bibs[0],'3');
            fireEvent.keyDown(bibs[0], { key: "Tab", code: "Tab" });
        }) 
        expect(bibs[0]).toHaveValue('3');
        await act(async() => jest.advanceTimersByTime(1000));
        expect(gridCells[2]).toHaveClass("status-done");

    });

    it('Change status', async () => {

        jest.useFakeTimers();

        const data = [
            {bib: 1, category: "Open",  firstname: "Paul",      lastname: "POULE",      position: null, time: null, status: "unknown"},
            {bib: 2, category: "Open",  firstname: "Jacques",   lastname: "BEAUREGARD", position: null, time: null, status: "unknown"},
            {bib: 3, category: "Access",firstname: "René",      lastname: "TAUPE",      position: null, time: null, status: "unknown"},
            {bib: 4, category: "Open",  firstname: "Pierre",    lastname: "PONCE",      position: null, time: null, status: "unknown"},
            {bib: 5, category: "Access",firstname: "Jean",      lastname: "CROISSANT",  position: null, time: null, status: "unknown"},
        ];

        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<StageRanking data={data} helper={helper} onChange={changeMock} />);

        const gridCells = container.querySelectorAll('.grid .row .cell');
        expect(gridCells).toHaveLength(5);
        expect(gridCells[0].textContent).toBe('1')
        expect(gridCells[0]).toHaveClass("status-unknown")
        expect(gridCells[1].textContent).toBe('2')
        expect(gridCells[1]).toHaveClass("status-unknown")
        expect(gridCells[2].textContent).toBe('3')
        expect(gridCells[2]).toHaveClass("status-unknown")
        expect(gridCells[3].textContent).toBe('4')
        expect(gridCells[3]).toHaveClass("status-unknown")
        expect(gridCells[4].textContent).toBe('5')
        expect(gridCells[4]).toHaveClass("status-unknown")

        await act(async() => {
            await userEvent.click(gridCells[1]);
        }) 
        expect(gridCells[1]).toHaveClass("status-dnf");

        await act(async() => {
            await userEvent.click(gridCells[1]);
        }) 
        expect(gridCells[1]).toHaveClass("status-dns");

        await act(async() => {
            await userEvent.click(gridCells[1]);
        }) 
        expect(gridCells[1]).toHaveClass("status-unknown");

    });

    it('Status done cannot be changed by click', async () => {

        jest.useFakeTimers();

        const data = [
            {bib: 1, category: "Open",  firstname: "Paul",      lastname: "POULE",      position: null, time: null, status: "unknown"},
            {bib: 2, category: "Open",  firstname: "Jacques",   lastname: "BEAUREGARD", position: null, time: null, status: "unknown"},
            {bib: 3, category: "Access",firstname: "René",      lastname: "TAUPE",      position: 1,    time: 1200, status: "done"},
            {bib: 4, category: "Open",  firstname: "Pierre",    lastname: "PONCE",      position: null, time: null, status: "unknown"},
            {bib: 5, category: "Access",firstname: "Jean",      lastname: "CROISSANT",  position: null, time: null, status: "unknown"},
        ];

        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<StageRanking data={data} helper={helper} onChange={changeMock} />);

        const gridCells = container.querySelectorAll('.grid .row .cell');
        expect(gridCells).toHaveLength(5);
        expect(gridCells[0].textContent).toBe('1')
        expect(gridCells[0]).toHaveClass("status-unknown")
        expect(gridCells[1].textContent).toBe('2')
        expect(gridCells[1]).toHaveClass("status-unknown")
        expect(gridCells[2].textContent).toBe('3')
        expect(gridCells[2]).toHaveClass("status-done")
        expect(gridCells[3].textContent).toBe('4')
        expect(gridCells[3]).toHaveClass("status-unknown")
        expect(gridCells[4].textContent).toBe('5')
        expect(gridCells[4]).toHaveClass("status-unknown")

        await act(async() => {
            await userEvent.click(gridCells[2]);
        }) 
        expect(gridCells[2]).toHaveClass("status-done");

    });

});