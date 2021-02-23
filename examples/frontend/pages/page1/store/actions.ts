import { defineMsgs, withPayload } from '@qvibi-toolbox/reduxify';

import { page1ModuleDef } from '../def';
import { ICatFact } from '../models/cat-fact';

const defineMsg = defineMsgs(page1ModuleDef);

export const loadCatFactsAction = defineMsg('load_cat_facts', withPayload());
export const loadCatFactsBeganEvent = defineMsg('load_cat_facts_began', withPayload());
export const loadCatFactsDoneEvent = defineMsg('load_cat_facts_done', withPayload<{ facts: ICatFact[] }>());
export const loadCatFactsFailedEvent = defineMsg('load_cat_facts_failed', withPayload());
