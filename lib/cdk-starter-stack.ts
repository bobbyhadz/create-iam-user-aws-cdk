import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 Create group
    const group = new iam.Group(this, 'example-group', {
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ReadOnlyAccess'),
      ],
    });

    // 👇 Create Managed Policy
    const loggingManagedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      'service-role/AWSLambdaBasicExecutionRole',
    );

    // 👇 Create Permissions Boundary
    const permissionsBoundary = new iam.ManagedPolicy(
      this,
      'example-permissions-boundary',
      {
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.DENY,
            actions: ['sqs:*'],
            resources: ['*'],
          }),
        ],
      },
    );

    // 👇 Create User
    const user = new iam.User(this, 'example-user', {
      userName: 'example-user',
      managedPolicies: [loggingManagedPolicy],
      groups: [group],
      permissionsBoundary,
    });

    // user.addManagedPolicy(
    //   iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
    // );

    // const inlinePolicy = new iam.Policy(this, 'cloudwatch-logs-policy', {
    //   statements: [
    //     new iam.PolicyStatement({
    //       actions: ['logs:PutLogEvents'],
    //       resources: ['*'],
    //     }),
    //   ],
    // });
    // user.attachInlinePolicy(inlinePolicy);

    // user.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}
