import React, { useEffect, useMemo, useState } from "react";
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

  const handleClick = () => {
        
    if (state == "unknown") {
        setState("dnf");
        onChange(value, "dnf"); 
      } else if (state == "dnf")  {
        setState("dns");
        onChange(value, "dns"); 
      } else if (state == "dns") {
        setState("unknown");
        onChange(value, "unknown"); 
      } 
  };
    
  return (
    <div className={`cell status-${state}`} onClick={handleClick}>
      {(state !== "abs" && state !== "none") ? value : ""} 
    </div>
  );
}

// Composant Grille
export default function Grid({data = [], onChange}) {

  // Use the `data` prop as the single source of truth for bib statuses.
  // This avoids synchronization issues between local state and parent state.
  const bibs = data || [];

  const computeGrid = (bibs) => {

    const grd = [];
    const rows = bibs.length > 0 ? Math.ceil(bibs[bibs.length - 1].bib / 10) : 0;
    const cols = bibs.length > 0 ? Math.max(...bibs.map((b) => {
      const mod = b.bib % 10;
      return (mod > 0 ? mod : 10)
    })) : 0;

    let ibib = 0;
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        if (bibs.length > ibib && bibs[ibib].bib == (10*r + c+1)){
          row.push(bibs[ibib]);
          ibib = ibib + 1;
        } else {
          row.push({bib: "", status: "none"});
        }
      }
      grd.push(row);
    }
    return grd;
  };
  const grid = useMemo(() => computeGrid(bibs), [bibs]);

  const handleChange = (value, status) => {
    // Build a new array reflecting the updated status for the given bib
    const b = (data || []).map(item => {
      if (item.bib == value) {
        return { ...item, status: status };
      } else {
        return item;
      }
    });
    onChange(b);
  };

  return (
    <div className="grid">
      {grid.map((row, i) => (
        <div key={i} className="row">
          {row.map((r, j) => (
            <Cell 
              key={j} 
              value={r.bib} 
              status={r.status} 
              onChange={handleChange}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
