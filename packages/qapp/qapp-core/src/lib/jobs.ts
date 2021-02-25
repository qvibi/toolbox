import { defineMsgs, withPayload } from './message';
import { all, put, call, cancelled } from './effects';
import { AnyQAppModuleDef, ExtractQAppModuleName } from './module';

import { IQAppSagaResult } from './saga';

interface IJobGroupOptions<TJobGroupName> {
    name: TJobGroupName;
}

export interface IJobGroup<TJobGroupName> {
    name: TJobGroupName;

    execute(): IQAppSagaResult<void>;

    addJob(task: IJob<TJobGroupName>): void;
    removeJob(task: IJob<TJobGroupName>): void;
}

export interface IJobGroup<TJobGroupName> {
    name: TJobGroupName;
}

export interface IJob<_TJobGroupName> {
    worker: () => IQAppSagaResult<void>;
}

type JobGroupMsgType<TJobGroupName extends string, TJobProgress extends string> = `${Lowercase<`job-group:${TJobGroupName} ${TJobProgress}`>}`;

export function createJobGroup<
    TModuleDef extends AnyQAppModuleDef,
    TModuleName extends ExtractQAppModuleName<TModuleDef>,
    TJobGroupName extends string,
    _TCoordinatorState = Record<string, unknown>
>(moduleDef: TModuleDef, options: IJobGroupOptions<TJobGroupName>): IJobGroup<`${TModuleName} job-group:${TJobGroupName}`> {
    const defineMsg = defineMsgs(moduleDef);

    const defineCoordinatorMsg = <TJobProgress extends string>(jobProgress: `${TJobProgress}`) => {
        const type = `job-group:${options.name} ${jobProgress}` as JobGroupMsgType<TJobGroupName, TJobProgress>;
        return defineMsg(type, withPayload());
    };

    const beganMsg = defineCoordinatorMsg('began');
    const doneMsg = defineCoordinatorMsg('done');
    const failedMsg = defineCoordinatorMsg('failed');
    const cancelledMsg = defineCoordinatorMsg('cancelled');

    const jobBeganMsg = defineCoordinatorMsg('job_began');
    const jobDoneMsg = defineCoordinatorMsg('job_done');
    const jobFailedMsg = defineCoordinatorMsg('job_failed');
    const jobCancelledMsg = defineCoordinatorMsg('job_cancelled');

    const jobs: IJob<TJobGroupName>[] = [];

    const execute = function* () {
        try {
            yield put(beganMsg({}));
            const statuses: boolean[] = yield all(
                jobs.map(job => {
                    return call(function* () {
                        try {
                            yield put(jobBeganMsg({}));
                            yield job.worker();
                            yield put(jobDoneMsg({}));

                            return true;
                        } catch {
                            yield put(jobFailedMsg({}));
                        } finally {
                            if (yield cancelled()) {
                                yield put(jobCancelledMsg({}));
                            }
                        }

                        return false;
                    });
                }),
            );

            if (~statuses.indexOf(false)) {
                throw new Error(`failed to execute jobgroup ${options.name}`);
            }

            // check if all job finished properly

            yield put(doneMsg({}));
        } catch {
            yield put(failedMsg({}));
        } finally {
            if (yield cancelled()) {
                yield put(cancelledMsg({}));
            }
        }
    };

    return {
        name: `${moduleDef.moduleName} job-group:${options.name}` as `${TModuleName} job-group:${TJobGroupName}`,
        execute,
        addJob: job => {
            jobs.push(job);
        },
        removeJob: job => {
            jobs.splice(jobs.indexOf(job));
        },
    };
}

export function createJob<TJobGroupName>(jobGroup: IJobGroup<TJobGroupName>, worker: () => IQAppSagaResult<void>): IJob<TJobGroupName> {
    return {
        worker,
    };
}

export function runJobs<TJobGroupName>(jobGroup: IJobGroup<TJobGroupName>) {
    return call(jobGroup.execute);
}
