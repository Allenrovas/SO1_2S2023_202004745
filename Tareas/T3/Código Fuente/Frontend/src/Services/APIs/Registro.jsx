import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const registro = async (title,artist,yearR,genre) => {
    const {data} = await instance.post('/registro', {title: title, artist: artist, yearR: parseInt(yearR), genre: genre});
    return data;
}