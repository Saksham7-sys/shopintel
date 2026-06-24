# ShopIntel

ShopIntel is a full-stack **ecommerce analytics dashboard** built with **FastAPI, PostgreSQL, React, and a revenue forecasting ML module**.  
It simulates a real analytics system where order, product, user, and event data are collected, analyzed, visualized, and used for short-term revenue prediction.

## Live Demo
- **Frontend:** https://shopintel-livid.vercel.app/
- **Backend API:** https://shopintel-backend-dp9v.onrender.com
- **Backend Docs (Swagger):** https://shopintel-backend-dp9v.onrender.com/docs

---

# Features

## Core ecommerce backend
- User, product, order, and event management APIs
- PostgreSQL-backed relational data model
- FastAPI REST architecture with modular routers and CRUD layer
- Seeded realistic synthetic ecommerce data for analytics and ML testing

## Analytics KPIs
- Total revenue
- Total orders
- Daily active users (DAU)
- Conversion rate
- Average order value (AOV)
- Repeat customers

## Analytics charts / insights
- Revenue trend by day
- Orders trend by day
- DAU trend by day
- Funnel summary
- Sales by category
- Category revenue trend
- Top products
- Top users / highest spenders
- Customer breakdown
- Customer repeat rate

## Filtering support
Analytics endpoints support:
- `days`
- `start_date`
- `end_date`

This allows both quick-range analytics and custom date-window analysis.

## ML forecasting module
- Revenue forecasting based on historical order data
- Forecast for next **N days**
- Forecast summary endpoint for dashboard cards
- Historical vs predicted revenue visualization in frontend

---

# Tech Stack

## Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Uvicorn
- Python

## Frontend
- React
- Vite
- Axios
- Recharts
- Tailwind CSS

## ML / Data
- Pandas / NumPy / forecasting pipeline
- Synthetic ecommerce data generation for model training and analytics testing

## Deployment
- **Frontend:** Vercel
- **Backend:** Render

---

# Project Structure

```bash
shopintel/
│
├── backend/
│   ├── app/
│   │   ├── crud/
│   │   ├── ml/
│   │   ├── routers/
│   │   ├── database.py
│   │   ├── models.py
│   │   └── main.py
│   ├── requirements.txt
│   └── seed_data.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── docs/
│   └── images/
│       ├── dashboard.png
│       ├── analytics.png
│       └── forecasting.png
│
└── README.md
