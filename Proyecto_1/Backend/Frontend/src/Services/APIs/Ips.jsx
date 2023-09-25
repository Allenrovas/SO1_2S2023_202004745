import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://34.74.125.199:8000',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const ips = async () => {
    const {data} = await instance.get('/ips');
    return data;
}