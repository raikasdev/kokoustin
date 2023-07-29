import Dexie from "dexie";

const database = new Dexie("database");
database.version(1).stores({
  meetings: "++id, date, json, version",
});

export const meetingsTable = database.table("meetings");

export default database;
