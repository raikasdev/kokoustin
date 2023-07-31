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
    name: "Saara Toivonen",
    role: "Puheenjohtaja",
  },
  {
    name: "Roni Äikäs",
    role: "Sihteeri",
  },
  {
    name: "Pinja Pietarinen",
    role: "Jäsen",
  },
  {
    name: "Malla Myyry",
    role: "Jäsen",
  },
  {
    name: "Pessi Lemmetyinen",
    role: "Jäsen",
  },
  {
    name: "Onni Juntunen",
    role: "Jäsen",
  },
  {
    name: "Silja Piirainen",
    role: "Jäsen",
    absent: true,
  },
  {
    name: "Miro Isotalo",
    role: "Jäsen",
  },
  {
    name: "Jesse Sipovaara",
    role: "Jäsen",
    absent: true,
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
