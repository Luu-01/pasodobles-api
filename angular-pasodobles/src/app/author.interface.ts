import { Pasodoble } from "./pasodoble.interface";

export interface Author {
  id: number;
  name: string;
  biography: Text;
  birth_year: Date;
  image_url: string;
  pasodobles?: Pasodoble[]; // pasodobles vienen solo a veces
}