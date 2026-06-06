import {Server} from 'socket.io';

let io=null;
// Initialize Socket.IO server
 const initSocket=(server)=>{
    io=new Server(server,{
        cors:{
            origin:'*', // Allow all origins for testing, adjust in production
            methods:['GET','POST']
        }
    })
    // Handle Socket.IO connections
    io.on('connection',(socket)=>{
        console.log(`Client connected: ${socket.id}`);
        //joint room for real-time notification updates if needed
        socket.on('join-room',(userId)=>{
            const cleanId=String(userId).trim();
            socket.join(cleanId);
            console.log(`Socket ${socket.id} joined room ${cleanId}`);
        })
        // You can add event listeners for this socket here if needed
        socket.on('disconnect',()=>{
            console.log(`Socket disconnected: ${socket.id}`);
        })
    })
     return io;
}
// Function to fetch the active io instance from anywhere in our app // This allows us to emit events to clients from other parts of the application, such as workers
function getSocketInstance(){
    if(!io){
        throw new Error('Socket.IO instance not initialized. Call initSocket(server) first.');
    }
    return io;
}
export {initSocket,getSocketInstance};

