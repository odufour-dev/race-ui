import React, { useEffect, useState } from "react";
import "./Grid.css"; // on met le style séparé pour plus de lisibilité

// Composant Cellule
function Cell({ value, status, onChange }) {

  const [ state, setState ] = useState( status ); 
  // unknown, done, dnf, dns, abs
  //
  // Manual choices : unknown, dnf, dns
  // Automatic choices : done, abs
  //

  useEffect(() => setState(status), [ status ]);
  useEffect(() => onChange(value, state), [ state ]);

  const handleClick = () => {
    setState((prev) => {
        if (prev == "unknown"){return "dnf"}
        else if (prev == "dnf"){return "dns"}
        else {return "unknown"}
    });
  };

  return (
    <div className={`cell status-${state}`} onClick={handleClick}>
      {state !== "abs" ? value : ""} 
    </div>
  );
}

// Composant Grille
export default function Grid({data = [], onChange}) {
  
  const [ bibs, setBibs ] = useState( data );

  useEffect(() => setBibs(data), [ data ]);
  
  const grid = [];
  const rows = bibs.length > 0 ? Math.ceil(bibs[bibs.length - 1].id / 10) : 0;
  const cols = bibs.length > 0 ? Math.max(...bibs.map((b) => b.id % 10)) : 0;
  let ibib = 0;
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(bibs[ibib]);
      ibib = ibib + 1;
    }
    grid.push(row);
  }

  return (
    <div className="grid">
      {grid.map((row, i) => (
        <div key={i} className="row">
          {row.map((r, j) => (
            <Cell key={j} value={r.id} status={r.status} onChange={(value,status) => onChange((bibs) => bibs.map((b) => b.id === value ? {id: value, status: status} : b))}/>
          ))}
        </div>
      ))}
    </div>
  );
}
