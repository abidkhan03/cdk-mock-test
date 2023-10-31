import { StockUltimateStack } from "../lib/stock_ultimate-stack";
import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import 'dotenv/config';
import { CARMATECH_CONFIG } from "../lib/configuration";

jest.mock('../lib/configuration');

jest.mock('../lib/stock_ultimate-stack', () => {
    return {
        StockUltimateStack: jest.fn()
    }
});

const app = new App();
const stockStack = new StockUltimateStack(app, 'StockTestStack', {
    env: {
        account: CARMATECH_CONFIG.Prod.ACCOUNT_ID,
        region: CARMATECH_CONFIG.Prod.REGION,
    },
});

beforeAll(() => {
    jest.spyOn(process, 'env', 'get').mockReturnValue({
        ACCOUNT_ID: '395929101814',
        REGION: 'us-east-2',
    });

    jest.setSystemTime(new Date('2023-11-01T00:00:00.000Z'));
});


function expectStackToHaveResource(resourceType: string, properties?: any) {
    expectCDK(stockStack).to(haveResource(resourceType, properties));
}
describe('Stock Ultimate Stack', () => {
    const template = Template.fromStack(stockStack);
    it('snapshot test', () => {
        expect(template.toJSON()).toMatchSnapshot();
    });
    describe('Resources existence', () => {
        it('stack should have a bucket name', () => {
            expectStackToHaveResource('AWS::S3::Bucket', {
                BucketName: 'stock-ultimate-bucket'
            })
        });
        it('stack should have a lambda function', () => {
            expectStackToHaveResource('AWS::Lambda::Function', {
                FunctionName: 'StockUltimateFunction',
            })
        });
    })
});
