import { createNavigationFromJSON }     from "./Navigation/Navigation";
import { createRankingManagerFromJSON } from "./Ranking/RankingManager";
import { createRaceManagerFromJSON }    from "./Race/RaceManager";
import { createRacerManagerFromJSON }   from "./Racers/RacerManager";

export class RaceConnector {

  #baseurl
  #logger

  constructor(baseurl = "/api/v1", logger = console) {
    this.#baseurl = baseurl;
    this.#logger  = logger;
  }

  async fetchVersion(){

    try {
      const response = await fetch(`${this.#baseurl}/version`);
      if (!response.ok) throw new Error("Error while fetching the API version");
      return response.json();
    } catch (error) {
      this.#logger.error("RaceConnector Error:", error);
      throw error;
    }

  }

  async fetchListOfCompetitions(){

    try {
      const response = await fetch(`${this.#baseurl}/competitions`);
      if (!response.ok) throw new Error("Error while fetching the list of competitions");
      return response.json();
    } catch (error) {
      this.#logger.error("RaceConnector Error:", error);
      throw error;
    }

  }

  async createCompetition(compName){

    try {
      const response = await fetch(`${this.#baseurl}/competitions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: compName })
      });
      if (!response.ok) throw new Error("Error while creating the competition");
      return response.json();
    } catch (error) {
      this.#logger.error("RaceConnector Error:", error);
      throw error;
    }

  }

  async fetchConfiguration(competitionid){

    try {
      const response = await fetch(`${this.#baseurl}/competitions/${competitionid}/configuration`);
      if (!response.ok) throw new Error(`Error while fetching the configuration for ${competitionid}`);
      const data = await response.json();
      return createRaceManagerFromJSON(data);
    } catch (error) {
      this.#logger.error("RaceConnector Error:", error);
      throw error;
    }

  }

  async fetchConfigurationForStage(competitionid,stageid){

    try {
      const response = await fetch(`${this.#baseurl}/competitions/${competitionid}/configuration`);
      if (!response.ok) throw new Error(`Error while fetching the configuration for ${competitionid}`);
      const data = await response.json();
      return ("stages" in data) ? data.stages.filter(s => s.id == stageid)[0] : null;
    } catch (error) {
      this.#logger.error("RaceConnector Error:", error);
      throw error;
    }

  }

  async fetchNavigation(competitionid){

    try {
      const response = await fetch(`${this.#baseurl}/competitions/${competitionid}/configuration`);
      if (!response.ok) throw new Error(`Error while fetching the configuration for ${competitionid}`);
      const data = await response.json();
      return createNavigationFromJSON(data);
    } catch (error) {
      this.#logger.error("RaceConnector Error:", error);
      throw error;
    }

  }

  async fetchRacers(competitionid){

    try {
      const response = await fetch(`${this.#baseurl}/competitions/${competitionid}/racers`);
      if (!response.ok) throw new Error(`Error while fetching the racers for ${competitionid}`);
      const data = await response.json();
      return createRacerManagerFromJSON(data);
    } catch (error) {
      this.#logger.error("RaceConnector Error:", error);
      throw error;
    }

  }

  async fetchStageRanking(competitionid, stageId) {

    try {
      const response = await fetch(`${this.#baseurl}/competitions/${competitionid}/stages/${stageId}/rankings`);
      if (!response.ok) throw new Error("Error while fetching the stage ranking");
      const data = await response.json();
      return createRankingManagerFromJSON(data);
    } catch (error) {
      this.#logger.error("RaceConnector Error:", error);
      throw error;
    }

  }

  async fetchGeneralRanking(competitionid, stageId) {

    try {
      const response = await fetch(`${this.#baseurl}/competitions/${competitionid}/stages/${stageId}/general`);
      if (!response.ok) throw new Error("Error while fetching the general ranking");
      const data = await response.json();
      return data;
    } catch (error) {
      this.#logger.error("RaceConnector Error:", error);
      throw error;
    }

  }

  async saveConfiguration(competitionid, configData){

    try {
      const response = await fetch(`${this.#baseurl}/competitions/${competitionid}/configuration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData)
      });
      if (!response.ok) throw new Error("Error while saving the configuration");
      return await response.json();
    }
    catch (error) {
      this.#logger.error("RaceConnector Error:", error);
      throw error;
    }

  }

  async saveStageRanking(competitionid, stageId, rankingData) {

    try {
      const response = await fetch(`${this.#baseurl}/competitions/${competitionid}/stages/${stageId}/rankings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rankingData)
      });
      if (!response.ok) throw new Error("Error while saving the stage ranking");
      return await response.json();
    }
    catch (error) {
      this.#logger.error("RaceConnector Error:", error);
      throw error;
    }

  }
  
    /*
  async syncRacers(racerManager) {
    const data = racerManager.getAll().map(r => r.toObject());
    return this._post(`${this.baseUrl}/racers/sync`, { racers: data });
  }

  async syncRaceConfig(raceManager) {
    const data = raceManager.toObject();
    return this._post(`${this.baseUrl}/race-info/sync`, { config: data });
  }

  async syncRanking(stageId, type, rankingData) {
    return this._post(`${this.baseUrl}/rankings/sync`, {
      stage_id: stageId,
      type: type,
      data: rankingData
    });
  }
    */

  // Méthode utilitaire privée pour les appels POST
  async _post(url, body) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`Erreur lors de la sauvegarde sur ${url}`);
    return response.json();
  }
}