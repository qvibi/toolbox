import { getModuleTools, withPayload } from '@qvibi-toolbox/qapp';

import { PAGE1_MODULE_DEF } from '../def';
import { ICatFact } from '../models/cat-fact';

const { defineMsg } = getModuleTools(PAGE1_MODULE_DEF);

export const loadCatFactsAction = defineMsg('load_cat_facts', withPayload());
export const loadCatFactsBeganEvent = defineMsg('load_cat_facts_began', withPayload());
export const loadCatFactsDoneEvent = defineMsg('load_cat_facts_done', withPayload<{ facts: ICatFact[] }>());
export const loadCatFactsFailedEvent = defineMsg('load_cat_facts_failed', withPayload());
