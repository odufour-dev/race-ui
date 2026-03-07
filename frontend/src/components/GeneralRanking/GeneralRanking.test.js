import { render, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GeneralRanking from './GeneralRanking';

import { Helper } from '../../tools/Helper'

describe('General Ranking - Unit tests', () => {

    it('Constructor - default', () => {

        const connectorMock  = {fetchGeneralRanking: jest.fn().mockReturnValue({then: jest.fn().mockReturnValue({catch: jest.fn()})})};    
        const translatorMock = jest.fn();        
        const helper = new Helper(translatorMock);

        const { container } = render(<GeneralRanking competitionid={""} stage={1} connector={connectorMock} helper={helper} />);

        expect(container.querySelectorAll('table.general-table').length).toBe(1);
        expect(container.querySelectorAll('table.general-table thead tr th').length).toBe(15); // 1 position + 14 columns (bib, time, delay, firstname, lastname, sex, club, category, age, ffcid, uciid, millisecs, cumposition, lastposition)
        expect(container.querySelectorAll('table.general-table tbody tr').length).toBe(0); // no data

    });

});