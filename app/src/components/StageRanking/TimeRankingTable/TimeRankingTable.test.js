import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TimeRankingTable from './TimeRankingTable';

import { Helper } from '../../../tools/Helper'

describe('TimeRankingTable - Unit tests', () => {

    it('Constructor - default', () => {
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={[]} helper={helper} onChange={changeMock} />);

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

    it('Constructor - input data', () => {

        const data = [
            {bib: 4, time: 124, position: 1},
        ];
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={data} helper={helper} onChange={changeMock} />);

        const ranks = container.querySelectorAll('.rank-cell');
        expect(ranks).toHaveLength(2);
        expect(ranks[0].textContent).toBe('1');
        expect(ranks[1].textContent).toBe('2');

        const bibs = container.querySelectorAll('.bib-input');
        expect(bibs).toHaveLength(2);
        expect(bibs[0]).toHaveValue('4');
        expect(bibs[1]).toHaveValue('');

        const time = container.querySelectorAll('.time-input');
        expect(time).toHaveLength(2);
        expect(time[0]).toHaveValue('00:02:04');
        expect(time[1]).toHaveValue('00:02:04');

        const delay = container.querySelectorAll('.delay-input');
        expect(delay).toHaveLength(2);
        expect(delay[0]).toHaveValue('00:00');
        expect(delay[1]).toHaveValue('00:00');

    });

    it('Constructor - multiple rows', () => {


        const data = [
            {bib: 4, time: 124, position: 1},
            {bib: 1, time: 150, position: 2},
            {bib: 2, time: 164, position: 3},
        ];
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={data} helper={helper} onChange={changeMock} />);

        const ranks = container.querySelectorAll('.rank-cell');
        expect(ranks).toHaveLength(4);
        expect(ranks[0].textContent).toBe('1');
        expect(ranks[1].textContent).toBe('2');
        expect(ranks[2].textContent).toBe('3');
        expect(ranks[3].textContent).toBe('4');

        const bibs = container.querySelectorAll('.bib-input');
        expect(bibs).toHaveLength(4);
        expect(bibs[0]).toHaveValue('4');
        expect(bibs[1]).toHaveValue('1');
        expect(bibs[2]).toHaveValue('2');
        expect(bibs[3]).toHaveValue('');

        const time = container.querySelectorAll('.time-input');
        expect(time).toHaveLength(4);
        expect(time[0]).toHaveValue('00:02:04');
        expect(time[1]).toHaveValue('00:02:30');
        expect(time[2]).toHaveValue('00:02:44');
        expect(time[3]).toHaveValue('00:02:44');

        const delay = container.querySelectorAll('.delay-input');
        expect(delay).toHaveLength(4);
        expect(delay[0]).toHaveValue('00:00');
        expect(delay[1]).toHaveValue('00:26');
        expect(delay[2]).toHaveValue('00:40');
        expect(delay[3]).toHaveValue('00:40');

    });

    it('Constructor - multiple rows -extra information', () => {


        const data = [
            {bib: 3, category: "Access",firstname: "René",      lastname: "TAUPE",      position: 1,    time: 120,  status: "done"},
            {bib: 1, category: "Open",  firstname: "Paul",      lastname: "POULE",      position: 2,    time: 125,  status: "done"},
            {bib: 5, category: "Access",firstname: "Jean",      lastname: "CROISSANT",  position: 3,    time: 180,  status: "done"},
        ];
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={data} helper={helper} onChange={changeMock} />);

        const ranks = container.querySelectorAll('.rank-cell');
        expect(ranks).toHaveLength(4);
        expect(ranks[0].textContent).toBe('1');
        expect(ranks[1].textContent).toBe('2');
        expect(ranks[2].textContent).toBe('3');
        expect(ranks[3].textContent).toBe('4');

        const bibs = container.querySelectorAll('.bib-input');
        expect(bibs).toHaveLength(4);
        expect(bibs[0]).toHaveValue('3');
        expect(bibs[1]).toHaveValue('1');
        expect(bibs[2]).toHaveValue('5');
        expect(bibs[3]).toHaveValue('');

        const time = container.querySelectorAll('.time-input');
        expect(time).toHaveLength(4);
        expect(time[0]).toHaveValue('00:02:00');
        expect(time[1]).toHaveValue('00:02:05');
        expect(time[2]).toHaveValue('00:03:00');
        expect(time[3]).toHaveValue('00:03:00');

        const delay = container.querySelectorAll('.delay-input');
        expect(delay).toHaveLength(4);
        expect(delay[0]).toHaveValue('00:00');
        expect(delay[1]).toHaveValue('00:05');
        expect(delay[2]).toHaveValue('01:00');
        expect(delay[3]).toHaveValue('01:00');

    });

});

describe('TimeRankingTable - User interactions', () => {

    it("type", () => {

        jest.useFakeTimers();

        const data = [
            {bib: 4, time: 124, position: 1},
            {bib: 1, time: 150, position: 2},
            {bib: 2, time: 164, position: 3},
        ];
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={data} helper={helper} onChange={changeMock} />);

        const bibs = container.querySelectorAll('.bib-input');

        act(() => {
            userEvent.type(bibs[0],'123');
            fireEvent.keyDown(bibs[0], { key: "Tab", code: "Tab" });            
        })        
        act(() => jest.advanceTimersByTime(1000));

        expect(bibs[0]).toHaveValue("123");
        expect(changeMock).toHaveBeenCalledTimes(1);

    });

});

describe('TimeRankingTable - Input interfactions', () => {

    it("1st rows - onChange", () => {

        const data = [
            {bib: 4, time: 124, position: 1},
            {bib: 1, time: 150, position: 2},
            {bib: 2, time: 164, position: 3},
        ];
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={data} helper={helper} onChange={changeMock} />);

        const bibs = container.querySelectorAll('.bib-input');

        fireEvent.change(bibs[0], { target: { value: "123" } });

        expect(bibs[0]).toHaveValue("123");

    });

    it("1st rows - onFocus", () => {

        const data = [
            {bib: 4, time: 124, position: 1},
            {bib: 1, time: 150, position: 2},
            {bib: 2, time: 164, position: 3},
        ];
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={data} helper={helper} onChange={changeMock} />);

        const bibs = container.querySelectorAll('.bib-input');

        fireEvent.focus(bibs[0]);

        expect(bibs[0].selectionStart).toBe(0);
        expect(bibs[0].selectionEnd).toBe(1);

    });

    it("1st rows - onBlur", () => {

        const data = [
            {bib: 4, time: 124, position: 1},
            {bib: 1, time: 150, position: 2},
            {bib: 2, time: 164, position: 3},
        ];
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={data} helper={helper} onChange={changeMock} />);

        const bibs = container.querySelectorAll('.bib-input');

        fireEvent.blur(bibs[0], { target: { value: "123" } });

    });

    it("1st rows - Tab", () => {

        const data = [
            {bib: 4, time: 124, position: 1},
            {bib: 1, time: 150, position: 2},
            {bib: 2, time: 164, position: 3},
        ];
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={data} helper={helper} onChange={changeMock} />);

        const bibs = container.querySelectorAll('.bib-input');

        fireEvent.keyDown(bibs[0], { key: "Tab", code: "Tab" });

    });

    it("1st rows - ArrowUp", () => {

        const data = [
            {bib: 4, time: 124, position: 1},
            {bib: 1, time: 150, position: 2},
            {bib: 2, time: 164, position: 3},
        ];
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={data} helper={helper} onChange={changeMock} />);

        const bibs = container.querySelectorAll('.bib-input');

        fireEvent.keyDown(bibs[0], { key: "ArrowUp", code: "ArrowUp" });

    });

    it("1st rows - ArrowLeft", () => {

        const data = [
            {bib: 4, time: 124, position: 1},
            {bib: 1, time: 150, position: 2},
            {bib: 2, time: 164, position: 3},
        ];
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={data} helper={helper} onChange={changeMock} />);

        const bibs = container.querySelectorAll('.bib-input');

        fireEvent.keyDown(bibs[0], { key: "ArrowLeft", code: "ArrowLeft" });

    });

    it("1st rows - ArrowRight", () => {

        const data = [
            {bib: 4, time: 124, position: 1},
            {bib: 1, time: 150, position: 2},
            {bib: 2, time: 164, position: 3},
        ];
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={data} helper={helper} onChange={changeMock} />);

        const bibs = container.querySelectorAll('.bib-input');

        fireEvent.keyDown(bibs[0], { key: "ArrowRight", code: "ArrowRight" });

    });

    it("1st rows - ArrowDown", () => {

        const data = [
            {bib: 4, time: 124, position: 1},
            {bib: 1, time: 150, position: 2},
            {bib: 2, time: 164, position: 3},
        ];
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={data} helper={helper} onChange={changeMock} />);

        const bibs = container.querySelectorAll('.bib-input');

        fireEvent.keyDown(bibs[0], { key: "ArrowDown", code: "ArrowDown" });

    });

    it("1st rows - Enter", () => {

        const data = [
            {bib: 4, time: 124, position: 1},
            {bib: 1, time: 150, position: 2},
            {bib: 2, time: 164, position: 3},
        ];
        
        const changeMock = jest.fn();
        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<TimeRankingTable data={data} helper={helper} onChange={changeMock} />);

        const bibs = container.querySelectorAll('.bib-input');

        fireEvent.keyDown(bibs[0], { key: "Enter", code: "Enter" });

    });

});
