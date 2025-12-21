import { createClient } from 'redis';
const testRedis = async () => {
    const client = createClient({ url: `redis://${process.env.REDIS_HOST}` });

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();
    await client.set('key', 'value');
    const value = await client.get('key');
    console.log("REDIS PERFECTO Valor de redis: " + value);

}
export { testRedis }