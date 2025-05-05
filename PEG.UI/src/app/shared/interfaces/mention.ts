import { Employee } from "./Employee";

export interface Mention {
    start: number;
    end: number;
    text: string;
    employee: Employee;
  }