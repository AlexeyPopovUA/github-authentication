#!/usr/bin/env node
import 'source-map-support/register';
import {App} from 'aws-cdk-lib';

import {CommonConfig} from "core-service";

import MainStack from "../stacks/main-stack";

class Main extends App {
    constructor() {
        super();

        const project = "gh-auth-zapiski";
        const region = "eu-west-1";

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
            domainName: "zapiskimami.com",
            hostedZoneID: "",
            hostedZoneName: ""
        });
    }
}

const app = new Main();
