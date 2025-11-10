import React, { useState } from "react";
import "./Grid.css"; // on met le style séparé pour plus de lisibilité

// Composant Cellule
function Cell({ value }) {
    
  const [status, setStatus] = useState("unknown"); 
  // unknown, done, dnf, dns, abs
  //
  // Manual choices : unknown, dnf, dns
  // Automatic choices : done, abs
  //

  const handleClick = () => {
    setStatus((prev) => {
        if (prev == "unknown"){return "dnf"}
        else if (prev == "dnf"){return "dns"}
        else {return "unknown"}
    });
  };

  return (
    <div className={`cell status-${status}`} onClick={handleClick}>
      {status !== "abs" ? value : ""} 
    </div>
  );
}

// Composant Grille
export default function Grid({ rows = 5, cols = 8 }) {
  // rows = nombre de lignes, cols = nombre de colonnes (entre 6 et 10)
  const grid = [];

  for (let r = 0; r < rows; r++) {
    const start = 1 + r * 10; // 1, 11, 21, ...
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(start + c);
    }
    grid.push(row);
  }

  return (
    <div className="grid">
      {grid.map((row, i) => (
        <div key={i} className="row">
          {row.map((num, j) => (
            <Cell key={j} value={num} />
          ))}
        </div>
      ))}
    </div>
  );
}
