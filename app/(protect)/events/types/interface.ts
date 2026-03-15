import { EEventType } from "./enum";

export interface IEvent {
  id: number;
  name: string;
  type: EEventType;
  capacity: number | null;
  capacityAmount: number;
  status: boolean;
}

export interface IZone {
  id: number;
  name: string;
  price: string;
  fee: string;
  capacity: number;
  roundId: number;
  createdAt: string;
}

export interface IShowRound {
  id: number;
  name: string;
  date: string;
  time: string;
  eventId: number;
  createdAt: string;
  zones: IZone[];
}

export interface IDeepInfoField {
  id: number;
  otherCode: string;
  label: string;
  isRequired: boolean;
  eventId: number;
  createdAt: string;
}

export interface IEventDetail {
  id: number;
  name: string;
  notes: string;
  posterUrl: string;
  posterImage: string;
  type: EEventType;
  eventDate: string | null;
  feePerEntry: string | null;
  capacity: number | null;
  isActive: boolean;
  status: boolean;
  showRounds: IShowRound[];
  deepInfoFields: IDeepInfoField[];
}