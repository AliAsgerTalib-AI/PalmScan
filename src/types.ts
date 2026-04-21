/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen = 'disclaimer' | 'setup' | 'confirmation' | 'result' | 'contact';

export interface UserData {
  name: string;
  age: string;
  sex: string;
  terminologyLevel: 'Layman' | 'Expert';
  portals: {
    rightHand: string | null;
    leftHand: string | null;
    rightPercussion: string | null;
    leftPercussion: string | null;
    rightWrist: string | null;
    leftWrist: string | null;
  };
}

export interface ReadingScores {
  synthesis: number;
  career: number;
  harmony: number;
  spirit: number;
}

export interface PalmReading {
  synthesis: string;
  career: string;
  harmony: string;
  spirit: string;
  verifiedId: string;
  archetype: 'WARRIOR' | 'SCHOLAR' | 'ARTIST' | 'MYSTIC' | 'MERCANTILE';
  fullReading: string;
  scores: ReadingScores;
}
