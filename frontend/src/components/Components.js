
import EventSettings      from './EventSettings/EventSettings';
//import ExcelReader        from './ExcelReader/ExcelReader';
import GeneralRanking     from './GeneralRanking/GeneralRanking';
import RegistrationTable  from './RegistrationTable/RegistrationTable';
import StageConfiguration from './StageConfiguration/StageConfiguration';
import StageRanking       from './StageRanking/StageRanking';
import SynchronizationBar from './Synchronization/SynchronizationBar';

class Component {

    #id
    #component
    #connector
    #helper

    constructor(helper,connector,id,component){
        this.#id        = id;
        this.#component = component;
        this.#connector = connector;
        this.#helper    = helper;
    }

    get id(){return this.#id;}

    render(competitionid){
        return this.#component(this.#helper,this.#connector,competitionid);
    }
    
}

class Components {

    #components
    #connector
    #helper

    constructor(helper,connector){
        this.#helper        = helper;
        this.#connector     = connector;
        this.#components    = [];
    }

    add(id,component){
        this.#components.push(new Component(this.#helper,this.#connector,id,component));
    }

    renderById(id,competitionid){
        const comp = this.#components.find((c) => c.id === id);
        if (comp){
            return comp.render(competitionid);
        } else {
            return (<div style={{ padding: '1rem', color: '#334155' }}>Cannot find view "{id}" for competition "{competitionid}"</div>);
        }
    }

}

export async function createComponents({helper, connector, competitionid }){

    const saveBar = (hasUnsavedChanges,onSave) => (<SynchronizationBar hasUnsavedChanges={hasUnsavedChanges} onSave={onSave} />);

    const createStageConfiguration = (stage) => {
        return (helper,connector,competitionid) => (
            <StageConfiguration
            competitionid={competitionid}
            stage={stage}
            connector={connector}
            helper={helper}
            savebar={saveBar}
            />
        );
    }

    const createStageRanking = (stage) => {
        return (helper,connector,competitionid) => (
            <StageRanking
            competitionid={competitionid}
            stage={stage}
            connector={connector}
            helper={helper}
            savebar={saveBar}
            />
        );
    }

    const createGeneralRanking = (stage) => {
        return (helper,connector,competitionid) => (
            <GeneralRanking
            competitionid={competitionid}
            stage={stage}
            connector={connector}
            helper={helper}
            />
        );
    }

    const components = new Components(helper,connector);

    if (competitionid){

        const configuration = await connector.fetchConfiguration(competitionid);

        components.add("event-settings", (helper,connector,competitionid) => (
            <EventSettings  
                helper={helper} 
                connector={connector} 
                competitionid={competitionid} 
                savebar={saveBar} />
        ));

        components.add("registration", (helper,connector,competitionid) => (
            <RegistrationTable 
                helper={helper} 
                connector={connector} 
                competitionid={competitionid} 
                savebar={saveBar} />
        ));

        for (let stage = 1; stage <= configuration.nStages; stage++) {
            components.add("config-"    + stage,  createStageConfiguration(stage));
            components.add("ranking-"   + stage,  createStageRanking(stage));
            components.add("general-"   + stage,  createGeneralRanking(stage));
        }

    }

    return components;

}