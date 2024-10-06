import { NextFunction, Request, Response } from "express";
import { TWeatherCacheService } from "../../../services/weather/cache/weather.service";
import { WeatherCacheMiddleware } from "./weather.middleware";

describe("Weather Cache Middleware", () => {
  const cache: TWeatherCacheService = {
    getCurrent: jest.fn(),
    getForecast: jest.fn(),
  };
  const weather = WeatherCacheMiddleware(cache);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be defined", () => {
    expect(weather).toBeDefined();
  });

  describe("Current Weather", () => {
    it("should get current weather", async () => {
      // Arrange
      const request: Request = { query: { location: "mexico" } } as any;
      const response: Response = { json: jest.fn() } as any;
      const next: NextFunction = jest.fn();

      const current = { weather: "mock" };
      (cache.getCurrent as jest.Mock).mockResolvedValue(current);

      //Act
      await weather.getCurrent(request, response, next);

      //Assert
      await expect(cache.getCurrent).toHaveBeenCalledWith(
        request.query.location
      );
      await expect(response.json).toHaveBeenCalledWith(current);
    });

    it("should call next if not found", async () => {
      // Arrange
      const request: Request = { query: { location: "mexico" } } as any;
      const response: Response = { json: jest.fn() } as any;
      const next: NextFunction = jest.fn();

      (cache.getCurrent as jest.Mock).mockResolvedValue(null);

      // Act
      await weather.getCurrent(request, response, next);

      // Assert
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("Forecast Weather", () => {
    it("should get forecast weather", async () => {
      // Arrange
      const request: Request = { query: { location: "mexico" } } as any;
      const response: Response = { json: jest.fn() } as any;
      const next: NextFunction = jest.fn();
      const forecast = { weather: "mock" };
      (cache.getForecast as jest.Mock).mockResolvedValue(forecast);

      //Act
      await weather.getForecast(request, response, next);

      //Assert
      await expect(cache.getForecast).toHaveBeenCalledWith(
        request.query.location
      );
      await expect(response.json).toHaveBeenCalledWith(forecast);
    });

    it("should call next if not found", async () => {
      // Arrange
      const request: Request = { query: { location: "mexico" } } as any;
      const response: Response = { json: jest.fn() } as any;
      const next: NextFunction = jest.fn();

      (cache.getForecast as jest.Mock).mockResolvedValue(null);

      // Act
      await weather.getForecast(request, response, next);

      // Assert
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
