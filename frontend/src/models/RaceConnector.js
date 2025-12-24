// src/services/RaceConnector.js
import { RaceModel } from '../models/RaceModel';
import { RacerManager } from '../models/Racers/RacerManager';
import { RaceManager } from '../models/Race/RaceManager';
import { RankingManager } from '../models/Ranking/RankingManager';
// Importez vos autres managers ici...

export class RaceConnector {
  constructor(competitionId) {
    this.competitionId = competitionId;
    this.baseUrl = `/api/v1/${competitionId}`;
  }

  /**
   * Récupère toutes les données et retourne une instance de RaceModel
   */
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

  /**
   * Sauvegarde les coureurs (Remplacement intégral)
   */
  async syncRacers(racerManager) {
    const data = racerManager.getAll().map(r => r.toObject());
    return this._post(`${this.baseUrl}/racers/sync`, { racers: data });
  }

  /**
   * Sauvegarde la configuration de la course
   */
  async syncRaceConfig(raceManager) {
    const data = raceManager.toObject();
    return this._post(`${this.baseUrl}/race-info/sync`, { config: data });
  }

  /**
   * Sauvegarde un classement spécifique
   */
  async syncRanking(stageId, type, rankingData) {
    return this._post(`${this.baseUrl}/rankings/sync`, {
      stage_id: stageId,
      type: type,
      data: rankingData
    });
  }

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