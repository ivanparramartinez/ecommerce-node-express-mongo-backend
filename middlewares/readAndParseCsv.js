import csv from "csv-parser";
import { Readable } from "stream";

const parseCsv = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    Readable.from(buffer)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("error", (err) => reject(err))
      .on("end", () => resolve(results));
  });
};

export const readAndParseCsv = async (req, res, next) => {
  try {
    if (req.fileValidationError)
      return res.status(400).json({ error: req.fileValidationError });

    const buffer = req.file?.buffer;

    if (!req.file || !buffer) {
      return res
        .status(400)
        .json({ error: "No se ha subido un archivo válido" });
    }

    req.csvData = await parseCsv(buffer);
    next();
  } catch (error) {
    console.error("Error procesando CSV:", error);
    res.status(400).json({ error: "Error procesando el archivo CSV" });
  }
};
