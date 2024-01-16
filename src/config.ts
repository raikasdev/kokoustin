export const defaultMeetingPlace = "Nuorten raitti";

export const forcedFirst: MeetingItem[] = [
  {
    title: "Kokouksen avaus",
    information: "",
    presentation: "Avataan kokous.",
    meetingNotes: "",
    decision: "",
    specialComponent: "open-meeting",
    isSecret: false,
  },
  {
    title: "Työjärjestyksen hyväksyminen",
    information: "",
    presentation: "Asiat käsitellään asialistan mukaisessa järjestyksessä.",
    meetingNotes: "",
    decision: "Nuorisovaltuusto hyväksyi työjärjestyksen.",
    isSecret: false,
  },
  {
    title: "Kokouksen toteaminen lailliseksi ja päätösvaltaiseksi",
    information: "",
    presentation:
      "Kokous todetaan laillisesti koolle kutsutuksi ja päätösvaltaiseksi.\nToimielin on päätösvaltainen, kun paikalla on yli puolet jäsenistä (Nuorisovaltuuston toimintasääntö §5)",
    meetingNotes: "",
    decision:
      "Paikalla x/9. Kokous on laillisesti koolle kutsuttu ja päätösvaltainen.",
    isSecret: false,
  },
  {
    title: "Pöytäkirjantarkastajien ja ääntenlaskijan valinta",
    information: "",
    presentation:
      "Valitaan kokoukselle pöytäkirjantarkastajat (2kpl). Ääntenlaskijana toimii puheenjohtaja Saara Toivonen.",
    meetingNotes: "",
    decision: "",
    specialComponent: "minutes-checker",
    isSecret: false,
  },
];

export const forcedLast: MeetingItem[] = [
  {
    title: "Muut asiat",
    information: "",
    presentation: "Käsitellään muut esille nousevat asiat.",
    meetingNotes: "",
    decision: "",
    isSecret: false,
  },
  {
    title: "Kokoustiedotteen sisältö",
    information: "",
    presentation:
      "Päätämme mitkä kokouksessa käydyistä asioista tuomme esille kokoutiedotteessamme, joka julkaistaan nuorisovaltuuston somekanavissa.",
    meetingNotes: "",
    decision: "",
    isSecret: false,
  },
  {
    title: "Seuraava kokous",
    information: "",
    presentation: "Päätetään seuraavan kokouksen ajankohta.",
    meetingNotes: "",
    decision:
      "Seuraava kokous on x. Ajankohta ja kokouspaikka ilmoitetaan kokouskutsun yhteydessä.",
    isSecret: false,
  },
  {
    title: "Kokouksen päättäminen",
    information: "",
    presentation: "Puheenjohtaja päättää kokouksen.",
    meetingNotes: "",
    decision: "",
    specialComponent: "close-meeting",
    isSecret: false,
  },
];

export const councilMembers: CouncilMember[] = [
  {
    name: "Lumi Eklöf",
    role: "Jäsen",
  },
  {
    name: "Saara Toivonen",
    role: "Jäsen",
  },
  {
    name: "Roni Äikäs",
    role: "Jäsen",
  },
  {
    name: "Aini Ruokokoski",
    role: "Jäsen",
  },
  {
    name: "Papu Lemmetyinen",
    role: "Jäsen",
  },
  {
    name: "Viivi Hinkkuri",
    role: "Jäsen",
  },
  {
    name: "Minea Lehtonen",
    role: "Jäsen",
  },
  {
    name: "Nika Äikäs",
    role: "Jäsen",
  },
  {
    name: "Oiva Aho",
    role: "Jäsen",
  },
  {
    name: "Linnea Savolainen",
    role: "Jäsen",
  },
  {
    name: "Helmi Pitkäniemi",
    role: "Jäsen",
  },
  {
    name: "Pessi Lemmetyinen",
    role: "Jäsen",
  },
  {
    name: "Silja Piirainen",
    role: "Jäsen",
  },
];

export const defaultOtherAttendees: Attendee[] = [
  {
    name: "Pia Salminen",
    role: "Nuorisovaltuuston tutor",
  },
];

export const pdfTitle = "Jämsän nuorisovaltuuston kokous";
export const defaultChairman = councilMembers[0].name;
export const defaultSecretary = councilMembers[1].name;
