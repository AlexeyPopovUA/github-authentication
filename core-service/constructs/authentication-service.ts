import {Construct} from "constructs";
import {CorsHttpMethod, DomainName, HttpApi, HttpMethod, HttpStage} from "@aws-cdk/aws-apigatewayv2-alpha";
import {AaaaRecord, ARecord, IHostedZone, RecordTarget} from "aws-cdk-lib/aws-route53";
import {ApiGatewayv2DomainProperties} from "aws-cdk-lib/aws-route53-targets";
import {ICertificate} from "aws-cdk-lib/aws-certificatemanager";

import LambdaAuth from "./lambda-auth";
import LambdaCallback from "./lambda-callback";
import LambdaDefault from "./lambda-default";
import LambdaSuccess from "./lambda-success";
import LambdaHealthcheck from "./lambda-healthcheck";
import Parameters from "./parameters";

type Props = {
    domainName: string;
    namePrefix: string;
    hostedZone: IHostedZone;
    certificate: ICertificate;
};

export default class AuthenticationService extends Construct {
    private readonly apiGateway: HttpApi;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        const parameters = new Parameters(scope, `${props.namePrefix}-parameters`, {
            namePrefix: props.namePrefix
        });

        const auth = new LambdaAuth(scope, `${props.namePrefix}-auth`, {
            functionNamePrefix: props.namePrefix
        });

        parameters.GIT_HOSTNAME.grantRead(auth.lambda.function);
        parameters.REDIRECT_URL.grantRead(auth.lambda.function);
        parameters.OAUTH_AUTHORIZE_PATH.grantRead(auth.lambda.function);
        parameters.OAUTH_CLIENT_ID.grantRead(auth.lambda.function);
        parameters.OAUTH_CLIENT_SECRET.grantRead(auth.lambda.function);
        parameters.OAUTH_SCOPES.grantRead(auth.lambda.function);
        parameters.OAUTH_TOKEN_PATH.grantRead(auth.lambda.function);

        const callback = new LambdaCallback(scope, `${props.namePrefix}-callback`, {
            functionNamePrefix: props.namePrefix
        });

        parameters.OAUTH_CLIENT_ID.grantRead(callback.lambda.function);
        parameters.OAUTH_CLIENT_SECRET.grantRead(callback.lambda.function);
        parameters.GIT_HOSTNAME.grantRead(callback.lambda.function);
        parameters.OAUTH_TOKEN_PATH.grantRead(callback.lambda.function);
        parameters.OAUTH_AUTHORIZE_PATH.grantRead(callback.lambda.function);

        const def = new LambdaDefault(scope, `${props.namePrefix}-default`, {
            functionNamePrefix: props.namePrefix
        });

        const success = new LambdaSuccess(scope, `${props.namePrefix}-success`, {
            functionNamePrefix: props.namePrefix
        });

        const healthcheck = new LambdaHealthcheck(scope, `${props.namePrefix}-healthcheck`, {
            functionNamePrefix: props.namePrefix
        });

        this.apiGateway = new HttpApi(this, `${props.namePrefix}-api-gateway`, {
            apiName: `${props.namePrefix}-api-gateway`,
            createDefaultStage: false,
            description: `REST API for the ${props.namePrefix} environment`,
            corsPreflight: {
                allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.OPTIONS],
                allowOrigins: ["*"]
            }
        });

        this.apiGateway.addRoutes({
            integration: auth.lambda.integration,
            path: "/auth",
            methods: [
                HttpMethod.GET,
                HttpMethod.OPTIONS
            ]
        });

        this.apiGateway.addRoutes({
            integration: callback.lambda.integration,
            path: "/callback",
            methods: [
                HttpMethod.GET,
                HttpMethod.OPTIONS
            ]
        });

        this.apiGateway.addRoutes({
            integration: success.lambda.integration,
            path: "/success",
            methods: [
                HttpMethod.GET,
                HttpMethod.OPTIONS
            ]
        });

        this.apiGateway.addRoutes({
            integration: def.lambda.integration,
            path: "/default",
            methods: [
                HttpMethod.GET,
                HttpMethod.OPTIONS
            ]
        });

        this.apiGateway.addRoutes({
            integration: healthcheck.lambda.integration,
            path: "/healthcheck",
            methods: [
                HttpMethod.GET,
                HttpMethod.OPTIONS
            ]
        });

        const domainName = new DomainName(this, `${props.namePrefix}-domain-name`, {
            domainName: props.domainName,
            certificate: props.certificate
        });

        new HttpStage(this, `${props.namePrefix}-stage`, {
            stageName: "main",
            httpApi: this.apiGateway,
            autoDeploy: true,
            domainMapping: {
                domainName
            }
        });

        new ARecord(this, `${props.namePrefix}-record-a`, {
            recordName: props.domainName,
            zone: props.hostedZone,
            target: RecordTarget.fromAlias(new ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId))
        });

        new AaaaRecord(this, `${props.namePrefix}-record-4a`, {
            recordName: props.domainName,
            zone: props.hostedZone,
            target: RecordTarget.fromAlias(new ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId))
        });
    }
}
