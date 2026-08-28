import Route from "./route.js"

export default class TeamRanking extends Route {

    register(router){
        router.get( '/competitions/:id/stages/:stageId/teams',  (req,res) => this.#get(req,res));
    }

    async #get(req,res){

        const compid = req.params.id;
        const stageNumber = parseInt(req.params.stageId, 10);
        const nracers = req.query.nracers ?? 3;

        try {

            const competition = await this._connector.getCompetition(compid);
            if (!competition){return res.status(404).json({status: "notfound", message: "Database not found for " + compid});}

            const stageresults = await this._processor.extractRankingForStage(competition.database, competition.raceId, stageNumber);

            // Group all the valid results (done) by team
            const groupresults = stageresults
                .filter(r => r.status === "done")
                .sort((a,b) => {
                    if (a.time == b.time){return a.rank - b.rank}
                    else {return a.time - b.time}
                })
                .reduce((acc,res) => {
                    if (!acc[res.team]) {
                        acc[res.team] = {
                            stage:  stageNumber,
                            name:   res.team,
                            racers: [{bib: res.bib, rank: res.rank, time: res.time}]
                        };
                    } else {
                        acc[res.team].racers.push({bib: res.bib, rank: res.rank, time: res.time});
                    }
                    return acc;
                }, {});

            let results = Object.values(groupresults)
                .filter(r => r.racers.length >= nracers) // Exclude the teams with less than N racers
                .map(res => ({...res, time:res.racers.reduce((acc,r) => acc += r.time)}), 0) // TODO (odufour)
                .sort((a, b) => {
                    return a.time - b.time
                });
            results = results.map((r,i) => ({...r, position: i+1}));

            res.status(200).json({
                stage: stageNumber,
                results: results.map(r => ({...r, time: this._time.formatHMS(r.time), delay: this._time.formatHMS(r.time - results[0].time)}))
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

}