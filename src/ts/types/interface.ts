import { AbstractView } from "../view/AbstractView";

export interface View {
  new (): AbstractView;
}

export interface Router {
  path: string;
  view: View;
}