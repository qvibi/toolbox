import { ICatFactDto } from './models';

export async function getCatFacts(): Promise<ICatFactDto[]> {
    const res = await fetch('https://cat-fact.herokuapp.com/facts');
    return await res.json();
}
