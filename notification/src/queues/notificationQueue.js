import {Queue} from 'bullmq';
import redisConnection from '../config/redisConfig.js';

const notificationQueue=new Queue('notification-blast',{
    connection:redisConnection
})
export default notificationQueue;