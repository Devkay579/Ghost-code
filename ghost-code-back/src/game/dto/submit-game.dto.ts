export class SubmitGameDto {
  gameId: string; // ID of the game session returned from start
  submittedCode: string;
  timeTaken: number; // seconds
}