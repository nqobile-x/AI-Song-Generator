
export interface Composition {
  tempo: number;
  key: string;
  melody: string[];
  chords: string[];
  bass: string[];
  drums: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  genre: string[];
  mood: string;
  year: number;
  coverArt: string;
  composition: Composition;
}
