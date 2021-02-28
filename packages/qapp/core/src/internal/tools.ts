import { getCreateJobGroupTool, getCreateJobTool } from './jobs';
import { getDefineMsgTool } from './message';
import { AnyQAppModuleDef } from './module';
import { getCreateModuleReducerTool } from './reducer';
import { getCreateModuleSagaTool, getCreateMsgSagaTool } from './saga';
import { createModuleSelector } from './selector';

export function getModuleTools<TModuleDef extends AnyQAppModuleDef>(moduleDef: TModuleDef) {
    return {
        defineMsg: getDefineMsgTool(moduleDef),
        createSaga: getCreateModuleSagaTool(moduleDef),
        createMsgSaga: getCreateMsgSagaTool(moduleDef),
        createReducer: getCreateModuleReducerTool(moduleDef),
        getState: createModuleSelector(moduleDef),
        createJobGroup: getCreateJobGroupTool(moduleDef),
        createJob: getCreateJobTool(moduleDef),
    };
}
