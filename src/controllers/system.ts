import process from "process";
import { Request, Response } from "express";
import { Controller } from "./Controller";

export class SystemController extends Controller {
  getHealthData = async (req: Request, res: Response) => {
    try {
      const data = {
        cpuUsage: process.cpuUsage(),
        memory: process.memoryUsage(),
      };

      res.status(200).send(data);
    } catch (err) {
      this.handleExceptions(res, err);
    }
  };
}
