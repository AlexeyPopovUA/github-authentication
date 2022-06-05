import {Construct} from "constructs";

import LambdaBase from "./lambda-base";

type Props = {
    functionNamePrefix: string;
}

export default class LambdaHealthcheck extends Construct {
    public readonly lambda: LambdaBase;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        this.lambda = new LambdaBase(scope, "healthcheck", {
            environment: {},
            functionName: `${props.functionNamePrefix}-healthcheck`,
            cmd: ["function.healthcheck"]
        })
    }
}
