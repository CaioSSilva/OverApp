export interface Map {
  name: string;
  screenshot: string;
  gamemodes: string[];
  location: string;
  country_code: string;
}

export interface MapCardProps {
  map: Map;
}
