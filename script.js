 // DOM Elements
        const dateTimeEl = document.getElementById('dateTime');
        const locationTextEl = document.getElementById('locationText');
        const temperatureEl = document.getElementById('temperature');
        const weatherIconEl = document.getElementById('weatherIcon');
        const sunriseTimeEl = document.getElementById('sunriseTime');
        const sunsetTimeEl = document.getElementById('sunsetTime');
        const dayLengthEl = document.getElementById('dayLength');
        const precipitationChanceEl = document.getElementById('precipitationChance');
        const humidityEl = document.getElementById('humidity');
        const windSpeedEl = document.getElementById('windSpeed');
        const pressureEl = document.getElementById('pressure');
        const forecastContainerEl = document.getElementById('forecastContainer');
        const refreshBtn = document.getElementById('refreshBtn');
        const detectLocationBtn = document.getElementById('detectLocationBtn');
        const locationSearchEl = document.getElementById('locationSearch');
        const searchResultsEl = document.getElementById('searchResults');
        const errorMessageEl = document.getElementById('errorMessage');
        const errorTextEl = document.getElementById('errorText');
        const cloudAnimationEl = document.getElementById('cloudAnimation');
        const rainContainerEl = document.getElementById('rainContainer');
        const cloudTooltipEl = document.getElementById('cloudTooltip');

        // API Configuration
        const WEATHER_API_KEY = 'cc402cee78b39ccb47d43b3f468374d3'; // In a real app, use your OpenWeatherMap API key
        const GEO_API_KEY = 'cc402cee78b39ccb47d43b3f468374d3'; // In a real app, use your OpenCage Geocoding API key
        
        // For demo purposes, we'll use mock data but structure it for real API integration
        const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
        const GEO_API_URL = 'https://api.opencagedata.com/geocode/v1/json';

        // Current location data
        let currentLocation = {
            name: "New York, USA",
            lat: 40.7128,
            lon: -74.0060
        };

        // Weather condition to icon mapping
        const weatherIcons = {
            '01d': 'fas fa-sun',           // clear sky (day)
            '01n': 'fas fa-moon',          // clear sky (night)
            '02d': 'fas fa-cloud-sun',     // few clouds (day)
            '02n': 'fas fa-cloud-moon',    // few clouds (night)
            '03d': 'fas fa-cloud',         // scattered clouds
            '03n': 'fas fa-cloud',
            '04d': 'fas fa-cloud',         // broken clouds
            '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-rain',    // shower rain
            '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-sun-rain',// rain (day)
            '10n': 'fas fa-cloud-moon-rain',// rain (night)
            '11d': 'fas fa-bolt',          // thunderstorm
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',     // snow
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',          // mist
            '50n': 'fas fa-smog'
        };

        // Initialize the application
        function init() {
            updateDateTime();
            setInterval(updateDateTime, 60000);
            
            // Try to get user's location on load
            detectLocation();
            
            // Set up event listeners
            setupEventListeners();
            
            // Show cloud tooltip after a delay
            setTimeout(() => {
                cloudTooltipEl.classList.add('opacity-100');
                setTimeout(() => {
                    cloudTooltipEl.classList.remove('opacity-100');
                }, 3000);
            }, 2000);
        }

        // Set up event listeners
        function setupEventListeners() {
            refreshBtn.addEventListener('click', () => {
                getWeatherData(currentLocation.lat, currentLocation.lon, currentLocation.name);
            });
            
            detectLocationBtn.addEventListener('click', detectLocation);
            
            locationSearchEl.addEventListener('input', handleSearchInput);
            
            locationSearchEl.addEventListener('focus', () => {
                if (locationSearchEl.value) {
                    handleSearchInput();
                }
            });
            
            // Close search results when clicking outside
            document.addEventListener('click', (e) => {
                if (!locationSearchEl.contains(e.target) && !searchResultsEl.contains(e.target)) {
                    searchResultsEl.style.display = 'none';
                }
            });
            
            // Cloud animation click
            cloudAnimationEl.addEventListener('click', toggleRain);
        }

        // Update date and time
        function updateDateTime() {
            const now = new Date();
            const optionsDate = { weekday: 'long', month: 'short', day: 'numeric' };
            const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
            if (dateTimeEl) {
                dateTimeEl.textContent = `${now.toLocaleDateString(undefined, optionsDate)}, ${now.toLocaleTimeString([], optionsTime)}`;
            }
        }

        // Detect user's current location
        function detectLocation() {
            if (!navigator.geolocation) {
                showError("Geolocation is not supported by this browser.");
                return;
            }
            
            // Show loading state on button
            detectLocationBtn.innerHTML = '<div class="loading h-5 w-5"></div>';
            
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    try {
                        // Get location name from coordinates
                        const locationName = await reverseGeocode(lat, lon);
                        await getWeatherData(lat, lon, locationName);
                    } catch (error) {
                        console.error("Error getting location name:", error);
                        // Use coordinates if reverse geocoding fails
                        await getWeatherData(lat, lon, `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`);
                    }
                    
                    // Restore location button
                    detectLocationBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
                },
                (error) => {
                    console.error("Error getting location:", error);
                    let errorMsg = "Unable to retrieve your location.";
                    
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMsg = "Location access denied. Please allow location access to use this feature.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMsg = "Location information unavailable.";
                            break;
                        case error.TIMEOUT:
                            errorMsg = "Location request timed out.";
                            break;
                    }
                    
                    showError(errorMsg);
                    
                    // Restore location button
                    detectLocationBtn.innerHTML = '<i class="fas fa-location-arrow"></i>';
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        }

        // Reverse geocode coordinates to get location name
        async function reverseGeocode(lat, lon) {
            // In a real implementation, you would use the OpenCage Geocoding API
            // For demo purposes, we'll return a mock location name
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Mock response based on coordinates
            if (lat > 40 && lat < 41 && lon > -74 && lon < -73) {
                return "New York, USA";
            } else if (lat > 51 && lat < 52 && lon > -0.5 && lon < 0.5) {
                return "London, UK";
            } else if (lat > 35 && lat < 36 && lon > 139 && lon < 140) {
                return "Tokyo, Japan";
            } else if (lat > 48 && lat < 49 && lon > 2 && lon < 3) {
                return "Paris, France";
            } else {
                return `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
            }
        }

        // Handle search input
        function handleSearchInput() {
            const query = locationSearchEl.value.trim();
            
            if (!query) {
                searchResultsEl.style.display = 'none';
                return;
            }
            
            // In a real implementation, you would call a geocoding API here
            // For demo purposes, we'll use mock data
            const mockResults = [
                { name: "New York, USA", lat: 40.7128, lon: -74.0060 },
                { name: "London, UK", lat: 51.5074, lon: -0.1278 },
                { name: "Tokyo, Japan", lat: 35.6762, lon: 139.6503 },
                { name: "Paris, France", lat: 48.8566, lon: 2.3522 },
                { name: "Sydney, Australia", lat: -33.8688, lon: 151.2093 },
                { name: "Mumbai, India", lat: 19.0760, lon: 72.8777 },
                { name: "Dubai, UAE", lat: 25.2048, lon: 55.2708 },
                { name: "Singapore", lat: 1.3521, lon: 103.8198 }
            ].filter(location => 
                location.name.toLowerCase().includes(query.toLowerCase())
            );
            
            displaySearchResults(mockResults);
        }

        // Display search results
        function displaySearchResults(results) {
            searchResultsEl.innerHTML = '';
            
            if (results.length === 0) {
                const noResultItem = document.createElement('div');
                noResultItem.className = 'search-result-item';
                noResultItem.textContent = 'No locations found';
                searchResultsEl.appendChild(noResultItem);
            } else {
                results.forEach(location => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = `
                        <div class="flex items-center">
                            <i class="fas fa-map-marker-alt mr-2 text-white/60"></i>
                            <span>${location.name}</span>
                        </div>
                    `;
                    resultItem.addEventListener('click', () => {
                        locationSearchEl.value = location.name;
                        searchResultsEl.style.display = 'none';
                        getWeatherData(location.lat, location.lon, location.name);
                    });
                    searchResultsEl.appendChild(resultItem);
                });
            }
            
            searchResultsEl.style.display = 'block';
        }

        // Get weather data from API
        async function getWeatherData(lat, lon, locationName) {
            // Show loading state
            refreshBtn.innerHTML = '<div class="loading h-5 w-5"></div>';
            hideError();
            
            try {
                // In a real implementation, you would call the OpenWeatherMap API
                // For demo purposes, we'll use mock data that changes based on location
                
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Generate mock weather data based on location
                const weatherData = generateMockWeatherData(lat, lon, locationName);
                
                // Update UI with weather data
                updateWeatherUI(weatherData);
                
                // Update current location
                currentLocation = { name: locationName, lat, lon };
                
            } catch (error) {
                console.error("Error fetching weather data:", error);
                showError("Failed to fetch weather data. Please try again.");
            } finally {
                // Restore refresh button
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            }
        }

        // Generate mock weather data based on location
        function generateMockWeatherData(lat, lon, locationName) {
            const now = new Date();
            const month = now.getMonth();
            const isNorthernHemisphere = lat > 0;
            
            // Determine season based on hemisphere and month
            let season;
            if (isNorthernHemisphere) {
                if (month >= 2 && month <= 4) season = 'spring';
                else if (month >= 5 && month <= 7) season = 'summer';
                else if (month >= 8 && month <= 10) season = 'autumn';
                else season = 'winter';
            } else {
                if (month >= 2 && month <= 4) season = 'autumn';
                else if (month >= 5 && month <= 7) season = 'winter';
                else if (month >= 8 && month <= 10) season = 'spring';
                else season = 'summer';
            }
            
            // Base temperatures by season
            const baseTemps = {
                spring: { min: 8, max: 18 },
                summer: { min: 18, max: 30 },
                autumn: { min: 5, max: 20 },
                winter: { min: -5, max: 10 }
            };
            
            // Adjust for latitude (colder at higher absolute latitudes)
            const latFactor = Math.min(1, Math.abs(lat) / 90);
            const tempRange = baseTemps[season];
            const currentTemp = Math.round(tempRange.min + (tempRange.max - tempRange.min) * (1 - latFactor) + Math.random() * 5);
            
            // Weather conditions based on season and location
            const conditions = {
                spring: ['02d', '10d', '01d', '04d'],
                summer: ['01d', '02d', '11d', '09d'],
                autumn: ['04d', '10d', '01d', '50d'],
                winter: ['13d', '02d', '01d', '50d']
            };
            
            const conditionCodes = conditions[season];
            const currentConditionCode = conditionCodes[Math.floor(Math.random() * conditionCodes.length)];
            
            // Calculate sunrise and sunset times (simplified)
            const sunriseHour = 6 + Math.floor(Math.random() * 2);
            const sunsetHour = 18 + Math.floor(Math.random() * 2);
            const sunriseMinute = Math.floor(Math.random() * 60);
            const sunsetMinute = Math.floor(Math.random() * 60);
            
            const sunriseTime = `${sunriseHour.toString().padStart(2, '0')}:${sunriseMinute.toString().padStart(2, '0')}`;
            const sunsetTime = `${sunsetHour.toString().padStart(2, '0')}:${sunsetMinute.toString().padStart(2, '0')}`;
            
            // Calculate day length
            const dayLengthHours = sunsetHour - sunriseHour;
            const dayLengthMinutes = sunsetMinute - sunriseMinute;
            const dayLength = `${dayLengthHours} h ${Math.abs(dayLengthMinutes)} m`;
            
            // Generate forecast
            const forecast = [];
            for (let i = 0; i < 5; i++) {
                const forecastDate = new Date(now);
                forecastDate.setDate(now.getDate() + i);
                
                const dayTemp = currentTemp + Math.floor(Math.random() * 6) - 3;
                const lowTemp = dayTemp - Math.floor(Math.random() * 8) - 2;
                const dayName = i === 0 ? 'Today' : forecastDate.toLocaleDateString('en', { weekday: 'short' });
                const conditionCode = conditionCodes[Math.floor(Math.random() * conditionCodes.length)];
                
                forecast.push({
                    day: dayName,
                    icon: weatherIcons[conditionCode] || 'fas fa-cloud',
                    high: dayTemp,
                    low: lowTemp
                });
            }
            
            return {
                location: locationName,
                temperature: currentTemp,
                condition: "Partly Cloudy", // This would come from the API in a real implementation
                icon: weatherIcons[currentConditionCode] || 'fas fa-cloud',
                conditionCode: currentConditionCode,
                sunrise: sunriseTime,
                sunset: sunsetTime,
                dayLength: dayLength,
                precipitation: Math.floor(Math.random() * 100),
                humidity: 30 + Math.floor(Math.random() * 50),
                windSpeed: 5 + Math.floor(Math.random() * 20),
                pressure: 1000 + Math.floor(Math.random() * 30),
                forecast: forecast
            };
        }

        // Update weather UI with data
        function updateWeatherUI(weatherData) {
            locationTextEl.textContent = weatherData.location;
            temperatureEl.textContent = `${weatherData.temperature}°C`;
            weatherIconEl.innerHTML = `<i class="${weatherData.icon}"></i>`;
            sunriseTimeEl.textContent = weatherData.sunrise;
            sunsetTimeEl.textContent = weatherData.sunset;
            dayLengthEl.textContent = weatherData.dayLength;
            precipitationChanceEl.textContent = `${weatherData.precipitation}%`;
            humidityEl.textContent = `${weatherData.humidity}%`;
            windSpeedEl.textContent = `${weatherData.windSpeed} km/h`;
            pressureEl.textContent = `${weatherData.pressure} hPa`;
            
            // Update forecast
            forecastContainerEl.innerHTML = '';
            weatherData.forecast.forEach((day, index) => {
                const forecastDay = document.createElement('div');
                forecastDay.className = `forecast-day bg-white/5 backdrop-blur-sm rounded-xl p-3 min-w-[80px] text-center border border-white/10 shadow-sm hover:bg-white/10 transition-all duration-200 cursor-pointer transform hover:-translate-y-1 animate-fadeInUp delay-${500 + index * 100} mr-2 last:mr-0 flex-shrink-0`;
                forecastDay.innerHTML = `
                    <div class="day-name text-xs font-medium mb-1 opacity-80">${day.day}</div>
                    <div class="forecast-icon text-xl my-1 drop-shadow-md"><i class="${day.icon}"></i></div>
                    <div class="high-temp text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">${day.high}°</div>
                    <div class="low-temp text-xs opacity-70">${day.low}°</div>
                `;
                forecastContainerEl.appendChild(forecastDay);
            });
        }

        // Show error message
        function showError(message) {
            errorTextEl.textContent = message;
            errorMessageEl.style.display = 'block';
        }

        // Hide error message
        function hideError() {
            errorMessageEl.style.display = 'none';
        }

        // Toggle rain animation on cloud click
        function toggleRain() {
            const isRaining = rainContainerEl.style.display === 'block';
            
            if (isRaining) {
                rainContainerEl.style.display = 'none';
                // Remove all rain elements
                rainContainerEl.innerHTML = '';
            } else {
                rainContainerEl.style.display = 'block';
                // Create rain elements
                for (let i = 0; i < 20; i++) {
                    const rainDrop = document.createElement('div');
                    rainDrop.className = 'rain';
                    rainDrop.style.left = `${Math.random() * 100}%`;
                    rainDrop.style.animationDelay = `${Math.random() * 1.5}s`;
                    rainContainerEl.appendChild(rainDrop);
                }
                
                // Auto stop rain after 5 seconds
                setTimeout(() => {
                    rainContainerEl.style.display = 'none';
                    rainContainerEl.innerHTML = '';
                }, 5000);
            }
        }

        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);