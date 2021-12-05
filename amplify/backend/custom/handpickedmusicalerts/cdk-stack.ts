import * as cdk from '@aws-cdk/core';
import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';
import { AmplifyDependentResourcesAttributes } from '../../types/amplify-dependent-resources-ref';
//import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';

export class cdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps, amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, 'env', {
      type: 'String',
      description: 'Current Amplify CLI env name',
    });

    const amplifyProjectInfo = AmplifyHelpers.getProjectInfo();
    const snsTopicResourceNamePrefix = `sns-topic-${amplifyProjectInfo.projectName}`;
    const topic = new sns.Topic(this, 'sns-topic', {
      topicName: `${snsTopicResourceNamePrefix}-${cdk.Fn.ref('env')}`
    });

    topic.addSubscription(new subs.EmailSubscription("thomas@flack.it"));

    new cdk.CfnOutput(this, 'snsTopicArn', {
      value: topic.topicArn,
      description: 'The arn of the SNS topic',
    });

    // Example 2: Adding IAM role to the custom stack
    /*
    const roleResourceNamePrefix = `CustomRole-${amplifyProjectInfo.projectName}`;

    const role = new iam.Role(this, 'CustomRole', {
      assumedBy: new iam.AccountRootPrincipal(),
      roleName: `${roleResourceNamePrefix}-${cdk.Fn.ref('env')}`
    });
    */

    // Example 3: Adding policy to the IAM role
    /*
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['*'],
        resources: [topic.topicArn],
      }),
    );
    */

    const retVal:AmplifyDependentResourcesAttributes = AmplifyHelpers.addResourceDependency(this,
      amplifyResourceProps.category,
      amplifyResourceProps.resourceName,
      [
        {category: "function", resourceName: "AlertLowRemainingTrackCount"},
      ]
    );
  }
}
