// Command-line utilities
import yargs from "yargs/yargs";
import { hideBin } from 'yargs/helpers';
import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from 'mongoose';
import connect from './connect';

import Contract from "./models/Contract";
import Track from "./models/Track";

mongoose.pluralize();
mongoose.set('strictQuery', false);
mongoose.set('strictPopulate', false);

async function main() {
  const options = await yargs(hideBin(process.argv))
    .usage("Ingest track contract data")
    .argv;

  const db:string = 'mongodb://localhost:27017/trackcontracts';
  connect({db});

  const contract1:mongoose.Document = new Contract({ Name: 'Contract 1' });
  await contract1.save();

  let data:string = "";

  // read in the CSV file
  try {
    data = fs.readFileSync(path.resolve(__dirname, './tracks.csv'), "utf-8");
  }
  catch (e) {
    return console.log("ERROR: CSV tracks input file could not be found");
  }

  const lines:string[] = data.split('\n');
  const headers:string[] = lines[0].split(',');
  lines.shift();

  const errors:string[] = [];

  for (let i:number = 0; i < lines.length; i++) {
    const line:string = lines[i];
    const row:string[] = line.split(',');

    if (row.length === 7) {
      const contractName: string = row[6].trim();
      const contract:mongoose.Document|null = await Contract.findOne({Name: contractName});
      const aliases:string[] = row[5].split(';');

      if (!contract && contractName.length>0) {
        errors.push(`On line ${i+1} after headers. Contract could not be found with name "${contractName}"`);
        continue;
      }

      aliases.forEach( (alias:string, idx:number) => {
        aliases[idx] = alias.trim();
      });

      try {
        await Track.create({
          Title: row[0].trim(),
          Version: row[1].trim(),
          Artist: row[2].trim(),
          ISRC: row[3].trim(),
          PLine: row[4].trim(),
          Aliases: aliases,
          ContractID: contract?contract._id:undefined
        });
      } catch (err) {
        errors.push(`On line ${i+1} after headers. Failed to insert track row with error: "${err}"`);
      }
    }
  }

  errors.forEach( (err:string) => {
    console.log(err);
  });

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
