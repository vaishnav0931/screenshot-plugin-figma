export type Status = "queued" | "capturing" | "done" | "error";

export type Frame = {
  id: string;
  url: string;
  host: string;
  x: number;
  y: number;
  w: number;
  h: number;
  header: boolean;
  status: Status;
  img?: string;
  blob?: Blob;
  naturalW?: number;
  naturalH?: number;
  truncated?: boolean;
  error?: string;
  /** true once the user dragged it, so auto-layout leaves it alone */
  moved?: boolean;
};

export type Settings = {
  width: number;
  height: number;
  fullPage: boolean;
  header: boolean;
  columns: number;
  concurrency: number;
};

export type View = { x: number; y: number; k: number };

export type Tool = "move" | "hand";
