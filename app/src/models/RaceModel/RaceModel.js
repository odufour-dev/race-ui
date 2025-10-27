// src/models/RaceModel.js
import React, { createContext, useState } from 'react';

class Classification {

  get Level(){
    return [
      'elite',
      'open',
      'access',
    ];
  }

  get Category(){
    return [
      '',
      'pro',
      'elite',
      'open1',
      'open2',
      'open3',
      'access1',
      'access2',
      'access3',
      'access4',
    ];
  }

  get Age(){
    return [
      'senior',
      'master',
      'veteran',
      'u23',
      'u19',
      'u17',
      'u15',
      'u13',
      'u11',
      'u9',
      'u7',
    ];
  }

  get Sex(){
    return [
      'H',
      'F',
    ];
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

  constructor(racers = []) {
    this.racers = racers;
  }

  add(data) {
    const racer = new Racer();    
    Object.keys(data).map((k) => {
      if (k in racer){
        racer[k] = data[k];
      }
    });    
    this.racers.push(racer);
    return new RacerManager(this.racers);
  }

  clear(){
    this.racers = [];
  }

  getAll() {
    return this.racers;
  }

  getFields() {
    return ['id', 'firstName', 'lastName', 'sex', 'age', 'category', 'subcategory', 'club', 'uciID', 'ffcID'];
  }
  editRacer(index, field, newValue) {
    if (index < 0 || index >= this.racers.length) return;
    if (!(field in this.racers[index])) return;
    this.racers[index][field] = newValue;
    return new RacerManager(this.racers);
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
