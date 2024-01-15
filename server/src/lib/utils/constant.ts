export const PORT = Number(process.env.PORT) || 8080;
export const SECRET_KEY = process.env.SECRET_KEY || 'SECRET_KEY';
export const DOMAIN = process.env.DOMAIN || 'localhost';
export const CORS = JSON.parse(
    process.env.CORS || `["http://localhost:3000","http://localhost:8080"]`
);
