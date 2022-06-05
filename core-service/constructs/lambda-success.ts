import {Construct} from "constructs";

import LambdaBase from "./lambda-base";

type Props = {
    functionNamePrefix: string;
}

export default class LambdaSuccess extends Construct {
    public readonly lambda: LambdaBase;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        this.lambda = new LambdaBase(scope, "success", {
            environment: {},
            functionName: `${props.functionNamePrefix}-success`,
            cmd: ["function.success"]
        })
    }
}