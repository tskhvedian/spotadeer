import mapStyles from "./mapStyles";
export const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false, 
};

export type MarkerType = {
  lat: number;
  lng: number;
  time: Date;
};
