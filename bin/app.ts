#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '@lib/pipeline-stack';
import { DailyFoodNotificationLambdaPipeline } from '@lib/lambda-pipeline-stack';
import { CARMATECH_CONFIG } from '@lib/configuration';
import { StockUltimateStack } from '@lib/stock_ultimate-stack';

const app = new cdk.App();

const account = CARMATECH_CONFIG.Prod.ACCOUNT_ID;
const region = CARMATECH_CONFIG.Prod.REGION;

new PipelineStack(app, 'CarmaTechPipelineStack', {
  env: { account: account, region: region },

});

new DailyFoodNotificationLambdaPipeline(app, 'DailyFoodNotificationLambdaPipeline', {
  env: {
    account: account,
    region: region,
  },
});

new StockUltimateStack(app, 'StockUltimateStack', {
  env: {
    account: account,
    region: region,
  },
})

app.synth();
