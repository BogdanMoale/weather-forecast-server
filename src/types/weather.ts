export type WeatherEntry = {
  date: number;
  weather: {
    itRained: boolean;
    temperature: number;
  };
};

export type RawWeatherEntry = {
  date: [string];
  weather: [
    {
      itRained: [string];
      temperature: [string];
    }
  ];
};

type WeatherData = {
  entry: WeatherEntry[];
};

export type ExistingData = {
  weatherData: WeatherData;
};
