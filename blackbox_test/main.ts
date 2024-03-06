import { GrpcClient } from 'xq-test-tooling'

const protoPath = `${__dirname}/data/account.proto`
const baseUrl = 'localhost:8080'
const client = new GrpcClient(protoPath, 'account.v1', 'AccountService', baseUrl, {})

console.log(client.packageDef);
