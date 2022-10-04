import { useEffect, useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Stack,
  NavLink,
  Loader,
  TextInput,
  Button,
} from "@mantine/core";
import Attendees from "../components/Attendees";
import { Start } from "../components/Start";
import { End } from "../components/End";
import { Item } from "../components/Item";
import { Actions } from "../components/Actions";
import { DatePicker } from "@mantine/dates";
import "dayjs/locale/fi";
import { IconTableImport, IconTableExport } from "@tabler/icons";
import { openConfirmModal, openModal } from "@mantine/modals";
import { supabaseClient, withPageAuth } from '@supabase/auth-helpers-nextjs'
import { useUser } from '@supabase/auth-helpers-react'

export default function App({
  councilMembers,
  defaultOther,
  defaultLocation,
}: {
  councilMembers: CouncilMember[];
  defaultOther: Attendee[];
  defaultLocation: string;
}) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { user, error } = useUser();

  const [poytakirjat, setPoytakirjat] = useState<Poytakirja[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<null | Poytakirja>(null);
  const [day, setDay] = useState<Date>(new Date());
  useEffect(() => {
    if (localStorage.getItem("poytakirjat")) {
      const temp = JSON.parse(localStorage.getItem("poytakirjat") || "[]");
      setPoytakirjat(temp);
      if (temp.length !== 0) {
        setSelected(temp[0]);
      }
    } else {
      importData(setPoytakirjat, setSelected, !!user);
    }
    setLoading(false);
  }, []);

  const updateDB = (value: any) => {
    localStorage.setItem("poytakirjat", JSON.stringify(value));
  };

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Stack justify="space-between" sx={{ height: "100%" }}>
            <Stack>
              {loading && <Loader />}
              {poytakirjat.map((poytakirja) => (
                <NavLink
                  label={`Pöytäkirja ${poytakirja.date}`}
                  {...(selected?.date === poytakirja.date
                    ? { variant: "filled", active: true }
                    : {})}
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    event.preventDefault();
                    setSelected(poytakirja);
                  }}
                />
              ))}
              <DatePicker
                placeholder="Kokouspäivä"
                label="Valitse kokouspäivä"
                value={day}
                onChange={(date) => setDay(date || new Date())}
                locale="fi"
              />
              <NavLink
                label={`+ Uusi pöytäkirja`}
                variant="light"
                onClick={() => {
                  const temp = [...poytakirjat];
                  if (
                    temp.find(
                      (i) =>
                        i.date ===
                        `${day.getDate().toString().padStart(2, "0")}.${(
                          day.getMonth() + 1
                        )
                          .toString()
                          .padStart(2, "0")}.${day
                          .getFullYear()
                          .toString()
                          .padStart(2, "0")}`
                    )
                  ) {
                    alert("Pöytäkirja on jo luotu tuolle päivälle");
                    return;
                  }
                  temp.unshift({
                    date: `${day.getDate().toString().padStart(2, "0")}.${(
                      day.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, "0")}.${day
                      .getFullYear()
                      .toString()
                      .padStart(2, "0")}`,
                    council: councilMembers.map((i) => ({
                      name: i.name,
                      role: i.role,
                      absent: false,
                      memberObject: i,
                    })),
                    other: defaultOther,
                    items: [{
                        title: "Työjärjestyksen hyväksyminen",
                        presention:"Asiat käsitellään asialistan mukaisessa järjestyksessä."
                    },
                    {
                        title: "Kokouksen toteaminen lailliseksi ja päätösvaltaiseksi",
                        presention: "Kokous todetaan laillisesti koolle kutsutuksi ja päätösvaltaiseksi.\nToimielin on päätösvaltainen, kun paikalla on yli puolet jäsenistä (Nuorisovaltuuston toimintasääntö §5)"
                    },
                    {
                        title: "Valitaan pöytäkirjantarkistajat ja ääntenlaskijat",
                        presention: "Valitaan kokoukselle pöytäkirjantarkastajat (2kpl). Ääntenlaskijana toimii puheenjohtaja Silja Piirainen."
                    }],
                    location: defaultLocation,
                  });
                  setPoytakirjat(temp);
                  setSelected(temp[0]);
                  updateDB(temp);
                }}
              />
            </Stack>
          </Stack>
          <Stack spacing="sm">
            <Button
              variant="light"
              leftIcon={<IconTableImport size={25} />}
              onClick={() => importData(setPoytakirjat, setSelected, !!user)}
            >
              Tuo tietokannasta
            </Button>
            <Button
              variant="light"
              leftIcon={<IconTableExport size={25} />}
              onClick={() => exportData(!!user)}
            >
              Vie tietokantaan
            </Button>
          </Stack>
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Text>Kokoustin</Text>
          </div>
        </Header>
      }
    >
      {loading && <Loader />}
      {selected == null && !loading && (
        <h2>Haetaan pöytäkirjoja tietokannasta</h2>
      )}
      {selected != null && (
        <Actions
          poytakirja={selected}
          remove={() => {
            const temp = [...poytakirjat];
            temp.splice(temp.map((i) => i.date).indexOf(selected.date), 1);
            setPoytakirjat(temp);
            if (temp.length !== 0) {
              setSelected(temp[0]);
            } else {
              setSelected(null);
            }
          }}
        />
      )}
      {selected != null && (
        <>
          <h2>Kokouspaikka</h2>
          <TextInput
            value={selected.location}
            onChange={(event) => {
              const temp = [...poytakirjat];
              const tempp = { ...selected };
              tempp.location = event.currentTarget.value;
              const index = temp.map((i) => i.date).indexOf(tempp.date);
              temp[index] = tempp;
              setPoytakirjat(temp);
              updateDB(temp);
              setSelected(tempp);
            }}
          />
        </>
      )}
      {selected != null && (
        <Attendees
          poytakirja={selected}
          setPoytakirja={(poytakirja) => {
            const temp = [...poytakirjat];
            const index = temp.map((i) => i.date).indexOf(poytakirja.date);
            // PROCESS VARAJÄSENET
            poytakirja.council
              .filter((i) => i.memberObject.mainMemberName)
              .map((i) => {
                if (
                  poytakirja.council.find(
                    (a) => a.name === i.memberObject.mainMemberName
                  )?.absent
                ) {
                  i.role =
                    i.memberObject.roleIfMainMemberAbsent ||
                    i.memberObject.role;
                } else {
                  i.role = i.memberObject.role;
                }
              });
            // END VARAJÄSENET
            temp[index] = poytakirja;
            setPoytakirjat(temp);
            updateDB(temp);
            setSelected(poytakirja);
          }}
        />
      )}
      {selected != null && (
        <Start
          poytakirja={selected}
          setPoytakirja={(poytakirja) => {
            const temp = [...poytakirjat];
            const index = temp.map((i) => i.date).indexOf(poytakirja.date);
            temp[index] = poytakirja;
            setPoytakirjat(temp);
            updateDB(temp);
            setSelected(poytakirja);
          }}
          councilMembers={councilMembers}
        />
      )}
      {selected?.items.map((_i, index) => (
        <Item
          poytakirja={selected}
          setPoytakirja={(poytakirja) => {
            const temp = [...poytakirjat];
            const index = temp.map((i) => i.date).indexOf(poytakirja.date);
            temp[index] = poytakirja;
            setPoytakirjat(temp);
            updateDB(temp);
            setSelected(poytakirja);
          }}
          itemIndex={index}
        />
      ))}
      {selected != null && (
        <Button
          mt={30}
          mb={5}
          variant="light"
          onClick={() => {
            const temp = [...poytakirjat];
            const tempp = { ...selected };
            tempp.items.push({});
            const index = temp.map((i) => i.date).indexOf(tempp.date);
            temp[index] = tempp;
            setPoytakirjat(temp);
            updateDB(temp);
            setSelected(tempp);
          }}
        >
          + Luo uusi käsiteltävä asia
        </Button>
      )}
      {selected != null && (
        <End
          poytakirja={selected}
          setPoytakirja={(poytakirja) => {
            const temp = [...poytakirjat];
            const index = temp.map((i) => i.date).indexOf(poytakirja.date);
            temp[index] = poytakirja;
            setPoytakirjat(temp);
            updateDB(temp);
            setSelected(poytakirja);
          }}
          index={selected.items.length + 2}
        />
      )}
    </AppShell>
  );
}

function importData(setPoytakirjat: any, setSelected: any, loggedIn: boolean) {
  if (loggedIn) {
  openConfirmModal({
    title: "Varmista tuonti",
    children: (
      <Text size="sm">
        Huomioi että tietojen tuonti ylikirjoittaa paikalliset muutokset.
        <br />
        Huomiothan että pöytäkirjapalvelu ei tue monen henkilön yhtäaikaista
        käyttöä.
      </Text>
    ),
    labels: { confirm: "Tuo ja ylikirjoita", cancel: "Peru" },
    onConfirm: () => {
      supabaseClient
        .from<{ json: string; version: number }>("data")
        .select("*")
        .then((rows) => {
          const versions = rows.body?.map((i) => i.version) || [];
          var highScore = Math.max.apply(Math, versions); // gives the highest score
          var scoreIndex = versions.indexOf(highScore); // gives the location of the highest score
          var newestRow = (rows.body || [])[scoreIndex];
          if (!newestRow) {
            alert("Tietokannassa ei ole vielä dataa.");
          } else {
            const data = JSON.parse(newestRow.json);
            localStorage.setItem("poytakirjat", newestRow.json);
            setPoytakirjat(data);
            if (data.length !== 0) {
              setSelected(data[0]);
            }
            alert("Tuonti onnistui.");
          }
        });
    },
  });
} else {
  openModal({
    title: 'Kirjaudu sisään',
    children: (
      <LoginComponent />
    )
  })
}
}

function LoginComponent() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  return ( 
    <>
    <Text size="sm">
          Tervetuloa! Kirjaudu sisään tuodaksesi tietoja.
          Tietojen tuonti ylikirjoittaa paikalliset muutokset.
          Tietojen vienti ylikirjoittaa pilvessä olevat tiedot.
          Yhtäaikainen käyttö ei ole mahdollista
        </Text>
        <br />
        {message !== "" && <Text size="md">{message}</Text>}
        <TextInput type={"email"} label="Sähköposti" value={email} onChange={(event) => setEmail(event.currentTarget.value)} error={error} />
        <br />
        <Button onClick={async () => {
          setError('')
          setMessage('')
          const res = await supabaseClient.auth.signIn({
            email: email
          })
          if (res.error) {
            setError(res.error.message);
            return;
          }
          setMessage("Linkki lähetetty")
        }}>Kirjaudu sisään</Button>
        </>
  )
}

function exportData(loggedIn: boolean) {
  if (loggedIn) {
     openConfirmModal({
    title: "Varmista vienti",
    children: (
      <Text size="sm">
        Huomioi että tietojen tuonti ylikirjoittaa paikalliset muutokset.
        <br />
        Huomiothan että pöytäkirjapalvelu ei tue monen henkilön yhtäaikaista
        käyttöä.
      </Text>
    ),
    labels: { confirm: "Vie ja ylikirjoita", cancel: "Peru" },
    onConfirm: () => {
      supabaseClient
        .from("data")
        .insert({
          json: localStorage.getItem("poytakirjat") || "[]",
        })
        .then(() => {
          alert("Vienti onnistui.");
        });
    },
  });
   } else {
    openModal({
      title: 'Kirjaudu sisään',
      children: (
        <LoginComponent />
      )
    })
   }
  
 
}

import fsPromises from "fs/promises";
import path from "path";
export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "config.json");
  const jsonData = await fsPromises.readFile(filePath);
  const objectData = JSON.parse(jsonData as any);

  return {
    props: objectData,
  };
}

export const getServerSideProps = withPageAuth({ redirectTo: '/' })
