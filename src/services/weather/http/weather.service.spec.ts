import { RedisClientType } from "redis";
import { WeatherHttpService } from "./weather.service";
import { Axios } from "axios";
import { ForecastService } from "../../forecast/forecast.service";

describe("WeatherService", () => {
  const redis: RedisClientType = { set: jest.fn() } as any;
  const axios: Axios = { get: jest.fn() } as any;
  const weather = WeatherHttpService(axios, redis, ForecastService);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be defined", () => {
    expect(weather).toBeDefined();
  });

  describe("Current Weather", () => {
    it("should get the current weather", async () => {
      // Arrange
      const location = "mexico";
      const data = {
        data: [
          { weather: { description: "test" }, temp: 0, wind_spd: 0, rh: 0 },
        ],
      };
      const results = {
        description: "test",
        temperature: 0,
        wind_speed: 0,
        humidity: 0,
      };

      (axios.get as jest.Mock).mockResolvedValue({ data });

      // Act
      const promise = weather.getCurrent(location);

      // Assert
      await expect(promise).resolves.toEqual(results);
      expect(axios.get).toHaveBeenCalledWith(`/current?city=${location}`);
      expect(redis.set).toHaveBeenCalledWith(
        `current-${location.toLowerCase()}`,
        JSON.stringify(results),
        { EX: 3600 }
      );
    });

    it("should throw an exception", async () => {
      // Arrange
      const error = new Error("Random HTTP Error");
      (axios.get as jest.Mock).mockRejectedValue(error);

      // Act
      const promise = weather.getCurrent("paris");

      // Assert
      await expect(promise).rejects.toEqual(error);
    });
  });

  describe("Forecast Weather", () => {
    it("should get the forecast", async () => {
      // Arrange
      const location = "mexico";
      const data = {
        data: [
          {
            pres: 30,
            temp: 20,
            wind_spd: 30,
          },
        ],
      };
      (axios.get as jest.Mock).mockResolvedValue({ data });
      const forecast = {
        temperature_trend: "Stable",
        pressure_trend: "Stable",
        general_trend: "Stable",
        wind_speed_avg: 30,
      };

      // Act
      const promise = weather.getForecast(location);

      // Assert
      await expect(promise).resolves.toEqual(forecast);
      expect(axios.get).toHaveBeenCalledWith(
        `/forecast/daily?city=${location}&days=7`
      );
      expect(redis.set).toHaveBeenCalledWith(
        `forecast-${location.toLowerCase()}`,
        JSON.stringify(forecast),
        { EX: 3600 }
      );
    });

    it("should throw an exception", async () => {
      // Arrange
      const error = new Error("Random HTTP Error");
      (axios.get as jest.Mock).mockRejectedValue(error);

      // Act
      const promise = weather.getForecast("paris");

      // Assert
      await expect(promise).rejects.toEqual(error);
    });
  });
});
