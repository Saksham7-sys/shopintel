# ShopIntel — E-commerce Analytics Dashboard with Revenue Forecasting

ShopIntel is a full-stack e-commerce analytics dashboard that simulates how a business intelligence / analytics product would track store performance, customer behavior, and short-term revenue forecasts.

It combines a **FastAPI + PostgreSQL backend**, a **React dashboard frontend**, and a **machine learning forecasting module** to expose analytics APIs and visualize business KPIs such as revenue, orders, active users, funnel metrics, repeat customers, category performance, and predicted revenue trends.

---

## Live Demo

- **Frontend:** https://shopintel-livid.vercel.app/
- **Backend API / Swagger Docs:** https://shopintel-backend-dp9v.onrender.com/docs
- **GitHub Repository:** https://github.com/Saksham7-sys/shopintel

---

## Project Overview

The goal of ShopIntel is to simulate a real analytics product for an e-commerce business.

Instead of building a traditional store frontend, this project focuses on the **analytics layer** of an e-commerce system:

- aggregating sales, orders, and user event data
- exposing business KPIs through REST APIs
- enabling date-based analytics and trend analysis
- generating synthetic but realistic data at scale
- adding an ML-based revenue forecasting module
- visualizing everything in a dashboard suitable for portfolio/demo use

This project is designed to demonstrate **backend engineering + analytics thinking + dashboard delivery** in one system.

---

# Key Features

## 1) KPI Dashboard
The dashboard provides high-level business metrics such as:

- **Total Revenue**
- **Total Orders**
- **Daily Active Users (DAU)**
- **Average Order Value (AOV)**
- **Conversion Rate**
- **Repeat Customers**

It also includes chart-based views for:

- revenue trend over time
- order trend over time

---

## 2) Advanced Analytics Page
The analytics page supports deeper filtered analysis with:

- quick range filters (`7d`, `30d`, `90d`)
- custom `start_date` / `end_date` filters
- filtered revenue and order metrics
- repeat customer rate
- revenue trend by day
- orders trend by day
- DAU trend
- funnel analytics
- category-level revenue summaries
- top users / highest spenders
- new vs returning customer metrics

---

## 3) Revenue Forecasting Module
ShopIntel includes a forecasting layer that predicts short-term revenue using historical order data.

Forecasting page includes:

- forecast horizon selection
- historical window selection
- projected revenue summary
- average predicted daily revenue
- best forecast day
- combined historical + forecast trend visualization

This makes the project stronger than a static analytics dashboard because it demonstrates a simple **analytics-to-ML pipeline**.

---

## 4) Realistic Data Seeding Pipeline
The project uses generated sample data so the dashboard behaves like a real analytics product instead of a toy CRUD app.

The seeded dataset includes:

- large user dataset
- product catalog across categories
- thousands of orders
- event logs for analytics / funnel tracking
- timestamps distributed across multiple days for trend analysis and forecasting

---

# Tech Stack

## Backend
- **FastAPI** — API framework
- **SQLAlchemy** — ORM for database models and queries
- **PostgreSQL** — primary relational database
- **Pydantic** — request/response schema validation
- **Uvicorn** — ASGI server
- **Python Dotenv / Decouple** — environment configuration

## Frontend
- **React**
- **Vite**
- **React Router**
- **Axios**
- **Recharts** for charts / trend visualizations
- Custom dashboard UI components

## Machine Learning / Forecasting
- Python forecasting module built on historical order revenue data
- Generates short-horizon revenue forecast outputs consumed by frontend

## Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** PostgreSQL (cloud-hosted for deployment)

---

# Architecture

## High-level flow

```text
Users / Orders / Events / Products data
                ↓
        PostgreSQL database
                ↓
 FastAPI analytics + forecasting APIs
                ↓
     React dashboard (Vercel frontend)
                ↓
   KPI cards + charts + forecast views
