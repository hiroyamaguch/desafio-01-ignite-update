import fs from 'node:fs/promises'
import os from 'os';
import http from 'node:http'
import axios from 'axios'

import assert from 'assert';
import { generate } from 'csv-generate';
import { parse } from 'csv-parse';

(async () => {
  let count = 0;

  const dataCSVPath = new URL('./data.csv', import.meta.url)

  const content = await fs.readFile(dataCSVPath);

  const records = parse(content, { bom: true, from: 2 });

  for await (const record of records) {
    const [title, description] = record

    const data = {
      title,
      description,
    }

    const writeStatus = await axios.post('http://localhost:3333/tasks', data)
      .then(() => 'Success')
      .catch(() => 'Failed');

    process.stdout.write(`${count++} - ${writeStatus} - ${record.join(',')}\n`);
  }
})();