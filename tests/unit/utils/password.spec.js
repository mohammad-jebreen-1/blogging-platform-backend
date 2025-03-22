import { expect } from "chai";
import sinon from "sinon";
import bcrypt from "bcryptjs";
import { PasswordHelper } from "../../../src/utils/index.js";
import AppConfigs from "../../../src/config/config.js";

describe("PasswordHelper", function () {
  let genSaltStub, hashStub, compareStub;

  beforeEach(() => {
    AppConfigs.security = {
      password: {
        saltRounds: 10,
      },
    };

    genSaltStub = sinon.stub(bcrypt, "genSalt");
    hashStub = sinon.stub(bcrypt, "hash");
    compareStub = sinon.stub(bcrypt, "compare");
  });

  afterEach(() => {
    genSaltStub.restore();
    hashStub.restore();
    compareStub.restore();
  });

  it("should hash password correctly", async function () {
    const password = "password123";
    const salt = "randomSalt";
    const hash = "hashedPassword123";

    genSaltStub.resolves(salt);
    hashStub.resolves(hash);

    const { salt: generatedSalt, hash: generatedHash } =
      await PasswordHelper.hash(password);

    expect(genSaltStub.calledOnce).to.be.true;
    expect(hashStub.calledOnce).to.be.true;
    expect(generatedSalt).to.equal(salt);
    expect(generatedHash).to.equal(hash);
  });

  it("should verify password correctly", async function () {
    const userPassword = "password123";
    const hash = "hashedPassword123";

    compareStub.resolves(true);

    const isValid = await PasswordHelper.verify(userPassword, hash);

    expect(compareStub.calledOnce).to.be.true;
    expect(isValid).to.be.true;
  });

  it("should throw error if bcrypt.hash fails", async function () {
    const password = "password123";

    hashStub.rejects(new Error("Hashing failed"));

    try {
      await PasswordHelper.hash(password);
    } catch (error) {
      expect(error.message).to.equal("Hashing failed");
    }
  });

  it("should throw error if bcrypt.compare fails", async function () {
    const userPassword = "password123";
    const hash = "hashedPassword123";

    compareStub.rejects(new Error("Comparison failed"));

    try {
      await PasswordHelper.verify(userPassword, hash);
    } catch (error) {
      expect(error.message).to.equal("Comparison failed");
    }
  });
});
