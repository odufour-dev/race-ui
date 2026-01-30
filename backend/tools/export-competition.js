import fs from 'fs';

const name = process.argv[2];

async function run() {
  
  const url = `http://localhost:5000/api/v1/competitions/${name}`;
  const response = await fetch(url);
  const data = await response.json();

  fs.writeFileSync(
    `/app/exports/${name}.json`,
    JSON.stringify(data, null, 2),
    'utf8'
  );

  console.log("Export OK");
}

run();
