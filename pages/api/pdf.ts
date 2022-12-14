// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit-table";
import fsPromises from 'fs/promises';
import path from 'path';

const pdf = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.object) {
    return res.status(400).json({ error: true });
  }
  const filePath = path.join(process.cwd(), "config.json");
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData as any);

  const roleIndex = objectData.roleOrder;

  const poytakirja: Poytakirja = JSON.parse((req.query.object as string) || "");
  const doc = new PDFDocument({
    info: { Title: `${objectData.pdftitleprefix} ${poytakirja.date}` },
  });
  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`${objectData.pdftitleprefix} ${poytakirja.date}`)
    .text("Kokouspaikka: ", { continued: true })
    .font("Helvetica")
    .text(poytakirja.location || objectData.defaultLocation);
  doc.font("Helvetica-Bold").text(`Päätöksentekijät:\n\n`);

  const table = {
    headers: ["Nimi", "Rooli", "Lisätietoja"],
    hideHeader: true,
    rows: poytakirja.council
      .filter((i) => !i.absent)
      .sort(
        (a, b) =>
          (((((roleIndex as any)[b.role] as number) || 0) -
            (roleIndex as any)[a.role]) as number) || 0
      )
      .map((i) => [
        i.name,
        i.role,
        `${i.joinedLate ? `paikalle klo. ${i.joinedLate} ` : ``}${
          i.left ? `poistui ${i.left}` : ""
        }`,
      ]),
  };

  // the magic (async/await)
  await doc.table(table, { hideHeader: true, columnsSize: [100, 75, 75] });
  doc.font("Helvetica-Bold").fontSize(12).text(`Poissa:\n\n`);

  const table1 = {
    headers: ["Nimi", "Rooli"],
    hideHeader: true,
    rows: poytakirja.council
      .filter((i) => i.absent)
      .sort(
        (a, b) =>
          (((((roleIndex as any)[b.role] as number) || 0) -
            (roleIndex as any)[a.role]) as number) || 0
      )
      .map((i) => [i.name, i.role]),
  };

  // the magic (async/await)
  await doc.table(table1, { hideHeader: true, columnsSize: [100, 75] });
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`Muut puhe- ja läsnäolo-oikeutetut:\n\n`);

  const table2 = {
    headers: ["Nimi", "Rooli", "Muuta"],
    hideHeader: true,
    rows: poytakirja.other.map((i) => [
      i.name,
      i.role,
      `${i.joinedLate ? `paikalle klo. ${i.joinedLate} ` : ``}${
        i.left ? `poistui ${i.left}` : ""
      }`,
    ]),
  };

  // the magic (async/await)
  await doc.table(table2, { hideHeader: true, columnsSize: [100, 100, 75] });

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`\n\n1. Kokouksen avaus\n\n`)
    .fontSize(10)
    .text("Pohjaesitys: ")
    .font("Helvetica")
    .text(
      `${
        poytakirja.opener?.mainMemberName
          ? poytakirja.opener.roleIfMainMemberAbsent
          : poytakirja.opener?.role
      } ${poytakirja.opener?.name} avaa kokouksen.`
    )
    .font("Helvetica-Bold")
    .text("Päätös: ")
    .font("Helvetica")
    .text(
      `${
        poytakirja.opener?.mainMemberName
          ? poytakirja.opener.roleIfMainMemberAbsent
          : poytakirja.opener?.role
      } avasi kokouksen klo. ${poytakirja.openTime}\n\n`
    );

  poytakirja.items.forEach((i, index) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`\n\n${index + 2}. ${i.title}\n\n`)
      .fontSize(10)
      .text("Pohjaesitys: ")
      .font("Helvetica")
      .text(i.presention?.replaceAll("\\n", "\n") || "");
    if (i.meeting) {
      doc
        .font("Helvetica-Bold")
        .text("Kokous: ")
        .font("Helvetica")
        .text(i.meeting?.replaceAll("\\n", "\n") || "");
    }
    doc
      .font("Helvetica-Bold")
      .text("Päätös: ")
      .font("Helvetica")
      .text(`${i.decision?.replaceAll("\\n", "\n")}\n\n`);
  });

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`\n\n${poytakirja.items.length + 2}. Seuraava kokous\n\n`)
    .fontSize(10)
    .text("Pohjaesitys: ")
    .font("Helvetica")
    .text(`Päätetään seuraavan kokouksen ajankohta.`)
    .font("Helvetica-Bold")
    .text("Päätös: ")
    .font("Helvetica")
    .text(
      `Seuraava kokous on ${
        poytakirja.nextMeeting || "!!! PÄIVÄMÄÄRÄ PUUTTUU !!!!"
      }. Ajankohta ja kokouspaikka ilmoitetaan kokouskutsun yhteydessä.\n\n`
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`\n\n${poytakirja.items.length + 3}. Kokouksen päättäminen\n\n`)
    .fontSize(10)
    .text("Pohjaesitys: ")
    .font("Helvetica")
    .text(
      `${
        poytakirja.opener?.mainMemberName
          ? poytakirja.opener.roleIfMainMemberAbsent
          : poytakirja.opener?.role
      } ${poytakirja.opener?.name} päättää kokouksen.`
    )
    .font("Helvetica-Bold")
    .text("Päätös: ")
    .font("Helvetica")
    .text(
      `${
        poytakirja.opener?.mainMemberName
          ? poytakirja.opener.roleIfMainMemberAbsent
          : poytakirja.opener?.role
      } päätti kokouksen klo. ${poytakirja.closeTime}\n\n`
    );

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        `\n______________________________`
      )
      .fontSize(10)
      .font("Helvetica-Bold")
      .text('Puheenjohtaja')
      .font("Helvetica")
      .text(poytakirja.opener?.name || 'Silja Piirainen');

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        `\n______________________________`
      )
      .fontSize(10)
      .font("Helvetica-Bold")
      .text('Sihteeri')
      .font("Helvetica")
      .text(poytakirja.council.find(i => i.role === 'Sihteeri')?.name || 'Roni Äikäs');
    
    poytakirja.signers.forEach((i) => {
      doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        `\n______________________________`
      )
      .fontSize(10)
      .font("Helvetica-Bold")
      .text('Pöytäkirjantarkistaja')
      .font("Helvetica")
      .text(i);
    })
    
  doc.end();
};

export default pdf;
