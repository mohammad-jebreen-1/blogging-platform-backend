import { expect } from "chai";
import sinon from "sinon";
import { CommentsController } from "../../../src/controllers/index.js";
import { CommentsModel } from "../../../src/models/index.js";
import { StatusCode } from "../../../src/constants/index.js";

describe("CommentsController", () => {
  let createStub, mockReq, mockRes, consoleStub;

  beforeEach(() => {
    createStub = sinon.stub(CommentsModel, "create");

    mockReq = {
      body: {
        blogId: "blog-123",
        content: "Test comment content",
      },
      user: {
        id: "user-456",
      },
    };

    mockRes = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    consoleStub = sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("create", () => {
    it("should create a comment and return 201 status", async () => {
      const mockComment = {
        id: "comment-789",
        blogId: "blog-123",
        userId: "user-456",
        content: "Test comment content",
        createdAt: new Date(),
      };

      createStub.resolves(mockComment);

      await CommentsController.create(mockReq, mockRes);

      expect(
        createStub.calledOnceWithExactly({
          blogId: "blog-123",
          userId: "user-456",
          content: "Test comment content",
        })
      ).to.be.true;

      expect(mockRes.status.calledWith(StatusCode.CREATED)).to.be.true;
      expect(
        mockRes.json.calledWith({
          message: "Comment added",
          comment: mockComment,
        })
      ).to.be.true;
    });

    it("should handle errors and return 500 status", async () => {
      const testError = new Error("Database connection failed");
      createStub.rejects(testError);

      await CommentsController.create(mockReq, mockRes);

      expect(mockRes.status.calledWith(StatusCode.INTERNAL_SERVER_ERROR)).to.be
        .true;
      expect(
        mockRes.json.calledWith({
          message: "Error adding comment",
          error: testError.message,
        })
      ).to.be.true;
    });
  });
});
