# 🌤️ Weather Forecast Server

A simple weather forecast API with authentication for admin and user roles.

## 🚀 Setup & Run

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/BogdanMoale/weather-forecast-server.git
cd weather-forecast-server
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Configure Environment Variables**

Create a `.env` file in the project root and add the following:

```ini
PORT=3000
SECRET_KEY=your_secret_key_here
OPENWEATHER_API_KEY=your_openweather_api_key
CITY=Arad
XML_FILE_PATH=database/weather.xml
```

### **4️⃣ Start the Server**

```sh
npm start
```

By default, the server runs on **http://localhost:3000**.

---

## 🛠️ API Endpoints

### **1️⃣ Login as Admin**

```sh
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin\"}"
```

### **2️⃣ Login as User**

```sh
curl -X POST http://localhost:3000/login \
-H "Content-Type: application/json" \
-d '{"username":"user","password":"user"}'
```

### **3️⃣ Reset Forecast Data (Admin Only)**

```sh
curl -X GET "http://localhost:3000/getForecast?reset=true" \
-H "Authorization: Bearer YOUR_TOKEN"
```

### **4️⃣ Get Forecast**

```sh
curl -X GET "http://localhost:3000/getForecast" \
-H "Authorization: Bearer YOUR_TOKEN"
```

🔑 Replace `YOUR_TOKEN` with the JWT token received after login.

---
