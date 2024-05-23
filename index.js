const searchInput = document.querySelector('#search');
const container = document.querySelector('.container');
const loader = document.querySelector('.loader');

const apiKey = '9d781cebafac906c82989246c5066285'; // Tu API Key de OpenWeatherMap

// Función que obtiene el clima y la temperatura para una ciudad dada
const getWeather = async (city) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

let countries = [];

const getCountries = async () => {
  try {
    loader.style.display = 'block';
    searchInput.disabled = true; // Deshabilitar el campo de entrada
    container.innerHTML = ''; // Limpiar el contenedor mientras se carga
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();
    countries = data;
    loader.style.display = 'none';
    searchInput.disabled = false; // Habilitar el campo de entrada después de cargar
  } catch (error) {
    console.error('Error fetching countries:', error);
    loader.style.display = 'none';
    searchInput.disabled = false; // Habilitar el campo de entrada en caso de error
  }
};

const displayCountry = async (country) => {
  container.innerHTML = '';
  const countryElement = document.createElement('div');
  countryElement.classList.add('country');
  countryElement.innerHTML = `
    <h2>${country.name.common}</h2>
    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
    <p><strong>Región:</strong> ${country.region}</p>
    <p><strong>Población:</strong> ${country.population ? country.population.toLocaleString() : 'N/A'}</p>
    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="100">
  `;

  const weatherData = await getWeather(country.capital[0]);
  if (weatherData) {
    const { main, weather } = weatherData;
    const temperature = main.temp;
    const weatherDescription = weather[0].description;
    const weatherInfo = document.createElement('div');
    weatherInfo.innerHTML = `
      <h3>Información del clima:</h3>
      <p><strong>Temperatura:</strong> ${temperature}°C</p>
      <p><strong>Descripción del clima:</strong> ${weatherDescription}</p>
    `;
    countryElement.appendChild(weatherInfo);
  } else {
    const weatherInfo = document.createElement('p');
    weatherInfo.textContent = 'No se pudo obtener la información del clima';
    countryElement.appendChild(weatherInfo);
  }

  container.appendChild(countryElement);
};

const displayResult = (countries) => {
  container.innerHTML = '';
  
  if (searchInput.value.trim() === '') {
    container.innerHTML = '<p>Por favor, ingrese un país</p>';
    return;
  }

  if (countries.length > 10) {
    container.innerHTML = '<p>Por favor, sé más específico</p>';
    return;
  }

  if (countries.length === 0) {
    container.innerHTML = '<p>No se encontraron países</p>';
    return;
  }

  countries.forEach(country => {
    const countryElement = document.createElement('div');
    countryElement.classList.add('country');
    countryElement.innerHTML = `
      <img src="${country.flags.png}" alt="Bandera de ${country.name.common}" width="100">
      <h2>${country.name.common}</h2>
    `;
    container.appendChild(countryElement);
    
    countryElement.addEventListener('click', () => {
      displayCountry(country);
    });
  });
};

getCountries();

searchInput.addEventListener('input', async () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().startsWith(searchTerm)
  );
  
  displayResult(filteredCountries);
});
