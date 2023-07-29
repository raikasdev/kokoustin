import {
  DocumentReference,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { auth, firestore } from "./firebase.config";
import { diff, deletedDiff } from "deep-object-diff";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { meetingsTable } from "./database.config";
import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";

const meetingCollection = collection(firestore, "meetings");

export async function loadFromCloud() {
  const docs = await getDocs(meetingCollection);

  await Promise.all(
    docs.docs.map(async (doc) => {
      const meeting = JSON.parse(doc.data().json);
      const localMeetingObject = await meetingsTable.get(meeting.id);
      if (localMeetingObject) {
        const localMeeting = JSON.parse(localMeetingObject.json);
        const difference = deletedDiff(localMeeting, meeting);

        if (Object.keys(difference).length !== 0) {
          // Got a problem häär
          modals.openConfirmModal({
            title: "Uudempia muutoksia paikallisesti",
            children: (
              <Text size="sm">
                Mikäli tuot muutokset, kokouksen {meeting.date} tietoja
                poistetaan. Näyttäisi sille, että kokouksen tiedot ovat uudemmat
                paikallisesti.
                <br />
                Haluatko ylikirjoittaa paikalliset muutokset?
              </Text>
            ),
            labels: { confirm: "Ylikirjoita", cancel: "Peruuta" },
            confirmProps: { color: "red" },
            onConfirm: async () => {
              await meetingsTable.put(
                {
                  id: meeting.id,
                  date: meeting.date,
                  json: JSON.stringify(meeting),
                  version: doc.data().editHistory.length || 0,
                },
                meeting.id,
              );
            },
          });
          return;
        }
      }

      await meetingsTable.put(
        {
          id: meeting.id,
          date: meeting.date,
          json: JSON.stringify(meeting),
          version: doc.data().editHistory.length || 0,
        },
        meeting.id,
      );
    }),
  );
}

export async function saveItemToCloud(meeting: Meeting) {
  notifications.hide("saving");
  notifications.show({
    id: "saving",
    withCloseButton: false,
    title: "Tallennetaan",
    message: "Tallennetaan muutoksia pilvipalveluun",
    loading: true,
    autoClose: false,
  });

  const currentItemDoc = doc(meetingCollection, `${meeting.id}`);
  const currentItemDocSnap = await getDoc(currentItemDoc);
  let editHistory: any[] = [];
  if (currentItemDocSnap.exists()) {
    // Calculate difference
    editHistory = currentItemDocSnap.data().editHistory;
    if (!Array.isArray(editHistory)) {
      console.error("Not array!");
      editHistory = [];
    }

    editHistory.push({
      user: auth.currentUser?.email || "unknown",
      diff: diff(JSON.parse(currentItemDocSnap.data().json), meeting),
    });
  } else {
    editHistory.push({
      user: auth.currentUser?.email || "unknown",
      diff: meeting,
    });
  }

  const localMeeting = await meetingsTable.get(meeting.id);
  if (localMeeting.version < editHistory.length - 1) {
    modals.openConfirmModal({
      title: "Pilvipalvelussa on uudempi versio",
      children: (
        <Text size="sm">
          Pilvipalvelussa on uudempi versio. Oletko tuonut muutokset varmasti?
          <br />
          Pöytäkirjapalvelu ei tue yhtäaikaista käyttämistä. Varmista Ronilta,
          voitko ylikirjoittaa muutokset. Muutosten erot tallentuvat, joten
          mitään ei teknisesti menetetä.
        </Text>
      ),
      labels: { confirm: "Tallenna ja ylikirjoita", cancel: "Peruuta" },
      onCancel: () => {
        notifications.update({
          id: "saving",
          withCloseButton: true,
          title: "Tallentaminen peruttu",
          message: "Muutosten tallentaminen peruttu",
          loading: false,
          icon: <IconX />,
          autoClose: 4000,
          color: "red",
        });
      },
      onConfirm: () => finishSaving(currentItemDoc, meeting, editHistory),
    });
    return;
  }

  await finishSaving(currentItemDoc, meeting, editHistory);
}

async function finishSaving(
  currentItemDoc: DocumentReference,
  meeting: Meeting,
  editHistory: any[],
) {
  await setDoc(currentItemDoc, {
    id: meeting.id,
    json: JSON.stringify(meeting),
    editHistory,
  });

  const localMeeting = await meetingsTable.get(meeting.id);
  await meetingsTable.update(meeting.id, {
    ...localMeeting,
    version: editHistory.length,
  });

  notifications.update({
    id: "saving",
    withCloseButton: true,
    title: "Tallennettu",
    message: "Muutokset tallennettu!",
    loading: false,
    icon: <IconCheck />,
    autoClose: 4000,
    color: "green",
  });
}

export async function deleteFromCloud(meeting: Meeting) {
  const currentItemDoc = doc(meetingCollection, `${meeting.id}`);
  await deleteDoc(currentItemDoc);
}
