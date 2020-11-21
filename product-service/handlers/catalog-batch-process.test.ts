import {catalogBatchProcess} from './catalog-batch-process';

const mockClientQuery = jest.fn(() => ({rows: []}));
jest.mock('pg', () => ({
  Client: jest.fn(() => ({
    connect: jest.fn(),
    query: mockClientQuery,
    end: jest.fn()
  }))
}));

const mockSNSPublish = jest.fn();
jest.mock('aws-sdk', () => ({
  SNS: jest.fn(() => ({
    publish: mockSNSPublish
  }))
}));

describe('catalogBatchProcess', () => {
  it('should pass', async () => {
    await catalogBatchProcess({Records: []}, null, () => {});
    expect(mockClientQuery).toBeCalledTimes(4);
    expect(mockSNSPublish).toBeCalledTimes(1);
    expect(mockSNSPublish).toBeCalledWith({Subject: 'Products created', Message: JSON.stringify([]), TopicArn: undefined}, expect.any(Function));
  });
});