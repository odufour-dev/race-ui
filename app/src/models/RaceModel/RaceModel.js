// src/models/RaceModel.js
import React, { createContext, useState } from 'react';

import { EventSettings } from '../EventSettings/EventSettings';

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

  constructor( id = "",firstName = "",lastName = "", sex = "", age = "", category = "", club = "", uciID = "", ffcID = "", stageRank = [], annexRank = []) {
    this.id           = id;
    this.firstname_   = firstName;
    this.lastname_    = lastName;
    this.sex_         = sex;
    this.age_         = age;
    this.category_    = category;
    this.club_        = club;
    this.uciid_       = uciID;
    this.ffcid_       = ffcID;
    this.stagerank_   = stageRank;
    this.annexrank_   = annexRank;
  }

  get id(){return this.id_;}
  set id(value){this.id_ = value;}
  get firstName(){return this.firstname_;}
  set firstName(value){this.firstname_ = value;}
  get lastName(){return this.lastname_;}
  set lastName(value){this.lastname_ = value;}
  get sex(){return this.sex_;}
  set sex(value){this.sex_ = value;}
  get age(){return this.age_;}
  set age(value){this.age_ = value;}
  get category(){return this.category_;}
  set category(value){this.category_ = value;}
  get club(){return this.club_;}
  set club(value){this.club_ = value;}
  get uciID(){return this.uciid_;}
  set uciID(value){this.uciid_ = value;}
  get ffcID(){return this.ffcid_;}
  set ffcID(value){this.ffcid_ = value;}
  get StageRank(){return this.stagerank_;}
  set StageRank(value){this.stagerank_ = value;}
  get AnnexRank(){return this.annexrank_;}
  set AnnexRank(value){this.annexrank_ = value;}

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

  clone(){
    return new RacerManager(this.racers);
  }

  add(r) {

    const racer = new Racer();    
    Object.keys(r).map((k) => {
      if (k in racer){
        racer[k] = r[k];
      } else {
        console.log("Unknown racer field: ", k);
      }
    });    

    let data = this.clone();
    data.racers.push(racer);
    return data;
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

  edit(index, field, newValue) {
    if (index < 0 || index >= this.racers.length) return;
    if (!(field in this.racers[index])) return;
    let data = this.clone();
    data.racers[index][field] = newValue;
    return data;
  }

  remove(index){
    let data = this.clone();
    data.racers = data.racers.filter((_,idx) => idx !== index);
    return data;
  }

  generateIds() {
    let data = this.clone();
    data.racers = data.racers.map((racer, index) => {
      racer.id = index + 1;
      return racer;
    });
    return data;
  }

  shuffleRacers() {
    let data = this.clone();
    for (let i = data.racers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data.racers[i], data.racers[j]] = [data.racers[j], data.racers[i]];
    }
    return data;
  }

  updateRanking(stage, ranking){
    // ranking:
    //  - bib = Racer identifier
    //  - position
    //  - time
    //  - status : unknown, dnf, dns, abs, done
    const data = this.clone();
    data.racers = this.racers.map((racer) => {
      const racerrank = ranking.filter((rank) => racer.id === rank.bib);
      if (racerrank.length > 0){
        racer.StageRank[stage-1] = {
            position: racerrank[0].position,
            time: racerrank[0].time,
            status: racerrank[0].status
          };
      }
      return racer;
    });
    
    return data;
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

  constructor(racers = new RacerManager(), eventsettings = new EventSettings(), classifications = new Classification()) {
    this.racers_ = racers;
    this.classifications_ = classifications;
    this.eventsettings_ = eventsettings;
  }

  clone(){
    return new RaceModel(this.racers_, this.eventsettings_, this.classifications_);
  }

  get RaceManager(){
    return this.race_;
  }

  getRacerManager() {
    return this.racers_;
  }
  
  getEventSettings(){
    return this.eventsettings_;
  }

  updateEventSettings(eventsettings){
    let data = this.clone();
    data.eventsettings_ = eventsettings;
    return data;
  }

  updateRacerManager(racerManager) {
    let data = this.clone();
    data.racers_ = racerManager;
    return data;
  }

  updateStageMain(stage,ranking){
    let data = this.clone();
    data.racers_.updateRanking(stage,ranking);
    return data;
  }

  getClassifications(){
    return this.classifications_;
  }

};


