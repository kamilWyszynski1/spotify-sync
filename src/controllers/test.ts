import { Request, Response } from "express";
import { Logger } from "winston";

import createLogger from "../utils/logger";

const log: Logger = createLogger("controller:test");

const test = async (req: Request, resp: Response) => {
  log.info("test");
  resp.status(200).send({ msg: "siemano" });
};

export { test };
