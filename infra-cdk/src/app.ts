import * as cdk from 'aws-cdk-lib'; import {GuaranteePassportStack} from './stack.js';
const app=new cdk.App(); new GuaranteePassportStack(app,'GuaranteePassport-dev',{env:{account:process.env.CDK_DEFAULT_ACCOUNT,region:process.env.CDK_DEFAULT_REGION??'sa-east-1'}});
