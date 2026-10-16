const timeElement = document.getElementById('localTime');

    // Read the API timestamp once
    const startTime = new Date(
        timeElement.textContent.trim()
    ).getTime();

    function updateTime() {
        // Calculate the current time based on the original API timestamp
        const currentTime = new Date(
            startTime + (Date.now() - pageLoadTime)
        );

        timeElement.textContent = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'Europe/Amsterdam'
        }).format(currentTime);
    }

    const pageLoadTime = Date.now();

    updateTime();

    // Update every second without an API request
    setInterval(updateTime, 1000);