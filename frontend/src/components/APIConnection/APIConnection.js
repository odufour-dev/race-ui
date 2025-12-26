import React, { useEffect, useState } from 'react';
import './APIConnection.css';

function APIConnection({ helper, connector, onChange, value }) {

  const [apiversion, setAPIVersion] = useState("");
  const [competitionlist, setCompetitionList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States to manage competition creation
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const loadData = () => {
    setLoading(true);
    Promise.all([connector.fetchVersion(), connector.fetchListOfCompetitions()])
      .then(([v, list]) => {
        setAPIVersion(v.version);
        setCompetitionList(list);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [connector]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      /*
      // On suppose que ton connector a une méthode saveNewCompetition
      const result = await connector.saveNewCompetition({ name: newName });
      await loadData(); // Rafraîchir la liste
      onChange(result.id); // Sélectionner la nouvelle compète
      setIsCreating(false);
      setNewName("");
      */
    } catch (e) {
      console.error(helper.translator("error.creation"), e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="api-banner">
      <div className="api-banner-content">
        <div className="api-brand">
          <h1>{helper.translator('title')}</h1>
          {!value && !loading && !isCreating && (
            <div className="warning-pill">⚠️ {helper.translator('warning_no_save')}</div>
          )}
        </div>

        <div className="api-controls">
          {!isCreating ? (
            <>
              <div className="select-container">
                <select value={value} onChange={(e) => onChange(e.target.value)} disabled={loading}>
                  <option value="">-- {helper.translator('select_placeholder')} --</option>
                  {competitionlist.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button className="btn-add" onClick={() => setIsCreating(true)} title="Nouvelle compétition">+</button>
            </>
          ) : (
            <div className="creation-mode">
              <input 
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={helper.translator("creation_placeholder")}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <button className="btn-confirm" onClick={handleCreate} disabled={!newName.trim()}>OK</button>
              <button className="btn-cancel" onClick={() => setIsCreating(false)}>✕</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default APIConnection;