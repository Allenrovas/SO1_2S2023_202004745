import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://34.74.125.199:8000',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const historico = async (selectedIp) => {
    const {data} = await instance.get('/historico/'+selectedIp);
    return data;
}