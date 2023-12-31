import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://34.74.125.199:8000',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const kill = async (selectedIp,pid) => {
    const {data} = await instance.post('/kill', {ip : selectedIp, pid: pid});
    return data;
}