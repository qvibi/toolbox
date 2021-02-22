import React from 'react';

import {
    useDispatch,
    createModuleSelector,
    createReducer,
    createSelector,
    defineModule,
    defineMsg,
    useSelector,
    withPayload,
    withState,
    mutate,
} from '@qvibi-toolbox/reduxify';

import { store } from '../../store';

const page1ModuleDef = defineModule({ moduleName: 'page1' }, withState<{ message: string }>());

const messageChangedEvent = defineMsg(page1ModuleDef, 'message_changed', withPayload<{ message: string }>());

const page1Reducer = createReducer(page1ModuleDef, { message: 'none' }, [
    mutate(messageChangedEvent, (state, msg) => {
        return {
            ...state,
            message: msg.payload.message,
        };
    }),
]);

const page1Module = page1ModuleDef.create({ reducer: page1Reducer });

store.addModule(page1Module);

const getState = createModuleSelector(page1ModuleDef);
const getMessage = createSelector(getState, state => state.message);

interface IProps {}

const Page1 = React.memo<IProps>(props => {
    const dispatch = useDispatch();
    const msg = useSelector(getMessage);

    React.useEffect(() => {
        setTimeout(() => {
            dispatch(messageChangedEvent({ message: 'hello from client' }));
        }, 5000);
    });

    return (
        <div>
            <div>Page 1</div>
            <div>msg: {msg}</div>
        </div>
    );
});

export default Page1;
