import { GrpcClient } from "../src/client/grpc_client";
const protoPath = `${__dirname}/stub-server/grpc/protos/blog.proto`;
const baseUrl = "localhost:4312";

describe("GrpcClient", () => {
  it("should return valid response", async () => {
    const metadata = {};
    const payload = { id: 1, title: "abc" };
    const client = new GrpcClient(
      protoPath,
      "blogPackage",
      "BlogService",
      baseUrl,
      metadata,
    );
    const res = await client.createBlogSync(payload);
    expect(res).toEqual(payload);
  });
});
