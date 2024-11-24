import csv from "csv-parser";
import { Readable } from "stream";
import readXlsxFile from "read-excel-file/node";
import { productSchemaForXlsx } from "../models/Product.js";

const parseCsv = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const csvString = buffer.toString("latin1"); // Convert buffer to string with utf-8 encoding
    Readable.from(csvString)
      .pipe(
        csv({
          separator: ";", // Correct delimiter
        })
      )
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

const parseXlsx = (buffer) => {
  return readXlsxFile(buffer, { schema: productSchemaForXlsx }).then((rows) => {
    console.log("rows:", rows);
    return rows.rows;
  });
};

export const readAndParseXlsx = async (req, res, next) => {
  try {
    if (req.fileValidationError)
      return res.status(400).json({ error: req.fileValidationError });

    const buffer = req.file?.buffer;

    if (!req.file || !buffer) {
      return res
        .status(400)
        .json({ error: "No se ha subido un archivo válido" });
    }

    req.csvData = await parseXlsx(buffer);
    next();
  } catch (error) {
    console.error("Error procesando XLSX:", error);
    res.status(400).json({ error: "Error procesando el archivo XLSX" });
  }
};
