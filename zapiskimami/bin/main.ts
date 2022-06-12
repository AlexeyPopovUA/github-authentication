#!/usr/bin/env node
import 'source-map-support/register';
import {App, AppProps} from 'aws-cdk-lib';
import AWS from "aws-sdk";

import {CommonConfig} from "core-service";

import MainStack from "../stacks/main-stack";

const ssm = new AWS.SSM();

const project = "gh-auth-zapiski";
const region = "eu-west-1";

class Main extends App {
    constructor(cfg: AppProps) {
        super(cfg);

        // Please note, that these SSM Parameters have to be manually created
        const domainName = this.node.tryGetContext(`${project}-domain-name`);
        const hostedZoneID = this.node.tryGetContext(`${project}-hosted-zone-id`);
        const hostedZoneName = this.node.tryGetContext(`${project}-hosted-zone-name`);

        const env = {region};
        const tags = {
            project
        };
        const commonConfig: CommonConfig = {
            env,
            tags,
            project
        };

        // TODO SSM parameters should contain names, ids and secrets

        new MainStack(this, `${project}-main`, {
            ...commonConfig,
            domainName,
            hostedZoneID,
            hostedZoneName
        });
    }
}

(async () => {
    const {Parameters} = await ssm.getParameters({
        Names: [
            `${project}-domain-name`,
            `${project}-hosted-zone-id`,
            `${project}-hosted-zone-name`
        ]
    }).promise();

    const paramMap = {};
    Parameters?.forEach(param => {
        Object.assign(paramMap, {[param.Name as string]: param.Value});
    });

    new Main({
        context: {
            ...paramMap
        }
    });
})();
