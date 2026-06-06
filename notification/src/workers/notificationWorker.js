import { Worker } from "bullmq";
import redisConnection from "../config/redisConfig.js";
import {getSocketInstance} from "../config/socketConfig.js";// importing function to get socket instance for real-time updates
//initialize worker that listem same queue name like notification-blast
const notificationWorker=new Worker('notification-blast',async(job)=>{
    //simulate notification sending
    console.log(`Processing job ${job.id} for user ${job.data.userId}`);
    const {title,message,userId}=job.data;
    //here you can integrate with actual notification service like email,sms or push notification
   
    //simulate delay
    await new Promise(resolve=>setTimeout(resolve,2000));
    //fetch our live socket instance to emit real-time updates to clients
    const cleanId=String(userId).trim();
    const io=getSocketInstance();
    //emit notification to specific user room
    io.to(cleanId).emit('new-notification',{
        title,
        message,
        jobId: job.id,
        timestamp:Date.now()
    });
    return {success:true,processedAt:new Date().toISOString()}; 
},{
    connection:redisConnection,//worker options
    concurrency:1 //process up to 1 job concurrently 
})
//event listeners for worker to moniter health and performance
notificationWorker.on('completed',(job,result)=>{
    console.log(`Job ${job.id} completed with result:`,result);
})
notificationWorker.on('failed',(job,err)=>{
    console.error(`Job ${job.id} failed with error:`,err);
})
notificationWorker.on('error',(err)=>{
    console.error('Worker error:',err);
})
export default notificationWorker;