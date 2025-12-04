import { render, screen, fireEvent } from '@testing-library/react';
import Grid from './Grid';

describe('Grid', () => {

    it('Constructor - default', () => {
        const { container } = render(<Grid />);
        const cells = container.querySelectorAll('.cell');
        expect(cells).toHaveLength(0);
    });

    it('3 x 5 Grid - all filled', () => {

        const bibs = [
            {bib: 1,    status: "unknown"},
            {bib: 2,    status: "dns"},
            {bib: 3,    status: "unknown"},
            {bib: 4,    status: "unknown"},
            {bib: 5,    status: "unknown"},
            {bib: 11,   status: "unknown"},
            {bib: 12,   status: "dnf"},
            {bib: 13,   status: "unknown"},
            {bib: 14,   status: "unknown"},
            {bib: 15,   status: "done"},
            {bib: 21,   status: "unknown"},
            {bib: 22,   status: "unknown"},
            {bib: 23,   status: "abs"},
            {bib: 24,   status: "unknown"},
            {bib: 25,   status: "unknown"},
        ];

        const changeMock = jest.fn();
        const { container } = render(<Grid data={ bibs } onChange={changeMock}/>);
        
        const rows = container.querySelectorAll('.row');
        expect(rows).toHaveLength(3);

        const row0 = rows[0].querySelectorAll('.cell');
        expect(row0).toHaveLength(5);
        expect(row0[0].textContent).toBe('1');
        expect(row0[0]).toHaveClass('status-unknown');
        expect(row0[1].textContent).toBe('2');
        expect(row0[1]).toHaveClass('status-dns');
        expect(row0[2].textContent).toBe('3');
        expect(row0[2]).toHaveClass('status-unknown');
        expect(row0[3].textContent).toBe('4');
        expect(row0[3]).toHaveClass('status-unknown');
        expect(row0[4].textContent).toBe('5');
        expect(row0[4]).toHaveClass('status-unknown');

        const row1 = rows[1].querySelectorAll('.cell');
        expect(row1).toHaveLength(5);
        expect(row1[0].textContent).toBe('11');
        expect(row1[0]).toHaveClass('status-unknown');
        expect(row1[1].textContent).toBe('12');
        expect(row1[1]).toHaveClass('status-dnf');
        expect(row1[2].textContent).toBe('13');
        expect(row1[2]).toHaveClass('status-unknown');
        expect(row1[3].textContent).toBe('14');
        expect(row1[3]).toHaveClass('status-unknown');
        expect(row1[4].textContent).toBe('15');
        expect(row1[4]).toHaveClass('status-done');

        const row2 = rows[2].querySelectorAll('.cell');
        expect(row2).toHaveLength(5);
        expect(row2[0].textContent).toBe('21');
        expect(row2[0]).toHaveClass('status-unknown');
        expect(row2[1].textContent).toBe('22');
        expect(row2[1]).toHaveClass('status-unknown');
        expect(row2[2].textContent).toBe('');
        expect(row2[2]).toHaveClass('status-abs');
        expect(row2[3].textContent).toBe('24');
        expect(row2[3]).toHaveClass('status-unknown');
        expect(row2[4].textContent).toBe('25');
        expect(row2[4]).toHaveClass('status-unknown');

    });

    it('3 x 5 Grid - missing bibs', () => {

        const bibs = [
            {bib: 1,    status: "unknown"},
            {bib: 2,    status: "dns"},
            {bib: 4,    status: "unknown"},
            {bib: 5,    status: "unknown"},
            {bib: 12,   status: "dnf"},
            {bib: 13,   status: "unknown"},
            {bib: 14,   status: "unknown"},
            {bib: 15,   status: "done"},
            {bib: 21,   status: "unknown"},
            {bib: 22,   status: "unknown"},
            {bib: 23,   status: "abs"},
            {bib: 24,   status: "unknown"},
        ];

        const changeMock = jest.fn();
        const { container } = render(<Grid data={ bibs } onChange={changeMock}/>);
        
        const rows = container.querySelectorAll('.row');
        expect(rows).toHaveLength(3);

        const row0 = rows[0].querySelectorAll('.cell');
        expect(row0).toHaveLength(5);
        expect(row0[0].textContent).toBe('1');
        expect(row0[0]).toHaveClass('status-unknown');
        expect(row0[1].textContent).toBe('2');
        expect(row0[1]).toHaveClass('status-dns');
        expect(row0[2].textContent).toBe('');
        expect(row0[2]).toHaveClass('status-none');
        expect(row0[3].textContent).toBe('4');
        expect(row0[3]).toHaveClass('status-unknown');
        expect(row0[4].textContent).toBe('5');
        expect(row0[4]).toHaveClass('status-unknown');

        const row1 = rows[1].querySelectorAll('.cell');
        expect(row1).toHaveLength(5);
        expect(row1[0].textContent).toBe('');
        expect(row1[0]).toHaveClass('status-none');
        expect(row1[1].textContent).toBe('12');
        expect(row1[1]).toHaveClass('status-dnf');
        expect(row1[2].textContent).toBe('13');
        expect(row1[2]).toHaveClass('status-unknown');
        expect(row1[3].textContent).toBe('14');
        expect(row1[3]).toHaveClass('status-unknown');
        expect(row1[4].textContent).toBe('15');
        expect(row1[4]).toHaveClass('status-done');

        const row2 = rows[2].querySelectorAll('.cell');
        expect(row2).toHaveLength(5);
        expect(row2[0].textContent).toBe('21');
        expect(row2[0]).toHaveClass('status-unknown');
        expect(row2[1].textContent).toBe('22');
        expect(row2[1]).toHaveClass('status-unknown');
        expect(row2[2].textContent).toBe('');
        expect(row2[2]).toHaveClass('status-abs');
        expect(row2[3].textContent).toBe('24');
        expect(row2[3]).toHaveClass('status-unknown');
        expect(row2[4].textContent).toBe('');
        expect(row2[4]).toHaveClass('status-none');

    });

    it('Click to change state from unknown to dnf', () => {

        const bibs = [
            {bib: 1,    status: "unknown"},
        ];

        const changeMock = jest.fn();
        const { container } = render(<Grid data={ bibs } onChange={changeMock}/>);
        
        const rows = container.querySelectorAll('.row');
        const row0 = rows[0].querySelectorAll('.cell');

        fireEvent.click(row0[0]);

        expect(changeMock).toHaveBeenCalledTimes(1);
        expect(row0[0]).toHaveClass('status-dnf');
        expect(changeMock.mock.calls[0][0]).toStrictEqual([{bib: 1, status: "dnf"}])

        
    });

    it('Click to change state from dnf to dns', () => {

        const bibs = [
            {bib: 1,    status: "dnf"},
        ];

        const changeMock = jest.fn();
        const { container } = render(<Grid data={ bibs } onChange={changeMock}/>);
        
        const rows = container.querySelectorAll('.row');
        const row0 = rows[0].querySelectorAll('.cell');

        fireEvent.click(row0[0]);

        expect(changeMock).toHaveBeenCalledTimes(1);
        expect(row0[0]).toHaveClass('status-dns');
        expect(changeMock.mock.calls[0][0]).toStrictEqual([{bib: 1, status: "dns"}])
        
    });

    it('Click to change state from dns to unknown', () => {

        const bibs = [
            {bib: 1,    status: "dns"},
        ];

        const changeMock = jest.fn();
        const { container } = render(<Grid data={ bibs } onChange={changeMock}/>);
        
        const rows = container.querySelectorAll('.row');
        const row0 = rows[0].querySelectorAll('.cell');

        fireEvent.click(row0[0]);

        expect(changeMock).toHaveBeenCalledTimes(1);
        expect(row0[0]).toHaveClass('status-unknown');
        expect(changeMock.mock.calls[0][0]).toStrictEqual([{bib: 1, status: "unknown"}])
        
    });

    it('Click NOT change state from done', () => {

        const bibs = [
            {bib: 1,    status: "done"},
        ];

        const changeMock = jest.fn();
        const { container } = render(<Grid data={ bibs } onChange={changeMock}/>);
        
        const rows = container.querySelectorAll('.row');
        const row0 = rows[0].querySelectorAll('.cell');

        fireEvent.click(row0[0]);

        expect(changeMock).not.toHaveBeenCalled();
        expect(row0[0]).toHaveClass('status-done');
        
    });

    it('Click NOT change state from none', () => {

        const bibs = [
            {bib: 1,    status: "none"},
        ];

        const changeMock = jest.fn();
        const { container } = render(<Grid data={ bibs } onChange={changeMock}/>);
        
        const rows = container.querySelectorAll('.row');
        const row0 = rows[0].querySelectorAll('.cell');

        fireEvent.click(row0[0]);

        expect(changeMock).not.toHaveBeenCalled();
        expect(row0[0]).toHaveClass('status-none');
        
    });

    it('Click NOT change state from abs', () => {

        const bibs = [
            {bib: 1,    status: "abs"},
        ];

        const changeMock = jest.fn();
        const { container } = render(<Grid data={ bibs } onChange={changeMock}/>);
        
        const rows = container.querySelectorAll('.row');
        const row0 = rows[0].querySelectorAll('.cell');

        fireEvent.click(row0[0]);

        expect(changeMock).not.toHaveBeenCalled();
        expect(row0[0]).toHaveClass('status-abs');
        
    });

    it('Click NOT change state from duplicate', () => {

        const bibs = [
            {bib: 1,    status: "duplicate"},
        ];

        const changeMock = jest.fn();
        const { container } = render(<Grid data={ bibs } onChange={changeMock}/>);
        
        const rows = container.querySelectorAll('.row');
        const row0 = rows[0].querySelectorAll('.cell');

        fireEvent.click(row0[0]);

        expect(changeMock).not.toHaveBeenCalled();
        expect(row0[0]).toHaveClass('status-duplicate');
        
    });

    it('3 x 5 Grid - use case with clicks', () => {

        const bibs = [
            {bib: 1,    status: "unknown"},
            {bib: 2,    status: "dns"},
            {bib: 4,    status: "unknown"},
            {bib: 5,    status: "unknown"},
            {bib: 12,   status: "dnf"},
            {bib: 13,   status: "unknown"},
            {bib: 14,   status: "unknown"},
            {bib: 15,   status: "done"},
            {bib: 21,   status: "unknown"},
            {bib: 22,   status: "unknown"},
            {bib: 23,   status: "abs"},
            {bib: 24,   status: "unknown"},
        ];

        const changeMock = jest.fn();
        const { container } = render(<Grid data={ bibs } onChange={changeMock}/>);
        
        const rows = container.querySelectorAll('.row');
        
        const row0 = rows[0].querySelectorAll('.cell');
        const row1 = rows[1].querySelectorAll('.cell');
        const row2 = rows[2].querySelectorAll('.cell');

        fireEvent.click(row0[3]);
        fireEvent.click(row0[2]);
        fireEvent.click(row1[1]);

        expect(changeMock).toHaveBeenCalledTimes(2);

        expect(changeMock.mock.calls[0][0]).toStrictEqual([
            {bib: 1,    status: "unknown"},
            {bib: 2,    status: "dns"},
            {bib: 4,    status: "dnf"},
            {bib: 5,    status: "unknown"},
            {bib: 12,   status: "dnf"},
            {bib: 13,   status: "unknown"},
            {bib: 14,   status: "unknown"},
            {bib: 15,   status: "done"},
            {bib: 21,   status: "unknown"},
            {bib: 22,   status: "unknown"},
            {bib: 23,   status: "abs"},
            {bib: 24,   status: "unknown"},
        ])

        expect(changeMock.mock.calls[1][0]).toStrictEqual([
            {bib: 1,    status: "unknown"},
            {bib: 2,    status: "dns"},
            {bib: 4,    status: "dnf"},
            {bib: 5,    status: "unknown"},
            {bib: 12,   status: "dns"},
            {bib: 13,   status: "unknown"},
            {bib: 14,   status: "unknown"},
            {bib: 15,   status: "done"},
            {bib: 21,   status: "unknown"},
            {bib: 22,   status: "unknown"},
            {bib: 23,   status: "abs"},
            {bib: 24,   status: "unknown"},
        ])

    });

});