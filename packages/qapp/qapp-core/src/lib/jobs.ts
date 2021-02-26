import { defineMsgs, withPayload } from './message';
import { all, put, call, cancelled } from './effects';
import { AnyQAppModuleDef, ExtractQAppModuleName } from './module';

import { IQAppSagaResult } from './saga';

interface IQAppJobGroupOptions<TJobGroupName> {
    jobGroupName: TJobGroupName;
}

export interface IQAppJobGroup<TJobGroupName> {
    jobGroupName: TJobGroupName;

    execute(): IQAppSagaResult<void>;

    addJob(task: IQAppJob<TJobGroupName>): void;
    removeJob(task: IQAppJob<TJobGroupName>): void;
}

export type ExtractQAppJobGroupName<T extends IQAppJobGroup<any>> = T extends IQAppJobGroup<infer TJobGroupName> ? TJobGroupName : never;

export interface IQAppJob<_TJobGroupName> {
    jobName: string;
    worker: () => IQAppSagaResult<void>;
}

type QAppJobGroupMsgType<TJobGroupName extends string, TJobProgress extends string> = `${Lowercase<`job-group:${TJobGroupName} ${TJobProgress}`>}`;

export function createJobGroup<
    TModuleDef extends AnyQAppModuleDef,
    TModuleName extends ExtractQAppModuleName<TModuleDef>,
    TJobGroupName extends string,
    _TCoordinatorState = Record<string, unknown>
>(moduleDef: TModuleDef, options: IQAppJobGroupOptions<TJobGroupName>): IQAppJobGroup<`${TModuleName} job-group:${TJobGroupName}`> {
    const defineMsg = defineMsgs(moduleDef);

    const defineCoordinatorMsg = <TJobProgress extends string>(jobProgress: `${TJobProgress}`) => {
        const type = `job-group:${options.jobGroupName} ${jobProgress}` as QAppJobGroupMsgType<TJobGroupName, TJobProgress>;
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

    const jobs: IQAppJob<TJobGroupName>[] = [];

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
                throw new Error(`failed to execute jobgroup ${options.jobGroupName}`);
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
        jobGroupName: `${moduleDef.moduleName} job-group:${options.jobGroupName}` as `${TModuleName} job-group:${TJobGroupName}`,
        execute,
        addJob: job => {
            jobs.push(job);
        },
        removeJob: job => {
            jobs.splice(jobs.indexOf(job));
        },
    };
}

export function createJobs<TModuleDef extends AnyQAppModuleDef>(moduleDef: TModuleDef) {
    return <TJobGroup extends IQAppJobGroup<any>, TJobName extends string>(
        jobGroup: TJobGroup,
        jobName: TJobName,
        worker: () => IQAppSagaResult<void>,
    ): IQAppJob<`${ExtractQAppJobGroupName<TJobGroup>} | ${ExtractQAppModuleName<TModuleDef>} ${TJobName}`> => {
        return {
            jobName: `${jobGroup.jobGroupName} | ${moduleDef.moduleName} ${jobName}` as `${ExtractQAppJobGroupName<TJobGroup>} | ${ExtractQAppModuleName<TModuleDef>} ${TJobName}`,
            worker,
        };
    };
}

export function runJobGroup<TJobGroupName>(jobGroup: IQAppJobGroup<TJobGroupName>) {
    return call(jobGroup.execute);
}
