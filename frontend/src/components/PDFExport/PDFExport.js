import React from 'react';

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtml(title, headers, rows) {
  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
          th { background: #f3f4f6; }
          h1 { font-size: 18px; margin-bottom: 12px; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(r => `<tr>${r.map(c => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
    </html>`;
}

function PDFExport({ data = [], columnDefs = [], title = 'Export' , fileName = 'registration.pdf' }) {
  const handleExport = () => {
    // Build headers (columnDefs labels) and rows (exclude actions since columnDefs doesn't include actions)
    const headers = columnDefs.map(c => c.header).concat(['Sign']);
    const rows = data.map(row => columnDefs.map(c => row[c.accessorKey] ?? '').concat(['']));

    const html = buildHtml(title, headers, rows);
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    setTimeout(() => {
      try { win.focus(); } catch (e) {}
      win.print();
    }, 300);
  };

  return (
    <button className="btn btn-sm" onClick={handleExport}>
      Export PDF
    </button>
  );
}

export default PDFExport;
