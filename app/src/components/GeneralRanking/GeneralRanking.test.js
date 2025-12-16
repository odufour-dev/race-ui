import { render, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GeneralRanking from './GeneralRanking';

import { Helper } from '../../tools/Helper'

describe('General Ranking - Unit tests', () => {

    it('Constructor - default', () => {

        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<GeneralRanking data={[]} helper={helper} />);

        expect(container.querySelectorAll('table.general-table').length).toBe(1);
        expect(container.querySelectorAll('table.general-table thead tr th').length).toBe(11); // 1 position + 10 columns (bib, time, firstname, lastname, sex, club, category, age, ffcid, uciid)
        expect(container.querySelectorAll('table.general-table tbody tr').length).toBe(0); // no data

    });

    it('Constructor - display ranking', () => {

      const data = [
        {bib: 1, stage: 2, position: 5,   time: 6244, status: "done", firstname: "Paul",    lastname: "POULE",      sex: "M", club: "AC", category: "A", age: 30, ffcid: "L1", uciid: "U1" },
        {bib: 3, stage: 2, position: 5,   time: 6246, status: "done", firstname: "Jacques", lastname: "BEAUREGARD", sex: "M", club: "BC", category: "B", age: 25, ffcid: "L2", uciid: "U2" },
        {bib: 2, stage: 2, position: 4,   time: 6248, status: "done", firstname: "Pierre",  lastname: "PONCE",      sex: "M", club: "CC", category: "A", age: 28, ffcid: "L3", uciid: "U3" },
        {bib: 5, stage: 2, position: 2,   time: 5010, status: "dns",  firstname: "René",    lastname: "TAUPE",      sex: "M", club: "DC", category: "C", age: 35, ffcid: "L4", uciid: "U4" },
        {bib: 4, stage: 1, position: 0,   time: null, status: "dnf",  firstname: "Jean",    lastname: "CROISSANT",  sex: "M", club: "EC", category: "B", age: 32, ffcid: "L5", uciid: "U5" },
        ];

        const translatorMock = jest.fn();
        const helper = new Helper(translatorMock);
        const { container } = render(<GeneralRanking data={data} helper={helper} />);

        expect(container.querySelectorAll('table.general-table').length).toBe(1);
        expect(container.querySelectorAll('table.general-table thead tr th').length).toBe(11); // 1 position + 10 columns (bib, time, firstname, lastname, sex, club, category, age, ffcid, uciid)
        
        const rankrows = container.querySelectorAll('table.general-table tbody tr');
        expect(rankrows.length).toBe(3); // 3 ranked racers

        expect(rankrows[0].querySelectorAll('td.rank'       )[0].textContent).toBe("1"          );
        expect(rankrows[0].querySelectorAll('td.bib'        )[0].textContent).toBe("1"          );
        expect(rankrows[0].querySelectorAll('td.time'       )[0].textContent).toBe("01:44:04"   );
        expect(rankrows[0].querySelectorAll('td.firstname'  )[0].textContent).toBe("Paul"       );
        expect(rankrows[0].querySelectorAll('td.lastname'   )[0].textContent).toBe("POULE"      );
        expect(rankrows[0].querySelectorAll('td.sex'        )[0].textContent).toBe("M"          );
        expect(rankrows[0].querySelectorAll('td.club'       )[0].textContent).toBe("AC"         );
        expect(rankrows[0].querySelectorAll('td.category'   )[0].textContent).toBe("A"          );
        expect(rankrows[0].querySelectorAll('td.age'        )[0].textContent).toBe("30"         );
        expect(rankrows[0].querySelectorAll('td.ffcid'      )[0].textContent).toBe("L1"         );
        expect(rankrows[0].querySelectorAll('td.uciid'      )[0].textContent).toBe("U1"         );

        expect(rankrows[1].querySelectorAll('td.rank'       )[0].textContent).toBe("2"          );
        expect(rankrows[1].querySelectorAll('td.bib'        )[0].textContent).toBe("3"          );
        expect(rankrows[1].querySelectorAll('td.time'       )[0].textContent).toBe("01:44:06"   );
        expect(rankrows[1].querySelectorAll('td.firstname'  )[0].textContent).toBe("Jacques"    );
        expect(rankrows[1].querySelectorAll('td.lastname'   )[0].textContent).toBe("BEAUREGARD" );
        expect(rankrows[1].querySelectorAll('td.sex'        )[0].textContent).toBe("M"          );
        expect(rankrows[1].querySelectorAll('td.club'       )[0].textContent).toBe("BC"         );
        expect(rankrows[1].querySelectorAll('td.category'   )[0].textContent).toBe("B"          );
        expect(rankrows[1].querySelectorAll('td.age'        )[0].textContent).toBe("25"         );
        expect(rankrows[1].querySelectorAll('td.ffcid'      )[0].textContent).toBe("L2"         );
        expect(rankrows[1].querySelectorAll('td.uciid'      )[0].textContent).toBe("U2"         );

        expect(rankrows[2].querySelectorAll('td.rank'       )[0].textContent).toBe("3"          );
        expect(rankrows[2].querySelectorAll('td.bib'        )[0].textContent).toBe("2"          );
        expect(rankrows[2].querySelectorAll('td.time'       )[0].textContent).toBe("01:44:08"   );
        expect(rankrows[2].querySelectorAll('td.firstname'  )[0].textContent).toBe("Pierre"     );
        expect(rankrows[2].querySelectorAll('td.lastname'   )[0].textContent).toBe("PONCE"      );
        expect(rankrows[2].querySelectorAll('td.sex'        )[0].textContent).toBe("M"          );
        expect(rankrows[2].querySelectorAll('td.club'       )[0].textContent).toBe("CC"         );
        expect(rankrows[2].querySelectorAll('td.category'   )[0].textContent).toBe("A"          );
        expect(rankrows[2].querySelectorAll('td.age'        )[0].textContent).toBe("28"         );
        expect(rankrows[2].querySelectorAll('td.ffcid'      )[0].textContent).toBe("L3"         );
        expect(rankrows[2].querySelectorAll('td.uciid'      )[0].textContent).toBe("U3"         ); 
        
        expect(container.querySelectorAll('table.unranked-table').length).toBe(1);
        expect(container.querySelectorAll('table.unranked-table thead tr th').length).toBe(11); // 11 columns (bib, status, stage, firstname, lastname, sex, club, category, age, ffcid, uciid)
        
        const unrankrows = container.querySelectorAll('table.unranked-table tbody tr');
        expect(unrankrows.length).toBe(2); // 2 ranked racers

        expect(unrankrows[0].querySelectorAll('td.bib'        )[0].textContent).toBe("5"          );
        expect(unrankrows[0].querySelectorAll('td.status'     )[0].textContent).toBe("dns"        );
        expect(unrankrows[0].querySelectorAll('td.stage'      )[0].textContent).toBe("2"          );
        expect(unrankrows[0].querySelectorAll('td.firstname'  )[0].textContent).toBe("René"       );
        expect(unrankrows[0].querySelectorAll('td.lastname'   )[0].textContent).toBe("TAUPE"      );
        expect(unrankrows[0].querySelectorAll('td.sex'        )[0].textContent).toBe("M"          );
        expect(unrankrows[0].querySelectorAll('td.club'       )[0].textContent).toBe("DC"         );
        expect(unrankrows[0].querySelectorAll('td.category'   )[0].textContent).toBe("C"          );
        expect(unrankrows[0].querySelectorAll('td.age'        )[0].textContent).toBe("35"         );
        expect(unrankrows[0].querySelectorAll('td.ffcid'      )[0].textContent).toBe("L4"         );
        expect(unrankrows[0].querySelectorAll('td.uciid'      )[0].textContent).toBe("U4"         );

        expect(unrankrows[1].querySelectorAll('td.bib'        )[0].textContent).toBe("4"          );
        expect(unrankrows[1].querySelectorAll('td.status'     )[0].textContent).toBe("dnf"        );
        expect(unrankrows[1].querySelectorAll('td.stage'      )[0].textContent).toBe("1"          );
        expect(unrankrows[1].querySelectorAll('td.firstname'  )[0].textContent).toBe("Jean"       );
        expect(unrankrows[1].querySelectorAll('td.lastname'   )[0].textContent).toBe("CROISSANT"  );
        expect(unrankrows[1].querySelectorAll('td.sex'        )[0].textContent).toBe("M"          );
        expect(unrankrows[1].querySelectorAll('td.club'       )[0].textContent).toBe("EC"         );
        expect(unrankrows[1].querySelectorAll('td.category'   )[0].textContent).toBe("B"          );
        expect(unrankrows[1].querySelectorAll('td.age'        )[0].textContent).toBe("32"         );
        expect(unrankrows[1].querySelectorAll('td.ffcid'      )[0].textContent).toBe("L5"         );
        expect(unrankrows[1].querySelectorAll('td.uciid'      )[0].textContent).toBe("U5"         );

    });

});