import { GrpcClient } from "../src/client/grpc_client";
const protoPath = `${__dirname}/../stub-server/grpc/protos/blog.proto`;
const baseUrl = "localhost:4312";

describe("GrpcClient", () => {
  it("should return valid response", async () => {
    const metadata = {};
    const payload = { id: 1, title: "something" };
    const client = new GrpcClient(
      protoPath,
      "blogPackage",
      "BlogService",
      baseUrl,
      metadata,
    );
    const res = await client.createBlogSync(payload);
    expect(res.title).toEqual(payload.title);
    expect(res.id).toBeGreaterThanOrEqual(500);
    expect(res.id).toBeLessThanOrEqual(600);
  });
});
