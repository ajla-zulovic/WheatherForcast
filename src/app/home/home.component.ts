import { Component } from '@angular/core';
import { CITIES, City, WeatherResponse } from '../Models';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  cities: City[] = CITIES;
  filteredCities: City[] = this.cities; 
  searchTerm: string = ''; 
  selectedCity: City | null = null; 
  weatherData: WeatherResponse | null = null; 
  loading: boolean = false; 
  cityNotFound: boolean = false; 
  source:string='assets/planet3.jpg';
  constructor(private http: HttpClient) {}

  onSearchChange(): void {
    this.filteredCities = this.cities.filter(city =>
      city.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  
  
    if (this.filteredCities.length === 0 && this.searchTerm) {
      this.cityNotFound = true;
    } else {
      this.cityNotFound = false;
    }
  }
  
  onCitySelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; 
    const selectedCityName = selectElement.value.toLowerCase(); 
    const selectedCity = this.cities.find(city => city.name.toLowerCase() === selectedCityName); 
  
    if (selectedCity) {
      this.selectedCity = selectedCity; 
      this.getWeather(selectedCity.name);
    } else {
      this.cityNotFound = true; 
    }
  }
  
  
  getWeather(cityName: string): void {
    this.loading = true;
    const apiKey = '50d7b4681dc17c4439f2f169fc539ca0';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    this.http.get<WeatherResponse>(url).subscribe(
      (data) => {
        this.weatherData = data;
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        console.error('Greška prilikom dobijanja podataka o vremenu:', error);
        this.loading = false;
        if (error.status === 404) {
          alert('Grad nije pronađen. Provjeri ime grada i pokušaj ponovo.');
        } else if (error.status === 401) {
          alert('API ključ je neispravan ili je istekao. Provjeri svoj API ključ.');
        } else {
          alert('Došlo je do greške pri pristupu podacima.');
        }
      }
    );
  }

  getWeatherIcon(description: string): string {
    if (description.includes('snow')) {
        return 'assets/snowflake.png'; 
    } else if (description.includes('rain')) {
        return 'assets/rain.png'; 
    } else if (description.includes('clear')) {
        return 'assets/thermostat.png'; 
    } else if (description.includes('cloud')) {
        return 'assets/cloud.png'; 
    }
    return 'assets/default.png'; 
  }
}
