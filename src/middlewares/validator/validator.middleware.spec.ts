import { Request, Response } from "express";
import { LocationSchema } from "../../validators/location";
import { validator } from "./validator.middleware";

describe("Validator middleware", () => {
  const validatorMiddleware = validator(LocationSchema);
  it("should return next", () => {
    const request: Request = { query: { location: "mexico" } } as any;
    const next = jest.fn();

    validatorMiddleware(request, {} as any, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should throw an error", () => {
    const request: Request = { query: { locaton: "mexico" } } as any;
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const response: Response = { status } as any;
    const next = jest.fn();

    validatorMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      status: 403,
      message: "A parameter is missing",
    });
  });
});
