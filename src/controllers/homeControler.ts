import { Request, Response } from "express";

//home
export const home = (req: Request, res: Response) => {
  const responseHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weather Forecast Server</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; padding: 20px; background-color: #f4f4f4; }
            h1 { color: #333; }
            code { background-color: #ddd; padding: 5px 10px; display: block; margin: 10px 0; white-space: pre-wrap; border-radius: 5px; }
            .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to the Weather Forecast Server!</h1>

            <h2>1. Login as Admin</h2>
            <code>curl -X POST http://localhost:3000/login \ 
-H "Content-Type: application/json" \ 
-d '{"username":"admin","password":"admin"}'</code>

            <h2>2. Login as User</h2>
            <code>curl -X POST http://localhost:3000/login \ 
-H "Content-Type: application/json" \ 
-d '{"username":"user","password":"user"}'</code>

            <h2>3. Reset Forecast Data (Admin Only)</h2>
            <code>curl -X GET "http://localhost:3000/getForecast?reset=true" \ 
-H "Authorization: Bearer YOUR_TOKEN"</code>

            <h2>4. Get Forecast</h2>
            <code>curl -X GET "http://localhost:3000/getForecast" \ 
-H "Authorization: Bearer YOUR_TOKEN"</code>
        </div>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.send(responseHtml);
};
