import { Request, Response } from "express";
import { TWeatherHttpService } from "../../../services/weather/http/weather.service";
import { WeatherHttpMiddleware } from "./weather.middleware";

describe("Weather Http Middleware", () => {
  const http: TWeatherHttpService = {
    getCurrent: jest.fn(),
    getForecast: jest.fn(),
  };
  const weather = WeatherHttpMiddleware(http);

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
      const current = { weather: "mock" };
      (http.getCurrent as jest.Mock).mockResolvedValue(current);

      //Act
      await weather.getCurrent(request, response);

      //Assert
      await expect(http.getCurrent).toHaveBeenCalledWith(
        request.query.location
      );
      await expect(response.json).toHaveBeenCalledWith(current);
    });

    it("should return status 500 and a message error", async () => {
      // Arrange
      const request: Request = { query: { location: "mexico" } } as any;
      const json = jest.fn();
      const status = jest.fn().mockReturnValue({ json });
      const response: Response = { status } as any;

      const error = new Error("Random HTTP Error");
      (http.getCurrent as jest.Mock).mockRejectedValue(error);

      // Act
      await weather.getCurrent(request, response);

      // Assert
      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        status: 500,
        message: "Internal Server Error",
      });
    });
  });

  describe("Forecast Weather", () => {
    it("should get forecast weather", async () => {
      // Arrange
      const request: Request = { query: { location: "mexico" } } as any;
      const response: Response = { json: jest.fn() } as any;
      const forecast = { weather: "mock" };
      (http.getForecast as jest.Mock).mockResolvedValue(forecast);

      //Act
      await weather.getForecast(request, response);

      //Assert
      await expect(http.getForecast).toHaveBeenCalledWith(
        request.query.location
      );
      await expect(response.json).toHaveBeenCalledWith(forecast);
    });

    it("should return status 500 and a message error", async () => {
      // Arrange
      const request: Request = { query: { location: "mexico" } } as any;
      const json = jest.fn();
      const status = jest.fn().mockReturnValue({ json });
      const response: Response = { status } as any;

      const error = new Error("Random HTTP Error");
      (http.getForecast as jest.Mock).mockRejectedValue(error);

      // Act
      await weather.getForecast(request, response);

      // Assert
      expect(status).toHaveBeenCalledWith(500);
      expect(json).toHaveBeenCalledWith({
        status: 500,
        message: "Internal Server Error",
      });
    });
  });
});
