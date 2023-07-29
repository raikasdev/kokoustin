// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit-table";
import {
  defaultChairman,
  defaultMeetingPlace,
  defaultSecretary,
  pdfTitle,
} from "@/config";

const pdf = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: true });
  }
  if (!req.body.meeting || !req.body.hide_secret) {
    return res.status(400).json({ error: true });
  }
  const hideSecret =
    req.body.hide_secret === true || req.body.hide_secret === "true";
  const meeting = JSON.parse(req.body.meeting) as Meeting;

  // @ts-ignore
  const doc = new PDFDocument({
    info: { Title: `${pdfTitle} ${meeting.date}` },
  }) as any;

  res.setHeader("Content-Type", "application/pdf");
  doc.pipe(res);

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text(`${pdfTitle} ${meeting.date}\n`)
    .fontSize(14)
    .text("Kokouspaikka: ", { continued: true })
    .font("Helvetica")
    .text(meeting.location || defaultMeetingPlace)
    .text("\n")
    .font("Helvetica-Bold")
    .fontSize(14)
    .text("Paikallaolijat\n\n");

  doc.font("Helvetica-Bold").fontSize(12).text(`Nuorisovaltuutetut:\n\n`);

  const chairman = meeting.chairman || defaultChairman;
  const secretary = meeting.secretary || defaultSecretary;

  const nameToRoleOrder = (name: string) =>
    name === chairman ? 2 : name === secretary ? 1 : 0;
  const table = {
    headers: ["Nimi", "Rooli", "Saapui/poistui"],
    hideHeader: true,
    rows: meeting.councilMembers
      .filter((i) => !i.absent)
      .sort((a, b) => nameToRoleOrder(b.name) - nameToRoleOrder(a.name))
      .map((i) => [
        i.name,
        i.role,
        `${i.joinedAt ? `paikalle klo. ${i.joinedAt} ` : ``}${
          i.leftAt ? `poistui ${i.leftAt}` : ""
        }`,
      ]),
  };

  // the magic (async/await)
  await doc.table(table, { hideHeader: true, columnsSize: [100, 75, 75] });
  doc.font("Helvetica-Bold").fontSize(12).text(`Poissa:\n\n`);

  const table1 = {
    headers: ["Nimi", "Rooli"],
    hideHeader: true,
    rows: meeting.councilMembers
      .filter((i) => i.absent)
      .map((i) => [i.name, i.role]),
  };

  // the magic (async/await)
  await doc.table(table1, { hideHeader: true, columnsSize: [100, 75] });
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`Muut puhe- ja läsnäolo-oikeutetut:\n\n`);

  const table2 = {
    headers: ["Nimi", "Rooli", "Saapui/poistui"],
    hideHeader: true,
    rows: meeting.otherAttendees.map((i) => [
      i.name,
      i.role,
      `${i.joinedAt ? `paikalle klo. ${i.joinedAt} ` : ``}${
        i.leftAt ? `poistui ${i.leftAt}` : ""
      }`,
    ]),
  };

  // the magic (async/await)
  await doc.table(table2, { hideHeader: true, columnsSize: [100, 100, 75] });

  const items = [
    ...meeting.forcedFirst,
    ...meeting.items,
    ...meeting.forcedLast,
  ];

  items.forEach((i, index) => {
    if (i.isSecret && hideSecret) {
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(`\n${index + 1}. Ei julkinen asia\n`);
      return;
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`\n\n${index + 1}. ${i.title}\n\n`);

    if (i.information) {
      doc.font("Helvetica-Oblique").fontSize(10).text(i.information).text("\n");
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Pohjaesitys: ")
      .font("Helvetica")
      .text(i.presentation?.replaceAll("\\n", "\n") || "");

    if (i.meetingNotes && !hideSecret) {
      doc
        .font("Helvetica-Bold")
        .text("\nKokouskeskustelu: ")
        .font("Helvetica")
        .text(i.meetingNotes?.replaceAll("\\n", "\n") || "");
    }

    doc
      .font("Helvetica-Bold")
      .text("\nPäätös: ")
      .font("Helvetica")
      .text(`${i.decision?.replaceAll("\\n", "\n")}\n\n`);
  });

  doc
    .addPage()
    .fontSize(12)
    .font("Helvetica")
    .text(`\n\n______________________________\n`)
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(chairman)
    .font("Helvetica")
    .text("Puheenjohtaja");

  doc
    .fontSize(12)
    .font("Helvetica")
    .text(`\n\n______________________________\n`)
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(secretary)
    .font("Helvetica")
    .text("Sihteeri");

  const checkers = meeting.checkers || [];

  checkers.forEach((i) => {
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`\n\n______________________________\n`)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(i)
      .font("Helvetica")
      .text("Pöytäkirjantarkistaja");
  });

  doc.end();
};

export default pdf;
