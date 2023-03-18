import { FileController } from "@/controllers";
import { CacheManagerService, FileHandlerService } from "@/services";
import { BadRequest, ErrorCode, ServiceUnavailable } from "@/utils";

type SutType = {
  fileController: FileController;
  fileHandlerService: FileHandlerService;
  cacheManagerService: CacheManagerService;
};

const sut = (): SutType => {
  const cacheManagerService = new CacheManagerService();
  const fileHandlerService = new FileHandlerService(
    52428800,
    "file",
    "uploads/"
  );
  const fileController = new FileController(
    fileHandlerService,
    cacheManagerService,
    5
  );

  return { fileController, fileHandlerService, cacheManagerService };
};

describe("File Controller", () => {
  describe("decreaseFilesProcessing", () => {
    it("should call set method with the value zero", async () => {
      const { fileController, cacheManagerService } = sut();

      cacheManagerService.set = jest.fn().mockResolvedValue(true);
      fileController.getFilesProcessing = jest.fn().mockResolvedValue(0);

      await fileController.decreaseFilesProcessing();

      expect(fileController.getFilesProcessing).toHaveBeenCalledTimes(1);
      expect(cacheManagerService.set).toHaveBeenCalledWith(
        fileController.filesProcessingKey,
        0
      );
    });

    it("should call set method with the value one", async () => {
      const { fileController, cacheManagerService } = sut();

      cacheManagerService.set = jest.fn().mockResolvedValue(true);
      fileController.getFilesProcessing = jest.fn().mockResolvedValue(2);

      await fileController.decreaseFilesProcessing();

      expect(fileController.getFilesProcessing).toHaveBeenCalledTimes(1);
      expect(cacheManagerService.set).toHaveBeenCalledWith(
        fileController.filesProcessingKey,
        1
      );
    });
  });

  describe("increaseFilesProcessing", () => {
    it("should call set method with the value one", async () => {
      const { fileController, cacheManagerService } = sut();

      cacheManagerService.set = jest.fn().mockResolvedValue(true);
      fileController.getFilesProcessing = jest
        .fn()
        .mockResolvedValue(undefined);

      await fileController.increaseFilesProcessing();

      expect(fileController.getFilesProcessing).toHaveBeenCalledTimes(1);
      expect(cacheManagerService.set).toHaveBeenCalledWith(
        fileController.filesProcessingKey,
        1
      );
    });

    it("should call set method with the value two", async () => {
      const { fileController, cacheManagerService } = sut();

      cacheManagerService.set = jest.fn().mockResolvedValue(true);
      fileController.getFilesProcessing = jest.fn().mockResolvedValue(1);

      await fileController.increaseFilesProcessing();

      expect(fileController.getFilesProcessing).toHaveBeenCalledTimes(1);
      expect(cacheManagerService.set).toHaveBeenCalledWith(
        fileController.filesProcessingKey,
        2
      );
    });
  });

  describe("getFilesProcessing", () => {
    it("should call get method with the correct key", async () => {
      const { fileController, cacheManagerService } = sut();
      cacheManagerService.get = jest.fn().mockResolvedValue(undefined);

      await fileController.getFilesProcessing();

      expect(cacheManagerService.get).toHaveBeenCalledWith(
        fileController.filesProcessingKey
      );
    });
  });

  describe("validate", () => {
    it("should throw service unavailable error because there too many files processing", async () => {
      const { fileController } = sut();
      fileController.getFilesProcessing = jest.fn().mockResolvedValue(5);

      const promise = fileController.validate(53428800);

      expect(promise).rejects.toBeInstanceOf(ServiceUnavailable);
    });

    it("should throw bad request error because the file is too large", async () => {
      const { fileController } = sut();
      fileController.getFilesProcessing = jest.fn().mockResolvedValue(1);

      const promise = fileController.validate(53428800);

      expect(promise).rejects.toBeInstanceOf(BadRequest);
    });

    it("should return true", async () => {
      const { fileController } = sut();
      fileController.getFilesProcessing = jest.fn().mockResolvedValue(1);

      const result = await fileController.validate(50428800);

      expect(result).toBe(true);
    });
  });

  describe("uploadFile", () => {
    it("should call handleExceptions because file is not valid", async () => {
      const { fileController } = sut();
      fileController.validate = jest.fn().mockImplementationOnce(() => {
        throw new ServiceUnavailable();
      });
      fileController.decreaseFilesProcessing = jest
        .fn()
        .mockResolvedValueOnce(1);
      fileController.handleExceptions = jest.fn().mockResolvedValueOnce(true);

      const fileSize = "50000";
      const res = {};
      const req = {
        headers: {
          "content-length": fileSize,
        },
      };

      // @ts-ignore
      await fileController.uploadFile(req, res);

      expect(fileController.validate).toHaveBeenCalledWith(
        parseInt(fileSize, 10)
      );
      expect(fileController.decreaseFilesProcessing).toHaveBeenCalledTimes(1);
      expect(fileController.handleExceptions).toHaveBeenCalledTimes(1);
    });

    it("should call upload method", async () => {
      const { fileController, fileHandlerService } = sut();
      fileController.validate = jest.fn().mockResolvedValueOnce(true);
      fileController.decreaseFilesProcessing = jest
        .fn()
        .mockResolvedValueOnce(true);
      fileController.increaseFilesProcessing = jest
        .fn()
        .mockResolvedValueOnce(true);
      fileController.handleExceptions = jest.fn().mockResolvedValueOnce(true);
      fileHandlerService.upload = jest.fn().mockResolvedValueOnce(true);

      const fileSize = "50000";
      const res = {};
      const req = {
        headers: {
          "content-length": fileSize,
        },
      };

      // @ts-ignore
      await fileController.uploadFile(req, res);

      expect(fileController.validate).toHaveBeenCalledWith(
        parseInt(fileSize, 10)
      );

      expect(fileController.increaseFilesProcessing).toHaveBeenCalledTimes(1);
      expect(fileHandlerService.upload).toHaveBeenCalledTimes(1);
    });
  });
});
