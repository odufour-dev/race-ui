
import React, { useEffect, useState, useMemo, useRef } from 'react';

export default function StageConfiguration({ competitionid, stage, connector, helper, savebar }) {

    const [ events, setEvents ] = useState( [] );
    const [ form,   setForm ]   = useState({ name: '', type: '', distance: '', category: '' });

    // Manage save
    const [ isDirty, setIsDirty ] = useState( false );
    const lastSavedStateRef       = useRef(null);
    const saveCallback = async () => {
        const jsondata = configuration.toJSON();
        //await connector.saveConfiguration(competitionid, jsondata);
        lastSavedStateRef.current = jsondata;
        setIsDirty(false);
    };

    /*
    useEffect(() => {
          connector.fetchConfiguration(competitionid)
              .then(configuration => {
                  setRaceManager(configuration);         
                  lastSavedStateRef.current = configuration.toJSON();
                  setIsDirty(false);
              })
              .catch(err => console.error(err));
      }, [competitionid, connector]);
      */
    const types = ["Bonifications", "Points", "GPM"];
    const categories = ["1ere catégorie", "2ème catégorie", "3ème catégorie", "4ème catégorie"];

    const maxDistance = useMemo(() => {
        const distances = events.map(e => Number(e.distance));
        return Math.max(...distances, 100); // 100 par défaut
    }, [events]);

    const addEvent = (e) => {
        e.preventDefault();
        if (!form.name || !form.distance) return;
        setEvents([...events, { ...form, id: Date.now(), distance: Number(form.distance) }]);
        setForm({ name: '', type: '', distance: '', category: '' });
    };

    const deleteEvent = (id) => {
        setEvents(events.filter(event => event.id !== id));
    };

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestionnaire d'Événements</h2>

        {/* --- GRAPHICAL REPRESENTATION --- */}
        <div style={{ 
        position: 'relative', 
        height: '6px', 
        width: '100%', 
        backgroundColor: '#e5e7eb', 
        borderRadius: '10px',
        margin: '60px 0',
        display: 'block' // Force le comportement de conteneur
      }}>
        {/* La ligne de progression bleue */}
        <div style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          backgroundColor: '#60a5fa',
          borderRadius: '10px',
          opacity: 0.3
        }}></div>

        {events.map((event) => {
          const percentage = (event.distance / maxDistance) * 100;
          return (
            <div 
              key={event.id} 
              style={{ 
                position: 'absolute', 
                left: `${percentage}%`, 
                top: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 20
              }}
            >
              {/* Le Point/Symbole */}
              <div style={{
                width: '14px',
                height: '14px',
                backgroundColor: '#2563eb',
                border: '3px solid white',
                borderRadius: '50%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}></div>
              
              {/* Le texte (Label) */}
              <div style={{
                position: 'absolute',
                top: '20px',
                whiteSpace: 'nowrap',
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#1e40af',
                textAlign: 'center'
              }}>
                {event.name}<br/>
                <span style={{ color: '#64748b', fontWeight: 'normal' }}>{event.distance} km</span>
              </div>
            </div>
          );
        })}
      </div>

        <div className="mt-12 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
              <th className="p-4">Nom</th>
              <th className="p-4">Type</th>
              <th className="p-4">Distance (km)</th>
              <th className="p-4">Catégorie</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.sort((a,b) => a.distance - b.distance).map(event => (
              <tr key={event.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                <td className="p-4 font-medium text-gray-700">{event.name}</td>
                <td className="p-4 text-gray-600">{event.type}</td>
                <td className="p-4">{event.distance}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                    {event.category}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => deleteEvent(event.id)} className="text-red-400 hover:text-red-600 font-medium">Supprimer</button>
                </td>
              </tr>
            ))}
            
            <tr className="bg-blue-50/50">
              <td className="p-2">
                <input className="w-full p-2 border rounded bg-white" placeholder="Nom..." value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </td>
              <td className="p-2">
                <select className="w-full p-2 border rounded bg-white" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </td>
              <td className="p-2">
                <input className="w-full p-2 border rounded bg-white" type="number" placeholder="km" value={form.distance} onChange={e => setForm({...form, distance: e.target.value})} />
              </td>
              <td className="p-2">
                <select className="w-full p-2 border rounded bg-white" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </td>
              <td className="p-2 text-right">
                <button onClick={addEvent} className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition font-bold">
                  Ajouter
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
      );

}