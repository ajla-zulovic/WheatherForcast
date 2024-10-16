
export class City {
    constructor(public name: string) {}
  }
  
  export const CITIES: City[] = [
    new City('Zagreb'),
    new City('Belgrade'),
    new City('Sarajevo'),
    new City('Ljubljana'),
    new City('Podgorica'),
    new City('Mostar')
  ];
  
  
  export interface WeatherResponse {
    main: {
        temp: number;
        humidity: number;
        pressure: number;
    };
    weather: Array<{
        description: string;
    }>;
    wind: {
        speed: number;
    };
  }
  
  export interface Roles{
    roleId:number;
    roleName: 'admin' | 'user' ;
  }
  
  export interface User{
    uid:string;
    email:string;
    username: string;
    role:Roles;
    
  }

  export interface Response {
    responseText: string;
    rating: 'loše' | 'srednje' | 'odlično' | null;
  }


  export interface Request {
    id: string;
    city: string;
    forecast: number;
    requestDetails: string;
    userId: string;
    userEmail: string;
    replyMessage?: string; // Ovo je opcionalno, u slučaju da admin nije odgovorio
  }
  