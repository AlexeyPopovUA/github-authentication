import { Stack } from "aws-cdk-lib";
import {Construct} from "constructs";
import {Certificate, CertificateValidation, ICertificate} from "aws-cdk-lib/aws-certificatemanager";
import {HostedZone, IHostedZone } from "aws-cdk-lib/aws-route53";
import {CommonConfig} from "core-service";

import * as service from "core-service";

type Props = CommonConfig & {
    domainName: string;
    hostedZoneID: string;
    hostedZoneName: string;
}

export default class MainStack extends Stack {
    private readonly certificate: ICertificate;
    private readonly hostedZone: IHostedZone;

    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);

        // should not be re-created again
        this.hostedZone = HostedZone.fromHostedZoneAttributes(this, `${props.project}-hosted-zone`, {
            hostedZoneId: props.hostedZoneID,
            zoneName: props.hostedZoneName
        });

        this.certificate = new Certificate(this, `${props.project}-cert`, {
            domainName: props.domainName,
            validation: CertificateValidation.fromDns(this.hostedZone)
        });

        new service.AuthenticationService(this, `${props.project}-auth-service`, {
            domainName: props.domainName,
            certificate: this.certificate,
            hostedZone: this.hostedZone,
            namePrefix: props.project
        });
    }
}
