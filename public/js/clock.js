const timeElement = document.getElementById("localTime");
const cityElement = document.getElementById("localTimeCity");
const timezoneElement = document.getElementById("localTimeZone");

let startTime = new Date(timeElement.textContent.trim()).getTime();
let pageLoadTime = Date.now();
let currentTimezone = timezoneElement.textContent.trim();

function updateTime() {
  const currentTime = new Date(
    startTime + (Date.now() - pageLoadTime)
  );

  timeElement.textContent = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: currentTimezone
  }).format(currentTime);
}

window.setTimezone = function (time, country, timezone) {
  startTime = new Date(time).getTime();
  pageLoadTime = Date.now();
  currentTimezone = timezone;

  cityElement.textContent = country;
  timezoneElement.textContent = timezone;

  updateTime();
}

updateTime();
setInterval(updateTime, 1000);