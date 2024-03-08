export interface Format {
    idx:           number;
    name:          string;
    country:       string;
    destinationid: number;
    coverimage:    string;
    detail:        string;
    price:         number;
    duration:      number;
}

export interface Movie {
    movie_id: number;
    title:    string;
    plot:     string;
    year:     number;
    type:     string;
    genres:   string;
    runtime:  string;
    rating:   number;
    poster:   string;
}

export interface Person {
    person_id: number;
    name:      string;
    birthdate: string;
    photo:     string;
}
