import { AbstractView } from '../view/AbstractView';
import { QueryStringParams } from './type';

export interface View {
    new (params: QueryStringParams): AbstractView;
}

export interface Router {
    path: string;
    view: View;
}

export interface RouterMatch {
  route: Router;
  result: RegExpMatchArray | null;
}
