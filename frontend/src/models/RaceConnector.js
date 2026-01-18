import { RaceModel } from "./RaceModel";

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

  async fetchCompetition(competitionid) {

    try {

      if (competitionid){
        const response = await fetch(`${this.#baseurl}/competitions/${competitionid}`);
        if (!response.ok) throw new Error("Erreur lors du chargement de la compétition");
        const data = await response.json();
        console.log(data);
      }
      /*
      const response = await fetch(`${this.baseUrl}/all`);
      if (!response.ok) throw new Error("Erreur lors du chargement de la compétition");
      
      const data = await response.json();

      // 1. Reconstitution des Managers à partir du JSON (Hydratation)
      // On suppose que chaque Manager a une méthode statique .fromObject()
      const racers = RacerManager.fromObject(data.racers);
      const race = RaceManager.fromObject(data.race);
      
      // Pour le ranking, on peut avoir besoin de traiter le tableau reçu
      const ranking = RankingManager.fromObject(data.rankings);

      // 2. Création du modèle complet
      return new RaceModel(racers, undefined, undefined, race, ranking);
      */
      return new RaceModel();
    } catch (error) {
      console.error("RaceConnector Error:", error);
      throw error;
    }
  }

    /*
  async fetchFullModel() {
    try {
      const response = await fetch(`${this.baseUrl}/all`);
      if (!response.ok) throw new Error("Erreur lors du chargement de la compétition");
      
      const data = await response.json();

      // 1. Reconstitution des Managers à partir du JSON (Hydratation)
      // On suppose que chaque Manager a une méthode statique .fromObject()
      const racers = RacerManager.fromObject(data.racers);
      const race = RaceManager.fromObject(data.race);
      
      // Pour le ranking, on peut avoir besoin de traiter le tableau reçu
      const ranking = RankingManager.fromObject(data.rankings);

      // 2. Création du modèle complet
      return new RaceModel(racers, undefined, undefined, race, ranking);
    } catch (error) {
      console.error("RaceConnector Error:", error);
      throw error;
    }
  }

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