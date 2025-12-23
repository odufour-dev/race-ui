
import { Time } from "./Time"

describe('Time', () => {

    it('parseHMS - null', () => {
        const sut = new Time();
        const actual = sut.parseHMS(null);
        expect(actual).toBeNull();
    })

    it('parseHMS - seconds only', () => {
        const sut = new Time();
        const actual = sut.parseHMS("2");
        expect(actual).toEqual(2);
    })

    it('parseHMS - minutes/seconds', () => {
        const sut = new Time();
        const actual = sut.parseHMS("10:02");
        expect(actual).toEqual(602);
    })

    it('parseHMS - hour/minutes/seconds', () => {
        const sut = new Time();
        const actual = sut.parseHMS("02:10:02");
        expect(actual).toEqual(7802);
    })

    it('parseMS - null', () => {
        const sut = new Time();
        const actual = sut.parseMS(null);
        expect(actual).toBeNull();
    })

    it('parseMS - seconds only', () => {
        const sut = new Time();
        const actual = sut.parseMS("2");
        expect(actual).toEqual(2);
    })

    it('parseMS - minutes/seconds', () => {
        const sut = new Time();
        const actual = sut.parseMS("10:02");
        expect(actual).toEqual(602);
    })

    it('formatHMS - seconds only', () => {
        const sut = new Time();
        const actual = sut.formatHMS(2);
        expect(actual).toEqual("00:00:02");
    })

    it('formatHMS - minutes/seconds', () => {
        const sut = new Time();
        const actual = sut.formatHMS(602);
        expect(actual).toEqual("00:10:02");
    })

    it('formatHMS - hour/minutes/seconds', () => {
        const sut = new Time();
        const actual = sut.formatHMS(7802);
        expect(actual).toEqual("02:10:02");
    })

    it('formatMS - seconds only', () => {
        const sut = new Time();
        const actual = sut.formatMS(2);
        expect(actual).toEqual("00:02");
    })

    it('formatMS - minutes/seconds', () => {
        const sut = new Time();
        const actual = sut.formatMS(602);
        expect(actual).toEqual("10:02");
    })

});