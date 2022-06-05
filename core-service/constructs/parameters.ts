import {Construct} from "constructs";
import {IParameter, ParameterType, StringParameter} from "aws-cdk-lib/aws-ssm";

type Props = {
    namePrefix: string;
}

export default class Parameters extends Construct {
    public readonly GIT_HOSTNAME: IParameter;
    public readonly OAUTH_TOKEN_PATH: IParameter;
    public readonly OAUTH_AUTHORIZE_PATH: IParameter;
    public readonly OAUTH_CLIENT_ID: IParameter;
    public readonly OAUTH_CLIENT_SECRET: IParameter;
    public readonly REDIRECT_URL: IParameter;
    public readonly OAUTH_SCOPES: IParameter;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        this.GIT_HOSTNAME = new StringParameter(scope, `${props.namePrefix}-GIT_HOSTNAME`, {
            type: ParameterType.STRING,
            parameterName: `${props.namePrefix}-GIT_HOSTNAME`,
            stringValue: `${props.namePrefix}-GIT_HOSTNAME`
        });

        this.OAUTH_TOKEN_PATH = new StringParameter(scope, `${props.namePrefix}-OAUTH_TOKEN_PATH`, {
            type: ParameterType.STRING,
            parameterName: `${props.namePrefix}-OAUTH_TOKEN_PATH`,
            stringValue: `${props.namePrefix}-OAUTH_TOKEN_PATH`
        });

        this.OAUTH_AUTHORIZE_PATH = new StringParameter(scope, `${props.namePrefix}-OAUTH_AUTHORIZE_PATH`, {
            type: ParameterType.STRING,
            parameterName: `${props.namePrefix}-OAUTH_AUTHORIZE_PATH`,
            stringValue: `${props.namePrefix}-OAUTH_AUTHORIZE_PATH`
        });

        this.OAUTH_CLIENT_ID = new StringParameter(scope, `${props.namePrefix}-OAUTH_CLIENT_ID`, {
            type: ParameterType.STRING,
            parameterName: `${props.namePrefix}-OAUTH_CLIENT_ID`,
            stringValue: `${props.namePrefix}-OAUTH_CLIENT_ID`
        });

        this.OAUTH_CLIENT_SECRET = new StringParameter(scope, `${props.namePrefix}-OAUTH_CLIENT_SECRET`, {
            type: ParameterType.STRING,
            parameterName: `${props.namePrefix}-OAUTH_CLIENT_SECRET`,
            stringValue: `${props.namePrefix}-OAUTH_CLIENT_SECRET`
        });

        this.REDIRECT_URL = new StringParameter(scope, `${props.namePrefix}-REDIRECT_URL`, {
            type: ParameterType.STRING,
            parameterName: `${props.namePrefix}-REDIRECT_URL`,
            stringValue: `${props.namePrefix}-REDIRECT_URL`
        });

        this.OAUTH_SCOPES = new StringParameter(scope, `${props.namePrefix}-OAUTH_SCOPES`, {
            type: ParameterType.STRING,
            parameterName: `${props.namePrefix}-OAUTH_SCOPES`,
            stringValue: `${props.namePrefix}-OAUTH_SCOPES`
        });
    }
}
