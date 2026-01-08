
export interface Question {
  id: number;
  content: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export enum AppState {
  IDLE = 'IDLE',
  NAME_INPUT = 'NAME_INPUT',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
