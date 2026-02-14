// server.js - ส่วน CORS (เพิ่ม/แก้ไข)
const cors = require('cors');

// CORS configuration - รองรับทั้ง Local และ Railway
const corsOptions = {
    origin: function (origin, callback) {
        // อนุญาต requests ที่ไม่มี origin (เช่น mobile apps, curl)
        // และ origins ที่อนุญาต
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:8080',
            'https://localhost',
            /\.railway\.app$/  // อนุญาตทุก subdomain ของ railway.app
        ];
        
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed instanceof RegExp) return allowed.test(origin);
            return allowed === origin;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('CORS blocked:', origin);
            callback(null, true); // อนุญาตทุก origin สำหรับ Lab
        }
    },
    credentials: true
};

app.use(cors(corsOptions));