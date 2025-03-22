import { expect } from "chai";
import sinon from "sinon";
import { BlogsController } from "../../../src/controllers/index.js";
import { BlogsModel } from "../../../src/models/index.js";
import { StatusCode } from "../../../src/constants/index.js";

describe("BlogsController", () => {
  let stubs, mockReq, mockRes;

  beforeEach(() => {
    stubs = {
      create: sinon.stub(BlogsModel, "create"),
      findOne: sinon.stub(BlogsModel, "findOne"),
      findAll: sinon.stub(BlogsModel, "findAll"),
      update: sinon.stub(BlogsModel, "update"),
      destroy: sinon.stub(BlogsModel, "destroy"),
      console: sinon.stub(console, "error"),
    };

    mockReq = {
      body: {},
      params: {},
      user: { id: "user-123" },
      file: { path: "images/test.jpg" },
    };

    mockRes = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
      send: sinon.spy(),
    };
  });

  afterEach(() => sinon.restore());

  describe("create", () => {
    it("should create blog successfully", async () => {
      mockReq.body = { title: "Test", description: "Content" };
      stubs.create.resolves({ id: 1, ...mockReq.body });

      await BlogsController.create(mockReq, mockRes);

      expect(
        stubs.create.calledWith({
          title: "Test",
          description: "Content",
          image: "images/test.jpg",
          userId: "user-123",
        })
      ).true;
      expect(mockRes.status.calledWith(StatusCode.CREATED)).true;
    });

    it("should create blog without image when no file is provided", async () => {
      mockReq.body = { title: "No Image Blog", description: "Content" };
      mockReq.file = null;
      const mockBlog = { id: 2, ...mockReq.body, image: null };
      stubs.create.resolves(mockBlog);

      await BlogsController.create(mockReq, mockRes);

      expect(
        stubs.create.calledWith({
          title: "No Image Blog",
          description: "Content",
          image: null,
          userId: "user-123",
        })
      ).to.be.true;
      expect(mockRes.status.calledWith(StatusCode.CREATED)).to.be.true;
      expect(mockRes.json.calledWith(mockBlog)).to.be.true;
    });

    it("should handle creation error", async () => {
      stubs.create.rejects(new Error("DB Error"));
      await BlogsController.create(mockReq, mockRes);
      expect(mockRes.status.calledWith(StatusCode.INTERNAL_SERVER_ERROR)).true;
    });
  });

  describe("getById", () => {
    it("should return blog with associations", async () => {
      const mockBlog = {
        id: 1,
        author: { email: "test@test.com" },
        comments: [{ author: { email: "user@test.com" } }],
      };
      stubs.findOne.resolves(mockBlog);

      await BlogsController.getById(1, mockRes);

      expect(
        stubs.findOne.calledWith(
          sinon.match({
            include: sinon.match.array,
          })
        )
      ).true;
      expect(mockRes.status.calledWith(StatusCode.OK)).true;
    });

    it("should handle not found", async () => {
      stubs.findOne.resolves(null);
      await BlogsController.getById(999, mockRes);
      expect(mockRes.status.calledWith(StatusCode.NOT_FOUND)).true;
    });

    it("should handle database errors and return 500 status", async () => {
      const testError = new Error("Database connection failed");
      stubs.findOne.rejects(testError);

      await BlogsController.getById("blog-123", mockRes);

      expect(stubs.console.calledWith(testError)).to.be.true;
      expect(mockRes.status.calledWith(StatusCode.INTERNAL_SERVER_ERROR)).to.be
        .true;
      expect(mockRes.send.calledWith("Server Error")).to.be.true;
    });
  });

  describe("getBlogsByUserId", () => {
    it("should return user blogs", async () => {
      stubs.findAll.resolves([{ id: 1 }, { id: 2 }]);
      await BlogsController.getBlogsByUserId("user-123", mockRes);
      expect(mockRes.status.calledWith(StatusCode.OK)).true;
    });

    it("should handle no blogs found", async () => {
      stubs.findAll.resolves([]);
      await BlogsController.getBlogsByUserId("user-123", mockRes);
      expect(mockRes.status.calledWith(StatusCode.NOT_FOUND)).true;
    });

    it("should handle database errors and return 500 status", async () => {
      const testError = new Error("Database query failed");
      stubs.findAll.rejects(testError);

      await BlogsController.getBlogsByUserId("user-123", mockRes);

      expect(stubs.console.calledWith(testError)).to.be.true;
      expect(mockRes.status.calledWith(StatusCode.INTERNAL_SERVER_ERROR)).to.be
        .true;
      expect(mockRes.send.calledWith("Server Error")).to.be.true;
    });
  });

  describe("getAll", () => {
    it("should return all blogs", async () => {
      stubs.findAll.resolves([{ id: 1 }, { id: 2 }]);
      await BlogsController.getAll(mockRes);
      expect(mockRes.status.calledWith(StatusCode.OK)).true;
    });

    it("should handle empty results", async () => {
      stubs.findAll.resolves([]);
      await BlogsController.getAll(mockRes);
      expect(mockRes.status.calledWith(StatusCode.NOT_FOUND)).true;
    });

    it("should handle database errors and return 500 status", async () => {
      const testError = new Error("Database query failed");
      stubs.findAll.rejects(testError);

      await BlogsController.getAll(mockRes);

      expect(stubs.console.calledWith(testError)).to.be.true;
      expect(mockRes.status.calledWith(StatusCode.INTERNAL_SERVER_ERROR)).to.be
        .true;
      expect(mockRes.send.calledWith("Server Error")).to.be.true;
    });
  });

  describe("patch", () => {
    it("should update blog with image", async () => {
      mockReq.body = { title: "Updated" };
      mockReq.params.id = 1;
      stubs.findOne.resolves({ id: 1 });
      stubs.update.resolves([1]);

      await BlogsController.patch(1, mockReq, mockRes);

      expect(
        stubs.update.calledWith(
          sinon.match({ title: "Updated", image: "images/test.jpg" }),
          { where: { id: 1 } }
        )
      ).true;
      expect(mockRes.status.calledWith(StatusCode.OK)).true;
    });

    it("should update without image", async () => {
      mockReq.file = null;
      stubs.findOne.resolves({ id: 1 });
      await BlogsController.patch(1, mockReq, mockRes);
      expect(stubs.update.calledWith(sinon.match({ image: undefined }))).true;
    });

    it("should handle update error", async () => {
      stubs.findOne.rejects(new Error("DB Error"));
      await BlogsController.patch(1, mockReq, mockRes);
      expect(mockRes.status.calledWith(StatusCode.INTERNAL_SERVER_ERROR)).true;
    });

    it("should return 404 if blog is not found", async () => {
      stubs.findOne.resolves(null);
      mockReq.body = { title: "New Title" };
      mockReq.params.id = 999;

      await BlogsController.patch(999, mockReq, mockRes);

      expect(stubs.findOne.calledWith({ where: { id: 999 } })).to.be.true;
      expect(mockRes.status.calledWith(StatusCode.NOT_FOUND)).to.be.true;
      expect(mockRes.json.calledWith({ message: "Blog not found" })).to.be.true;
    });
  });

  describe("delete", () => {
    it("should delete blog successfully", async () => {
      stubs.findOne.resolves({ id: 1 });
      stubs.destroy.resolves(1);
      await BlogsController.delete(1, mockRes);
      expect(mockRes.status.calledWith(StatusCode.OK)).true;
    });

    it("should handle delete error", async () => {
      stubs.destroy.rejects(new Error("DB Error"));
      await BlogsController.delete(1, mockRes);
      expect(mockRes.status.calledWith(StatusCode.INTERNAL_SERVER_ERROR)).false;
    });
  });

  describe("Edge Cases Coverage", () => {
    it("should handle create error with proper response (lines 57-59)", async () => {
      stubs.create.rejects(new Error("DB Error"));
      await BlogsController.create(mockReq, mockRes);
      expect(mockRes.status.calledWith(StatusCode.INTERNAL_SERVER_ERROR)).true;
      expect(mockRes.send.calledWith("Server Error")).true;
    });

    it("should handle missing blog in getById (lines 74-76)", async () => {
      stubs.findOne.resolves(null);
      await BlogsController.getById(999, mockRes);
      expect(mockRes.status.calledWith(StatusCode.NOT_FOUND)).true;
      expect(mockRes.json.calledWith({ message: "Blog not found" })).true;
    });

    it("should handle empty blogs in getBlogsByUserId (lines 99-101)", async () => {
      stubs.findAll.resolves([]);
      await BlogsController.getBlogsByUserId("user-123", mockRes);
      expect(mockRes.status.calledWith(StatusCode.NOT_FOUND)).true;
      expect(mockRes.json.calledWith({ message: "No blogs found" })).true;
    });

    it("should handle empty results in getAll (lines 112-115)", async () => {
      stubs.findAll.resolves([]);
      await BlogsController.getAll(mockRes);
      expect(mockRes.status.calledWith(StatusCode.NOT_FOUND)).true;
      expect(mockRes.json.calledWith({ message: "No blogs found" })).true;
    });

    it("should handle delete errors properly (lines 156-161)", async () => {
      stubs.findOne.resolves({ id: 1 });
      stubs.destroy.rejects(new Error("Delete failed"));
      await BlogsController.delete(1, mockRes);
      expect(mockRes.status.calledWith(StatusCode.INTERNAL_SERVER_ERROR)).true;
      expect(
        mockRes.json.calledWith({
          message: "Error deleting the blog",
          error: "Delete failed",
        })
      ).true;
    });
  });
});
