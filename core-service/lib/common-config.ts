import {Environment} from "aws-cdk-lib/core"

export type CommonConfig = {
    env: Environment;
    project: string;
    tags: {
        project: string;
        [key: string]: string;
    }
}