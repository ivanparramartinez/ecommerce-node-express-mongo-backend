import csv from "csv-parser";
import fs from "fs";
import { Readable } from "stream";
export const readCsv = async (req, res, next) => {
  try {
    const buffer = req.file.buffer;

    if (!req.file)
      return res.status(400).json({ error: "No se ha subido archivo" });

    const results = [];
    Readable.from(buffer)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        req.csvData = results;
        next();
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};
