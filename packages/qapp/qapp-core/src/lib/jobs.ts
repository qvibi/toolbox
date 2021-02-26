import { withPayload } from './message';
import { all, put, call, cancelled } from './effects';
import { AnyQAppModuleDef, ExtractQAppModuleName } from './module';

import { IQAppSagaResult } from './saga';
import { getModuleTools } from './tools';

export interface IQAppJobGroupOptions<TJobGroupName> {
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

export function createJobGroup<TModuleDef extends AnyQAppModuleDef, TJobGroupName extends string>(
    moduleDef: TModuleDef,
    options: IQAppJobGroupOptions<TJobGroupName>,
): IQAppJobGroup<`${ExtractQAppModuleName<TModuleDef>} job-group:${TJobGroupName}`> {
    const { defineMsg } = getModuleTools(moduleDef);

    const defineCoordinatorMsg = <TJobProgress extends string, TPayload>(jobProgress: `${TJobProgress}`, payload: TPayload) => {
        const type = `job-group:${options.jobGroupName} ${jobProgress}` as QAppJobGroupMsgType<TJobGroupName, TJobProgress>;
        return defineMsg(type, payload);
    };

    const beganMsg = defineCoordinatorMsg('began', withPayload());
    const doneMsg = defineCoordinatorMsg('done', withPayload());
    const failedMsg = defineCoordinatorMsg('failed', withPayload());
    const cancelledMsg = defineCoordinatorMsg('cancelled', withPayload());

    const jobBeganMsg = defineCoordinatorMsg('job_began', withPayload<{ jobName: string }>());
    const jobDoneMsg = defineCoordinatorMsg('job_done', withPayload<{ jobName: string }>());
    const jobFailedMsg = defineCoordinatorMsg('job_failed', withPayload<{ jobName: string }>());
    const jobCancelledMsg = defineCoordinatorMsg('job_cancelled', withPayload<{ jobName: string }>());

    const jobs: IQAppJob<TJobGroupName>[] = [];

    const execute = function* () {
        try {
            yield put(beganMsg({}));
            const statuses: boolean[] = yield all(
                jobs.map(job => {
                    return call(function* () {
                        try {
                            yield put(jobBeganMsg({ jobName: job.jobName }));
                            yield job.worker();
                            yield put(jobDoneMsg({ jobName: job.jobName }));

                            return true;
                        } catch {
                            yield put(jobFailedMsg({ jobName: job.jobName }));
                        } finally {
                            if (yield cancelled()) {
                                yield put(jobCancelledMsg({ jobName: job.jobName }));
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
        jobGroupName: `${moduleDef.moduleName} job-group:${options.jobGroupName}` as `${ExtractQAppModuleName<TModuleDef>} job-group:${TJobGroupName}`,
        execute,
        addJob: job => {
            jobs.push(job);
        },
        removeJob: job => {
            jobs.splice(jobs.indexOf(job));
        },
    };
}

export function createJob<TModuleDef extends AnyQAppModuleDef, TJobGroup extends IQAppJobGroup<any>, TJobName extends string>(
    moduleDef: TModuleDef,
    jobGroup: TJobGroup,
    jobName: TJobName,
    worker: () => IQAppSagaResult<void>,
): IQAppJob<`${ExtractQAppJobGroupName<TJobGroup>} | ${ExtractQAppModuleName<TModuleDef>} ${TJobName}`> {
    return {
        jobName: `${jobGroup.jobGroupName} | ${moduleDef.moduleName} ${jobName}` as `${ExtractQAppJobGroupName<TJobGroup>} | ${ExtractQAppModuleName<TModuleDef>} ${TJobName}`,
        worker,
    };
}

export function runJobGroup<TJobGroupName>(jobGroup: IQAppJobGroup<TJobGroupName>) {
    return call(jobGroup.execute);
}

export function getCreateJobGroupTool<TModuleDef extends AnyQAppModuleDef>(moduleDef: TModuleDef) {
    return <TJobGroupName extends string>(options: IQAppJobGroupOptions<TJobGroupName>) => {
        return createJobGroup(moduleDef, options);
    };
}

export function getCreateJobTool<TModuleDef extends AnyQAppModuleDef>(moduleDef: TModuleDef) {
    return <TJobGroup extends IQAppJobGroup<any>, TJobName extends string>(
        jobGroup: TJobGroup,
        jobName: TJobName,
        worker: () => IQAppSagaResult<void>,
    ) => createJob(moduleDef, jobGroup, jobName, worker);
}
