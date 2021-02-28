import { ICatFact } from './cat-fact';

export interface IState {
    loading: boolean;
    facts: ICatFact[];
}
