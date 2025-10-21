// src/models/RaceModels.js
import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

class Classification {

  constructor(value) {
    this.value = value;
  }

  static LEVEL = [
    new Classification('elite'),
    new Classification('open'),
    new Classification('access'),
  ];

  static CATEGORY = [
    new Classification('pro'),
    new Classification('elite'),
    new Classification('open1'),
    new Classification('open2'),
    new Classification('open3'),
    new Classification('access1'),
    new Classification('access2'),
    new Classification('access3'),
    new Classification('access4'),
  ];

  static AGE = [
    new Classification('u19'),
    new Classification('u17'),
    new Classification('u15'),
    new Classification('u13'),
    new Classification('u11'),
    new Classification('u9'),
    new Classification('u7'),
  ];

  static findByValue(list, value) {
    return list.find(choice => choice.value === value);
  }

}

// 👤 Racer class
export class Racer {

  constructor() {
    this.id           = "";
    this.firstName    = "";
    this.lastName     = "";
    this.sex          = "";
    this.age          = "";
    this.category     = "";
    this.club         = "";
    this.uciID        = "";
    this.ffcID        = "";
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
    const racer = new Racer();    
    Object.keys(data).map((k) => {
      if (k in racer){
        racer[k] = data[k];
      }
    });    
    this.racers.push(racer);
  }

  clear(){
    this.racers = [];
  }

  getAllRacers() {
    return this.racers;
  }

  getFields() {
    return ['id', 'firstName', 'lastName', 'sex', 'age', 'category', 'subcategory', 'club', 'uciID', 'ffcID'];
  }
  get length() {
    return this.racers.length;
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

export class RaceModel {

  constructor() {
    this.racers_ = new RacerManager();
    this.classifications_ = new Classification();
  }

  getRacerManager() {
    return this.racers_;
  }

  getClassifications(){
    return this.classifications_;
  }

};

export const RaceModelContext = createContext();
export const RaceModelProvider = ({ children }) => {
  const [raceModel, setRaceModel] = useState(new RaceModel());

  // Pour forcer le re-render après mutation
  const forceUpdate = () => {
    setRaceModel(Object.assign(new RaceModel(), raceModel));
  };

  return (
    <RaceModelContext.Provider value={{ raceModel, forceUpdate }}>
      {children}
    </RaceModelContext.Provider>
  );
};
