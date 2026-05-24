export function formatTemperature(value) {
  return `${value}\u00b0`;
}

export function formatDayLabel(timestamp, options = { weekday: "short" }) {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(timestamp * 1000));
}

export function weatherIconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
