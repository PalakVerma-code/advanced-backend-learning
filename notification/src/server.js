import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url'; // 1. Import this built-in utility
import notificationQueue from './queues/notificationQueue.js';
import { initSocket } from './config/socketConfig.js';


// 2. Safely compute absolute paths inside ES Modules ("type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

import './workers/notificationWorker.js';
const PORT = 5000;

// 3. Setup Global Parsing Middlewares first
app.use(express.json());

// 4. Serve the static public directory by stepping OUT of 'src' and INTO 'public'
const publicFolderAbsoluteRoute = path.join(__dirname, '../public');
app.use(express.static(publicFolderAbsoluteRoute));




// --- ROUTES ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: "ok", message: "Notification Microservice is healthy" });
});

app.post('/api/v1/trigger-alert', async (req, res) => {
   try {
        const { title, message, userId } = req.body;
        if (!title || !message || !userId) {
            return res.status(400).json({ status: "error", message: "Missing required fields" });
        }
        
        // Add job to the queue
        const job = await notificationQueue.add('broadcast-alert', {
            title,
            message,
            userId,
            timestamp: Date.now()
        });
        
        console.log(`✅ job ${job.id} queued for user ${userId}`);
        
        // Note: Changing this to 202 is standard practice for asynchronous queue acceptances!
        return res.status(202).json({ status: "success", message: "Notification job added to the queue", jobId: job.id });
   }
   catch (error) {
        console.error('Error triggering notification:', error);
        return res.status(500).json({ status: "error", message: "Failed to trigger notification" });
   }
});

server.listen(PORT, () => {
    console.log(`🚀 Notification Microservice is running on port ${PORT}`);
});