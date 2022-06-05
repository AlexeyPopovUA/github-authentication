import {Construct} from "constructs";
import {Duration, } from "aws-cdk-lib";
import {IFunction, DockerImageCode, DockerImageFunction} from "aws-cdk-lib/aws-lambda";
import {RetentionDays } from "aws-cdk-lib/aws-logs";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

type Props = {
    functionName: string;
    description?: string;
    environment?: {
        [key: string]: string;
    };
    cmd: string[];
}

export default class LambdaBase extends Construct {
    public readonly function: IFunction;
    public readonly integration: HttpLambdaIntegration;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);


        this.function = new DockerImageFunction(this, props.functionName, {
            code: DockerImageCode.fromImageAsset("../core-function", {
                cmd: props.cmd
            }),
            timeout: Duration.seconds(30),
            logRetention: RetentionDays.THREE_DAYS,
            memorySize: 128,
            functionName: props.functionName,
            description: props?.description ?? props.functionName,
            environment: props.environment
        });

        this.integration = new HttpLambdaIntegration(`${props.functionName}-integration`, this.function);
    }
}
