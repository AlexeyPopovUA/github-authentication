import {Construct} from "constructs";

import LambdaBase from "./lambda-base";

type Props = {
    functionNamePrefix: string;
}

export default class LambdaDefault extends Construct {
    public readonly lambda: LambdaBase;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        this.lambda = new LambdaBase(scope, "default", {
            environment: {},
            functionName: `${props.functionNamePrefix}-default`,
            cmd: ["function.default"]
        })
    }
}
