import { ForecastService } from "./forecast.service";

describe("ForecastService", () => {
  const service = ForecastService;

  it("should summarize forecast data", () => {
    const data = [
      {
        wind_spd: 10,
        temp: 20,
        pres: 14,
      },
      {
        wind_spd: 20,
        temp: 23,
        pres: 12,
      },
      {
        wind_spd: 30,
        temp: 21,
        pres: 15,
      },
      ,
      {
        wind_spd: 40,
        temp: 21,
        pres: 15,
      },
    ];

    const summarized = service.summarize(data as any);

    expect(summarized).toEqual({
      sum_wind_speed: 100,
      prev_temp: 21,
      prev_pressure: 15,
      temperature_trend: 1,
      pressure_trend: 1,
    });
  });

  it("should get stable trend", () => {
    const trend = service.getTrend(2);

    expect(trend).toEqual("Stable");
  });

  it("should get growing up trend", () => {
    const trend = service.getTrend(5);

    expect(trend).toEqual("Growing Up");
  });

  it("should get growing up trend", () => {
    const trend = service.getTrend(-4);

    expect(trend).toEqual("Growing Down");
  });
});
