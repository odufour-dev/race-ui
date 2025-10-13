// src/models/RaceModels.js

// 👤 Racer class
export class Racer {

  constructor(id, firstName, lastName, sex, age, category, subcategory, club, uciID, ffcID) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.sex = sex;
    this.age = age;
    this.category = category;
    this.subcategory = subcategory;
    this.club = club;
    this.uciID = uciID;
    this.ffcID = ffcID;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

}

// 🏁 RaceEvent class
export class RaceEvent {

  constructor(id, name, location, date, numberOfLaps, lapDistanceKm, numberOfLegs) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.date = date;
    this.numberOfLaps = numberOfLaps;
    this.lapDistanceKm = lapDistanceKm;
    this.numberOfLegs = numberOfLegs;
  }

  get totalDistanceKm() {
    return this.numberOfLaps * this.lapDistanceKm;
  }
}

// ⏱️ TimingRecord class
export class TimingRecord {
  constructor(personId, raceId, legTimes = [], lapTimes = []) {
    this.personId = personId;
    this.raceId = raceId;
    this.legTimes = legTimes;
    this.lapTimes = lapTimes;
  }

  get totalTime() {
    return [...this.legTimes, ...this.lapTimes].reduce((sum, t) => sum + t, 0);
  }
}

class RacerManager {

  constructor() {
    this.racers = [];
  }

  add(data) {
    const racer = new Racer(
      data.id,
      data.firstName,
      data.lastName,
      data.category,
      data.subcategory,
      data.club,
      data.uciID,
      data.ffcID
    );
    this.racers.push(racer);
  }

  getFields() {
    return ['id', 'firstName', 'lastName', 'sex', 'age', 'category', 'subcategory', 'club', 'uciID', 'ffcID'];
  }

}

// 🧠 RaceManager class
export class RaceManager {

  constructor() {
    this.racers = [];
    this.races = [];
    this.timings = [];
  }

  addPerson(racer) {
    this.racers.push(racer);
  }

  addRace(race) {
    this.races.push(race);
  }

  addTimingRecord(record) {
    this.timings.push(record);
  }

  getPersonById(id) {
    return this.people.find(p => p.id === id);
  }

  getRaceById(id) {
    return this.races.find(r => r.id === id);
  }

  getRankings(raceId) {
    return this.timings
      .filter(record => record.raceId === raceId)
      .map(record => {
        const person = this.getPersonById(record.personId);
        return {
          name: person.fullName,
          category: person.category,
          totalTime: record.totalTime
        };
      })
      .sort((a, b) => a.totalTime - b.totalTime);
  }
}

export class RaceDataModel {

  constructor() {
    this.racers = new RacerManager();
  }

  getRacerManager() {return this.racers;}

}

/*
// Example: src/components/RaceDashboard.jsx
import React, { useEffect } from 'react';
import { RaceManager, Person, RaceEvent, TimingRecord } from '../models/RaceModels';

const manager = new RaceManager();

manager.addPerson(new Person("P001", "Alice", "Dupont", "Pro", "SpeedCorp", "FR123456789"));
manager.addRace(new RaceEvent("R001", "Hyères Grand Prix", "Hyères", "2025-10-15", 5, 3.2, 2));
manager.addTimingRecord(new TimingRecord("P001", "R001", [360, 355], [72, 70, 73, 71, 69]));

export default function RaceDashboard() {
  useEffect(() => {
    const rankings = manager.getRankings("R001");
    console.log("Rankings:", rankings);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Race Dashboard</h2>
      {Render rankings or race data here }
    </div>
  );
}
*/