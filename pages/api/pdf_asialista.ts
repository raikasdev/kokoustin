// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import PDFDocument from 'pdfkit-table';

const roleIndex = {
  Puheenjohtaja: 3,
  'Puheenjohtaja (varalla)': 3,
  Sihteeri: 2,
  'Sihteeri (varalla)': 2,
  'Jäsen': 1,
}

const pdf = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.object) {
    return res.status(400).json({ error: true });
  }
  const poytakirja: Poytakirja = JSON.parse(req.query.object as string || '');
  const doc = new PDFDocument({ info: { Title: `Asialista: Jämsän nuorisovaltuuston kokous ${poytakirja.date}`, }});
  res.setHeader('Content-Type', 'application/pdf')
  doc.pipe(res);
  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(`Asialista: Jämsän nuorisovaltuuston kokous ${poytakirja.date}`)
    .text('Kokouspaikka: ', { continued: true })
    .font('Helvetica')
    .text(poytakirja.location || 'Nuorten Raitti')
  
  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(`\n\n1. Kokouksen avaus\n\n`)
    .fontSize(10)
    .text('Pohjaesitys: ')
    .font('Helvetica')
    .text(`Puheenjohtaja avaa kokouksen.`)

  poytakirja.items.forEach((i, index) => {
    doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(`\n\n${index + 2}. ${i.title}\n\n`)
    .fontSize(10)
    .text('Pohjaesitys: ')
    .font('Helvetica')
    .text(i.presention?.replaceAll('\\n', '\n') || '')
  })

  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(`\n\n${poytakirja.items.length + 2}. Seuraava kokous\n\n`)
    .fontSize(10)
    .text('Pohjaesitys: ')
    .font('Helvetica')
    .text(`Päätetään seuraavan kokouksen ajankohta.`)
  
  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(`\n\n${poytakirja.items.length + 3}. Kokouksen päättäminen\n\n`)
    .fontSize(10)
    .text('Pohjaesitys: ')
    .font('Helvetica')
    .text(`Puheenjohtaja päättää kokouksen.`)
  
  doc.end(); 
}

export default pdf
