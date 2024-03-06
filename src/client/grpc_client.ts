import {GrpcObject, ServiceClientConstructor, loadPackageDefinition, credentials, Metadata, MetadataValue} from "@grpc/grpc-js"
import {loadSync, Options, PackageDefinition, ProtobufTypeDefinition} from "@grpc/proto-loader"

declare type AnyGrpcObject = GrpcObject | ServiceClientConstructor | ProtobufTypeDefinition

export default class GrpcClient {
  private packageDef: PackageDefinition
  private client
  private listNameMethods: string[]

  constructor(protoPath, packageName, service, host, options: Options) {

    this.packageDef = loadSync(protoPath, {
      keepCase: (options.keepCase === undefined) ? true : options.keepCase,
      longs: (options.longs === undefined) ? String : options.longs,
      enums: (options.enums === undefined) ? String : options.enums,
      defaults: (options.defaults === undefined) ? true : options.defaults,
      oneofs: (options.defaults === undefined) ? true : options.defaults
    });

    const proto = ((packageName) => {
      const packagePath = packageName.split('.');
      let grpcObject: AnyGrpcObject = loadPackageDefinition(this.packageDef);

      for (let i = 0; i <= packagePath.length - 1; i++) {
        grpcObject = grpcObject[packagePath[i]];
      }
      return grpcObject;
    })(packageName);

    const listMethods = this.packageDef[`${packageName}.${service}`];

    this.client = new proto[service](host, credentials.createInsecure());
    this.listNameMethods = [];

    for (const key in listMethods) {
      const methodName = listMethods[key].originalName;

      this.listNameMethods.push(methodName);
      this[`${methodName}Async`] = (data, fnAnswer, options = {}) => {
        let metadataGrpc = {};
        if (('metadata' in options) && (typeof options.metadata == 'object')) {
          metadataGrpc = this.generateMetadata(options.metadata);
        }
        this.client[methodName](data, metadataGrpc, fnAnswer);
      };

      this[`${methodName}Stream`] = (data, options = {}) => {
        let metadataGrpc = {};

        if (('metadata' in options) && (typeof options.metadata == 'object')) {
          metadataGrpc = this.generateMetadata(options.metadata);
        }
        return this.client[methodName](data, metadataGrpc);
      };

      this[`${methodName}Sync`] = (data, options = {}) => {
        let metadataGrpc = {};
        if (('metadata' in options) && (typeof options.metadata == 'object')) {
          metadataGrpc = this.generateMetadata(options.metadata);
        }

        const client = this.client;

        return new Promise(function (resolve, reject) {
          client[methodName](data, metadataGrpc, (err, dat) => {
            if (err) {
              return reject(err);
            }
            resolve(dat);
          });
        });
      };
    }
  }

  generateMetadata(metadata) {
    let metadataGrpc = new Metadata();

    for (let [key, val] of Object.entries(metadata)) {
      metadataGrpc.add(key, val as MetadataValue);
    }
    return metadataGrpc;
  }

  runService(fnName, data, fnAnswer, options = {}) {
    let metadataGrpc = {};
    if (('metadata' in options) && (typeof options.metadata == 'object')) {
      metadataGrpc = this.generateMetadata(options.metadata);
    }
    this.client[fnName](data, metadataGrpc, fnAnswer);
  }

  listMethods() {
    return this.listNameMethods;
  }
}
