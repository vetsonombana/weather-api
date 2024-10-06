import { RedisClientType } from "redis";
import { WeatherCacheService } from "./weather.service";

describe("WeatherService", () => {
  const redis: RedisClientType = { get: jest.fn() } as any;
  const weather = WeatherCacheService(redis);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should be defined", () => {
    expect(weather).toBeDefined();
  });

  describe("Current Weather", () => {
    it("should get current weather", async () => {
      //Arrange
      const location = "mexico";
      const current = { weather: "mock" };
      (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(current));

      //Act
      const promise = weather.getCurrent(location);

      //Assert
      await expect(promise).resolves.toEqual(current);
      await expect(redis.get).toHaveBeenCalledWith(
        `current-${location.toLowerCase()}`
      );
    });

    it("should return null", async () => {
      // Arrange
      (redis.get as jest.Mock).mockResolvedValue(null);

      // Act
      const promise = weather.getCurrent("paris");

      // Assert
      await expect(promise).resolves.toEqual(null);
    });

    it("should return null into catch", async () => {
      // Arrange
      const error = new Error("Random HTTP Error");
      (redis.get as jest.Mock).mockRejectedValue(error);

      // Act
      const promise = weather.getCurrent("paris");

      // Assert
      await expect(promise).resolves.toEqual(null);
    });
  });

  describe("Forecast Weather", () => {
    it("should get forecast weather", async () => {
      //Arrange
      const location = "mexico";
      const forecast = { weather: "mock" };
      (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(forecast));

      //Act
      const promise = weather.getForecast(location);

      //Assert
      await expect(promise).resolves.toEqual(forecast);
      await expect(redis.get).toHaveBeenCalledWith(
        `forecast-${location.toLowerCase()}`
      );
    });

    it("should return null", async () => {
      // Arrange
      (redis.get as jest.Mock).mockResolvedValue(null);

      // Act
      const promise = weather.getForecast("paris");

      // Assert
      await expect(promise).resolves.toEqual(null);
    });

    it("should return null into catch", async () => {
      // Arrange
      const error = new Error("Random HTTP Error");
      (redis.get as jest.Mock).mockRejectedValue(error);

      // Act
      const promise = weather.getForecast("paris");

      // Assert
      await expect(promise).resolves.toEqual(null);
    });
  });
});
