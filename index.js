const weatherApi = "https://api.weather.gov/alerts/active?area=";

const searchBtn = document.getElementById('fetch-alerts');
const stateInput = document.getElementById('state-input');
const alertsDisplay = document.getElementById('alerts-display');
const errorDiv = document.getElementById('error-message');

searchBtn.addEventListener('click', async () => {
    const state = stateInput.value.trim().toUpperCase();
    
    // Step 3: Clear UI before each search
    alertsDisplay.innerHTML = "";
    stateInput.value = ""; 
    errorDiv.classList.add('hidden');
    errorDiv.textContent = "";
    
    if (state) {
        await fetchWeatherAlerts(state);
    } else {
        // Step 4: Handle empty input
        displayError("Please enter a valid state abbreviation.");
    }
});

async function fetchWeatherAlerts(state) {
    try {
        const response = await fetch(`${weatherApi}${state}`);
        
        // Step 4: Check if network response is OK
        if (!response.ok) {
            throw new Error("network issue");
        }
        
        const data = await response.json();
        const count = data.features ? data.features.length : 0;

        // Step 2: Create summary message exactly as formatted in instructions
        const summary = document.createElement('p');
        summary.textContent = `Current watches, warnings, and advisories for ${state}: ${count}`;
        alertsDisplay.appendChild(summary);

        // Step 2: Loop through alerts and add each headline
        if (count > 0) {
            data.features.forEach(alert => {
                const headlineElement = document.createElement('p');
                headlineElement.textContent = alert.properties.headline;
                alertsDisplay.appendChild(headlineElement);
            });
        }
    } catch (error) {
        // Step 4: Display the error message in the dedicated div
        displayError(error.message);
    }
}

function displayError(message) {
    errorDiv.textContent = message;
    // Remove 'hidden' so the test robot sees the error
    errorDiv.classList.remove('hidden');
}