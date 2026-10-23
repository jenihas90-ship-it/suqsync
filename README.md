# SuqSync (ሱቅሲንክ / SuuqSiink) 🇪🇹
> **Lightweight, mobile-first Inventory & Sales Tracker tailored for Ethiopian SMEs**  
> *Target: Innobiz-K Incubation Pitch | Aligned with Digital Ethiopia 2025/2030 & Ethiopian Startup Proclamation No. 1396/2025*

---

## 🌟 Mandatory First-Time Suq Owner Registration
To onboard small shops and comply with Ethiopian trade regulations and micro-loan underwriting:
- **Personal Information**: Full Legal Name, Primary Mobile Number (+251 9...), Security PIN/Password, and National ID / Fayda / Kebele ID number.
- **Shop & Business Information**: Shop Name, Business Type (Kiosk/Suq, Mini-Mart, Cafe/Buna, Spices/Grains), TIN Number, and Commercial Trade License Number.
- **Location Hierarchy**: Region, City, Subcity / Zone, Woreda, and Specific Landmark.
- **Receiving Accounts**: Telebirr Merchant Till Number, Settlement Bank (CBE, Coop Bank, Awash, Sinqee, BoA), and Bank Account Number.
- **Pilot Designation**: Backend auto-assigns a unique **Innobiz-K Pilot Shop ID** (e.g. `SUQ-ETH-619`).

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new Suq Owner with full verified information |
| `POST` | `/api/auth/login` | Authenticate owner via phone and security PIN |
| `GET` | `/api/auth/status` | Check if this instance has a registered merchant |
| `PUT` | `/api/auth/profile` | Update registered merchant profile & settings |
| `GET` | `/api/products` | Fetch all active inventory items and stock levels |
| `POST` | `/api/products` | Register a new product into the database |
| `PUT` | `/api/products/:id` | Update product details or stock quantity |
| `DELETE` | `/api/products/:id` | Remove a product |
| `POST` | `/api/sales` | Record transaction and trigger backend `stockQty` deduction |
| `GET` | `/api/sales` | Fetch sales history |
| `GET` | `/api/dashboard/daily` | Aggregate total revenue by payment method for today |
| `GET` | `/api/health` | Health check & database connection status |

---

## 💳 Supported Payment Methods & Banks
SuqSync supports all major Ethiopian digital payment services and physical cash:
1. **Cash (ጥሬ ገንዘብ / Qarshii Callaa)** - Physical cash drawer reconciliation
2. **Telebirr (ቴሌብር / Telebirr)** - Dynamic QR Code & Counter Stand Posters
3. **CBE (የኢትዮጵያ ንግድ ባንክ / Commercial Bank of Ethiopia)** - CBE Birr / Mobile Banking
4. **Coop Bank (የኦሮሚያ ኅብረት ሥራ ባንክ / Baankii Hojii Gamtaa Oromiyaa)** - Coopay-Ebirr
5. **Awash Bank (አዋሽ ባንክ / Baankii Hawaas)** - Awash Birr / Mobile
6. **Sinqee Bank (ሲንቄ ባንክ / Baankii Siinqee)** - Siinqee Mobile Banking
7. **Bank of Abyssinia (አቢሲኒያ ባንክ / Baankii Abisiiniyaa)** - BoA Mobile
8. **Other Bank / App** - Extensible for other financial institutions

---

## 🏃 How to Run SuqSync

### 1. Start the Backend Server
```powershell
cd server
npm start
```
The backend starts on `http://localhost:5000`.

### 2. Start the Frontend Application
```powershell
cd client
npm run dev
```
The React frontend starts on `http://localhost:3000`.
