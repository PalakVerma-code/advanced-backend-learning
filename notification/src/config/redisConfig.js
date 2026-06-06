import radis from 'ioredis';

//configration for redis connection from docker redis intance

const redisConnection = new radis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null, // Disable retry limit
})
redisConnection.on('connect',()=>{
    console.log('Connected to redis successfully');
})
redisConnection.on('error',(err)=>{
    console.error('Error connecting to redis:',err);
})

export default redisConnection;