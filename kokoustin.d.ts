interface CouncilMember {
  name: string;
  role: string;
  roleIfMainMemberAbsent?: string;
  mainMemberName?: string;
}

interface Attendee {
  name: string;
  role: string;
  left?: string;
  joinedLate?: string;
}

interface CouncilAttendee extends Attendee {
  absent: boolean;
  memberObject: CouncilMember;
}

interface Poytakirja {
  date: `${string}.${string}.${string}`;
  location?: string;
  opener?: CouncilMember;
  openTime?: `${string}:${string}`;
  closeTime?: `${string}:${string}`;
  council: CouncilAttendee[];
  other: Attendee[];
  items: MeetingItem[];
  nextMeeting?: string;
  signers: string[];
}

interface MeetingItem {
  title?: string;
  presention?: string;
  meeting?: string;
  decision?: string;
}
