import {GrpcClient} from "./grpc_client"
const protoPath = `${__dirname}/account.proto`
const baseUrl = 'localhost:8080'

describe('GrpcClient', () => {
  let client = null
  beforeEach(() => {
    client = new GrpcClient(protoPath, 'account.v1', 'AccountService', baseUrl, {})
  })

  it('should be instantiated', async () => {
    expect(client.packageDef['account.v1.GetAccountRequest']).not.toBeNull()
    expect(client.packageDef['account.v1.AccountService']).not.toBeNull()
    expect(client.packageDef['account.v1.GetAccountResponse']).not.toBeNull()
  })

  it('should throw error if server is not available', async () => {
    await expect(client.getAccountSync({ id: 123 }, {})).rejects.toThrow('No connection established')
  })
});
