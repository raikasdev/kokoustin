interface MeetingItem {
  title: string;
  information: string;
  presentation: string;
  meetingNotes: string;
  decision: string;
  isSecret: boolean;
  specialComponent?: string;
}

interface Meeting {
  id: number;
  date: string;
  location: string;
  forcedFirst: MeetingItem[];
  items: MeetingItem[];
  forcedLast: MeetingItem[];
  councilMembers: CouncilMember[];
  otherAttendees: Attendee[];
  chairman?: string;
  secretary?: string;
  checkers?: string[];
}

interface ItemProps {
  isMinutesMode: boolean;
  item: MeetingItem;
  setItem: (item: MeetingItem) => void;
}

interface Attendee {
  name: string;
  role: string;
  joinedAt?: string;
  leftAt?: string;
}

interface CouncilMember extends Attendee {
  absent?: boolean;
}
