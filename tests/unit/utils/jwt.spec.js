import { expect } from "chai";
import sinon from "sinon";
import jsonWebToken from "jsonwebtoken";
import { JwtHelper } from "../../../src/utils/index.js";
import AppConfigs from "../../../src/config/config.js";

describe("JwtHelper:sign", function () {
  let signStub;

  beforeEach(() => {
    AppConfigs.security = {
      token: {
        secret: "your-secret-key",
        expiry: 100,
      },
    };

    signStub = sinon.stub(jsonWebToken, "sign");
  });

  afterEach(() => {
    signStub.restore();
  });

  it("should call jsonWebToken.sign with correct parameters", async function () {
    const mockedData = {
      id: 1,
      name: "test",
      email: "test@example.com",
    };

    signStub.returns("validToken");

    const result = await JwtHelper.sign(mockedData);

    expect(signStub.calledOnce).to.be.true;
    expect(signStub.firstCall.args[0]).to.deep.equal(mockedData);
    expect(signStub.firstCall.args[1]).to.equal("your-secret-key");
    expect(signStub.firstCall.args[2]).to.deep.equal({
      expiresIn: 10000,
    });

    expect(result).to.equal("validToken");
  });

  it("should throw an error if jsonWebToken.sign fails", async function () {
    const mockedData = {
      id: 1,
      name: "test",
      email: "test@example.com",
    };

    signStub.throws(new Error("Error signing the token"));

    try {
      await JwtHelper.sign(mockedData);
    } catch (error) {
      expect(error.message).to.equal("Error signing the token");
    }
  });
});
