
import Route from "./route.js"

export default class GeneralRanking extends Route {

    register(router){
        router.get( '/competitions/:id/stages/:stageId/general',  (req,res) => this.#get(req,res));
    }

    async #get(req,res){

        const compid  = req.params.id;
        const stageNumber = parseInt(req.params.stageId, 10);
        const order = req.query.order;

        try {

            const competition = await this._connector.getCompetition(compid);
            if (!competition){return res.status(404).json({status: "notfound", message: "Database not found for " + compid});}
            
            const groupresults = {};

            for (let istage = 1; istage <= stageNumber; istage++) {
                const stageresults = await this._processor.extractRankingForStage(competition.database, competition.raceId, istage);
                
                stageresults.forEach(result => {
                    // Calcul du temps net pour CETTE étape
                    const stageTimeNet = (result.time || 0); // FIXME (od : Handle the bonifications properly) - (result.bonification || 0);

                    if (!groupresults[result.bib]) {
                        // Initialisation propre au premier passage du coureur
                        groupresults[result.bib] = {
                            ...result,
                            time: stageTimeNet, // On commence avec le temps net de la 1ère étape
                            cumulated: result.rank,
                            stage: istage
                        };
                    } else if (result.status !== "unknown" && result.status !== "abs") {
                        // Mise à jour pour les étapes suivantes
                        groupresults[result.bib].time      += stageTimeNet;
                        groupresults[result.bib].cumulated += result.rank;
                        groupresults[result.bib].rank       = result.rank;
                        groupresults[result.bib].millis    += result.millis;
                        groupresults[result.bib].status     = result.status;
                        groupresults[result.bib].stage      = istage;
                    }
                    //if (result.bib == 161){console.log(groupresults[result.bib])}
                });
            }

            let results = Object.values(groupresults).sort((a, b) => {
                // If final status is not done, consider that racer does not finish => go to the end
                // Sort non-finisher based on the last recorded stage (higher first)
                if (a.status == "done" && b.status != "done"){return -1;}
                else if (a.status != "done" && b.status == "done"){return 1;}
                else if (a.stage != b.stage){return b.stage - a.stage;}
                // Finishers (status == done)
                //  1. Compare the time (if different)
                //  2. Compare the milliseconds (if different)
                //  3. Compare the cumulated positions
                //  4. Compare the last position
                else if (a.time != b.time){return a.time - b.time;}
                else if (a.millis != b.millis){return a.millis - b.millis;}
                else if (a.cumulated != b.cumulated){return a.cumulated - b.cumulated;}
                else {return a.last - b.last;}
            });
            results = results.map((r,i) => ({...r, position: i+1}));

            if (order && order == "bib"){
                results = results.sort((a, b) => a.bib - b.bib);
            }

            const leader = Object.values(groupresults)
                    .filter(r => r.status === "done")
                    .sort((a, b) => a.time - b.time)[0];
            const leadertime = leader.time;

            res.status(200).json({
                stage: stageNumber,
                results: results.map(r => ({...r, time: this._time.formatHMS(r.time), delay: this._time.formatHMS(r.time - leadertime)}))
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

}