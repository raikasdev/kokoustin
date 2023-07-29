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
    .text(meeting.location || defaultMeetingPlace);

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
  });
  doc.end();
};

export default pdf;
