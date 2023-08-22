import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const discos = async () => {
    const {data} = await instance.get('/discos');
    return data;
}