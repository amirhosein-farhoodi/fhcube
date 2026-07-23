export type AppId =
  | "vscode"
  | "pdf"
  | "doom"
  | "experiences"
  | "directcontact"
  | "links"
  | "about";

export interface AppMeta {
  id: AppId;
  title: string;
  label: string;
  icon: string;
}
