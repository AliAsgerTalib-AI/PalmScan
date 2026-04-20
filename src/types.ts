/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen = 'disclaimer' | 'setup' | 'questions' | 'result' | 'contact';

export interface UserData {
  name: string;
  age: string;
  sex: string;
  portals: {
    rightHand: string | null;
    leftHand: string | null;
    rightPercussion: string | null;
    leftPercussion: string | null;
  };
  questions: {
    foundation: string;
    shadow: string;
    horizon: string;
  };
}

export interface PalmReading {
  synthesis: string;
  career: string;
  harmony: string;
  spirit: string;
  verifiedId: string;
  rawAnalysis?: string;
}
