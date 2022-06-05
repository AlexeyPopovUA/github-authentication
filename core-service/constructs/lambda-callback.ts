import {Construct} from "constructs";

import LambdaBase from "./lambda-base";

type Props = {
    functionNamePrefix: string;
}

export default class LambdaCallback extends Construct {
    public readonly lambda: LambdaBase;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        this.lambda = new LambdaBase(scope, "callback", {
            environment: {},
            functionName: `${props.functionNamePrefix}-callback`,
            cmd: ["function.callback"]
        })
    }
}
