import { expect } from "chai";
import sinon from "sinon";
import { AuthController } from "../../../src/controllers/auth.js";
import { UsersModel } from "../../../src/models/index.js";
import { StatusCode } from "../../../src/constants/index.js";
import { PasswordHelper, JwtHelper } from "../../../src/utils/index.js";

describe("AuthController", () => {
  let findOneStub, createStub, hashStub, verifyStub, signStub;
  let mockRes;

  beforeEach(() => {
    findOneStub = sinon.stub(UsersModel, "findOne");
    createStub = sinon.stub(UsersModel, "create");
    hashStub = sinon.stub(PasswordHelper, "hash");
    verifyStub = sinon.stub(PasswordHelper, "verify");
    signStub = sinon.stub(JwtHelper, "sign");

    mockRes = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("register", () => {
    it("should return error if user already exists", async () => {
      findOneStub.resolves({ email: "test@example.com" });

      await AuthController.register(
        { email: "test@example.com", password: "password123" },
        mockRes
      );

      expect(mockRes.status.calledWith(StatusCode.BAD_REQUEST)).to.be.true;
      expect(mockRes.json.calledWith({ message: "User already exists" })).to.be
        .true;
    });

    it("should create a new user and return a token", async () => {
      findOneStub.resolves(null);

      const hashedPassword = { hash: "hashedPassword123", salt: "salt" };
      hashStub.resolves(hashedPassword);
      createStub.resolves({
        dataValues: {
          id: 1,
          email: "test@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      signStub.resolves("mockedToken");

      const result = await AuthController.register(
        { email: "test@example.com", password: "password123" },
        mockRes
      );

      expect(createStub.calledOnce).to.be.true;
      expect(signStub.calledOnce).to.be.true;
      expect(result.message).to.equal("User successfully created");
      expect(result.token).to.equal("mockedToken");
      expect(result.user.email).to.equal("test@example.com");
    });

    it("should return server error if something goes wrong", async () => {
      findOneStub.rejects(new Error("Database error"));

      await AuthController.register(
        { email: "test@example.com", password: "password123" },
        mockRes
      );

      expect(mockRes.status.calledWith(StatusCode.INTERNAL_SERVER_ERROR)).to.be
        .true;
      expect(
        mockRes.json.calledWith({
          message: "Server error",
          error: sinon.match.instanceOf(Error),
        })
      ).to.be.true;
    });
  });

  describe("login", () => {
    it("should return undefined if user is not found", async () => {
      findOneStub.resolves(null);

      const result = await AuthController.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).to.be.undefined;
    });

    it("should return undefined if password is incorrect", async () => {
      findOneStub.resolves({
        email: "test@example.com",
        passwordHash: "hashedPassword123",
      });
      verifyStub.resolves(false);

      const result = await AuthController.login({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(result).to.be.undefined;
    });

    it("should return a token if login is successful", async () => {
      findOneStub.resolves({
        id: 1,
        email: "test@example.com",
        passwordHash: "hashedPassword123",
      });
      verifyStub.resolves(true);
      signStub.resolves("mockedToken");

      const result = await AuthController.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.token).to.equal("mockedToken");
    });
  });
});
