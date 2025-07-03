export interface BodyType {
  request: string;
  response: string;
}
export interface ChatHistoryType {
  [name:string] : BodyType[],
}

