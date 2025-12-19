import { createClient } from 'redis';
const testRedis = async () => {
    const client = createClient({ url: `redis://${process.env.REDIS_HOST}:6379` });

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();
    await client.set('key', 'value');
    const value = await client.get('key');
    console.log("Valor de redis: " + value);

}
export { testRedis }