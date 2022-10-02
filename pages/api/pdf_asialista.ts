// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit-table";
import fsPromises from "fs/promises";
import path from "path";

const pdf = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.object) {
    return res.status(400).json({ error: true });
  }
  const filePath = path.join(process.cwd(), "config.json");
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData as any);

  const poytakirja: Poytakirja = JSON.parse((req.query.object as string) || "");
  const doc = new PDFDocument({
    info: {
      Title: `Asialista: ${objectData.pdftitleprefix} ${poytakirja.date}`,
    },
  });
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`Asialista: ${objectData.pdftitleprefix} ${poytakirja.date}`)
    .text("Kokouspaikka: ", { continued: true })
    .font("Helvetica")
    .text(poytakirja.location || objectData.defaultLocation);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`\n\n1. Kokouksen avaus\n\n`)
    .fontSize(10)
    .text("Pohjaesitys: ")
    .font("Helvetica")
    .text(`Puheenjohtaja avaa kokouksen.`);

  poytakirja.items.forEach((i, index) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`\n\n${index + 2}. ${i.title}\n\n`)
      .fontSize(10)
      .text("Pohjaesitys: ")
      .font("Helvetica")
      .text(i.presention?.replaceAll("\\n", "\n") || "");
  });

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`\n\n${poytakirja.items.length + 2}. Seuraava kokous\n\n`)
    .fontSize(10)
    .text("Pohjaesitys: ")
    .font("Helvetica")
    .text(`Päätetään seuraavan kokouksen ajankohta.`);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`\n\n${poytakirja.items.length + 3}. Kokouksen päättäminen\n\n`)
    .fontSize(10)
    .text("Pohjaesitys: ")
    .font("Helvetica")
    .text(`Puheenjohtaja päättää kokouksen.`);

  doc.end();
};

export default pdf;
