import {Construct} from "constructs";

import LambdaBase from "./lambda-base";

type Props = {
    functionNamePrefix: string;
}

export default class LambdaAuth extends Construct {
    public readonly lambda: LambdaBase;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        this.lambda = new LambdaBase(scope, "auth", {
            environment: {},
            functionName: `${props.functionNamePrefix}-auth`,
            cmd: ["function.auth"]
        })
    }
}
