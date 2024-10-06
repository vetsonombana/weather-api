import { validator } from "./middlewares/validator/validator.middleware";
import { WeatherCacheMiddleware } from "./middlewares/weather/cache/weather.middleware";
import { WeatherHttpMiddleware } from "./middlewares/weather/http/weather.middleware";
import { InitRedis } from "./modules/cache/cache";
import { WeatherClient } from "./modules/http/http";
import { server } from "./modules/server/server";
import { ForecastService } from "./services/forecast/forecast.service";
import { WeatherCacheService } from "./services/weather/cache/weather.service";
import { WeatherHttpService } from "./services/weather/http/weather.service";
import { LocationSchema } from "./validators/location";

export async function main() {
  const redis = await InitRedis();

  const weatherCacheService = WeatherCacheService(redis);
  const weatherHttpService = WeatherHttpService(
    WeatherClient,
    redis,
    ForecastService
  );

  const weatherCacheMiddleware = WeatherCacheMiddleware(weatherCacheService);
  const weatherHttpMiddleware = WeatherHttpMiddleware(weatherHttpService);

  server.get(
    "/weather/current",
    validator(LocationSchema),
    weatherCacheMiddleware.getCurrent,
    weatherHttpMiddleware.getCurrent
  );
  server.get(
    "/weather/forecast",
    validator(LocationSchema),
    weatherCacheMiddleware.getForecast,
    weatherHttpMiddleware.getForecast
  );

  server.listen(process.env.PORT, () =>
    console.log(`listen on ${process.env.PORT}`)
  );
}
