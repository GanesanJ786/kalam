# KALAM - Academy Management Platform
## Complete Pricing & Cost Structure Document

**Prepared by:** Kalam Team  
**Date:** April 2026  
**Version:** 1.0

---

## 1. INFRASTRUCTURE COST BREAKDOWN (Annual)

### 1.1 Fixed Infrastructure Costs

| Item | Provider | Annual Cost (₹) | Monthly Equivalent (₹) |
|------|----------|----------------:|------------------------:|
| Web Hosting | Razor | ₹1,800 | ₹150 |
| Domain Name (.in/.com) | GoDaddy | ₹1,200 | ₹100 |
| SSL Certificate | Included (Razor/Firebase) | ₹0 | ₹0 |
| **Subtotal – Fixed Infra** | | **₹3,000** | **₹250** |

### 1.2 Variable Infrastructure Costs (Firebase – Blaze Plan)

| Service | Free Tier (Monthly) | Cost Beyond Free | Notes |
|---------|---------------------|------------------|-------|
| Firestore Reads | 1,500,000 | ₹2.50 per 100K | Real-time student/coach data |
| Firestore Writes | 600,000 | ₹7.50 per 100K | Attendance, performance entries |
| Firestore Deletes | 600,000 | ₹0.85 per 100K | Record cleanup |
| Firestore Storage | 1 GiB | ₹15/GiB/month | Student & coach records |
| Firebase Auth | 50,000 MAUs | Free | Email/password login |
| Cloud Storage | 5 GB | ₹2.20/GB/month | Profile photos, logos |
| Cloud Functions | 2M invocations | ₹33 per 1M | Welcome emails |
| Firebase Hosting (CDN) | 10 GB transfer | ₹12.50/GB | Staging environment |
| Network Egress | 10 GiB | ₹10/GiB | Data transfer to users |

> **Note:** 1 USD = ₹83.50 (approximate, used for all conversions)

### 1.3 Firebase Cost Per Academy Tier

| Academy Size | Coaches | Students | Monthly Firebase Cost |
|-------------|--------:|---------:|---------------------:|
| Micro | 1-2 | 1-30 | **₹0** (Free tier covers it) |
| Small | 3-5 | 31-100 | **₹0** (Free tier covers it) |
| Medium | 6-10 | 101-300 | **₹50-80** |
| Large | 11-20 | 301-500 | **₹150-250** |
| Enterprise | 20+ | 500+ | **₹500-1,250** |

---

## 2. INITIAL SETUP COST (One-Time)

These are the one-time costs incurred when onboarding a new academy.

### 2.1 Setup Cost Split-Up

| Item | Description | Cost (₹) |
|------|-------------|----------:|
| Academy Configuration | Create academy profile, branding, logo setup | ₹500 |
| Coach Onboarding | Head coach account creation, role assignment | ₹300 |
| Ground/Facility Setup | Add training grounds, assign locations | ₹200 |
| Student Data Migration | Import existing student records (up to 100) | ₹1,000 |
| Student Data Migration | Import existing student records (101-500) | ₹2,500 |
| Training Session | 1-hour video call walkthrough for coaches | ₹500 |
| Custom Configuration | Age groups, competency levels, scholarship tiers | ₹500 |
| **Total Setup (Small Academy)** | **Up to 100 students** | **₹3,000** |
| **Total Setup (Medium Academy)** | **101-300 students** | **₹5,000** |
| **Total Setup (Large Academy)** | **301+ students** | **₹7,500** |

### 2.2 Optional Add-On Setup Costs

| Item | Description | Cost (₹) |
|------|-------------|----------:|
| Bulk Photo Upload | Profile images for all students | ₹1,000 |
| Historical Data Import | Past attendance/performance records | ₹2,000 |
| Custom Report Templates | Tailored Excel export formats | ₹1,500 |
| Additional Training | Extra 1-hour session | ₹500/session |

---

## 3. DEVELOPMENT COST ALLOCATION

### 3.1 Platform Development Investment

| Component | Effort | Estimated Value (₹) |
|-----------|--------|---------------------:|
| Student Management (CRUD, approval, scholarship) | Core | ₹1,50,000 |
| Attendance System (student + coach, date-wise, range) | Core | ₹1,20,000 |
| Performance Tracking & Analytics | Core | ₹80,000 |
| Payment & Fee Management | Core | ₹60,000 |
| Coach Management & Task System | Core | ₹70,000 |
| Multi-Ground/Facility Support | Core | ₹40,000 |
| Authentication & Session Management | Core | ₹50,000 |
| Excel Export & Reporting | Core | ₹40,000 |
| PWA (Progressive Web App) | Core | ₹30,000 |
| UI/UX (Angular Material) | Core | ₹60,000 |
| **Total Platform Development** | | **₹7,00,000** |

### 3.2 Ongoing Development Cost (Monthly)

| Item | Hours/Month | Rate (₹/hr) | Monthly Cost (₹) |
|------|------------:|-------------:|-----------------:|
| Bug Fixes & Patches | 8 | ₹500 | ₹4,000 |
| Minor Feature Updates | 6 | ₹500 | ₹3,000 |
| Dependency/Security Updates | 4 | ₹500 | ₹2,000 |
| Performance Optimization | 2 | ₹500 | ₹1,000 |
| **Total Ongoing Dev** | **20** | | **₹10,000** |

---

## 4. SUPPORT COST STRUCTURE

### 4.1 Support Tiers

| Support Level | Response Time | Availability | Includes |
|---------------|-------------|--------------|----------|
| **Basic** (included) | 48 hours | Email only, Mon-Fri | Bug reports, usage queries |
| **Standard** | 24 hours | Email + WhatsApp, Mon-Sat | Above + guidance, minor config |
| **Premium** | 4 hours | Email + WhatsApp + Call, 7 days | Above + priority fixes, training |

### 4.2 Support Cost Per Tier

| Support Level | Monthly Cost (₹) | Annual Cost (₹) |
|---------------|------------------:|-----------------:|
| Basic | Included in plan | Included in plan |
| Standard | ₹500 | ₹5,000 (₹1,000 savings) |
| Premium | ₹1,500 | ₹15,000 (₹3,000 savings) |

---

## 5. SUBSCRIPTION PLANS

### 5.1 MONTHLY SUBSCRIPTION

| Plan | Coaches | Students | Monthly Price (₹) | Includes |
|------|--------:|---------:|-------------------:|----------|
| **Free Trial** | 1 | Up to 15 | **₹0** | 30-day full access, Basic support |
| **Starter** | Up to 2 | Up to 30 | **₹999** | All features, Basic support, 1 ground |
| **Basic** | Up to 5 | Up to 100 | **₹1,999** | All features, Basic support, 3 grounds |
| **Standard** | Up to 10 | Up to 250 | **₹2,999** | All features, Standard support, 5 grounds |
| **Pro** | Up to 20 | Up to 500 | **₹3,999** | All features, Standard support, 10 grounds |
| **Enterprise** | Unlimited | Unlimited | **₹6,999** | All features, Premium support, unlimited grounds |

### 5.2 ANNUAL SUBSCRIPTION (One-Time Payment for 1 Year)

| Plan | Coaches | Students | Annual Price (₹) | Effective Monthly (₹) | Savings vs Monthly |
|------|--------:|---------:|------------------:|----------------------:|-------------------:|
| **Starter** | Up to 2 | Up to 30 | **₹8,799** | ₹733 | **₹3,189 (27% off)** |
| **Basic** | Up to 5 | Up to 100 | **₹17,499** | ₹1,458 | **₹6,489 (27% off)** |
| **Standard** | Up to 10 | Up to 250 | **₹26,499** | ₹2,208 | **₹9,489 (26% off)** |
| **Pro** | Up to 20 | Up to 500 | **₹34,999** | ₹2,917 | **₹12,989 (27% off)** |
| **Enterprise** | Unlimited | Unlimited | **₹61,999** | ₹5,167 | **₹21,989 (26% off)** |

### 5.3 What's Included in ALL Paid Plans

| Feature | Included |
|---------|----------|
| Student Registration & Approval | ✅ |
| Attendance Tracking (Student + Coach) | ✅ |
| Performance Analytics & Tracking | ✅ |
| Payment & Fee Management | ✅ |
| Scholarship Management | ✅ |
| Multi-Ground Management | ✅ (limit by plan) |
| Coach Task Assignment | ✅ |
| Excel Export Reports | ✅ |
| PWA (Mobile Access) | ✅ |
| Auto Session Timeout (Security) | ✅ |
| Profile Image Upload | ✅ |
| Email Notifications | ✅ |
| Data Backup (Firebase) | ✅ |
| SSL Encryption | ✅ |

---

## 6. COMPLETE COST-TO-REVENUE MODEL

### 6.1 Your Cost Per Academy Per Month

| Cost Component | Starter | Basic | Standard | Pro | Enterprise |
|----------------|--------:|------:|---------:|----:|----------:|
| Hosting + Domain (shared) | ₹5 | ₹5 | ₹5 | ₹5 | ₹5 |
| Firebase Usage | ₹0 | ₹0 | ₹25 | ₹80 | ₹300 |
| Support (allocated) | ₹50 | ₹100 | ₹200 | ₹300 | ₹500 |
| Dev Maintenance (allocated) | ₹100 | ₹100 | ₹100 | ₹100 | ₹100 |
| **Total Cost/Academy** | **₹155** | **₹205** | **₹330** | **₹485** | **₹905** |
| **Revenue (Monthly)** | **₹999** | **₹1,999** | **₹2,999** | **₹3,999** | **₹6,999** |
| **Gross Profit** | **₹844** | **₹1,794** | **₹2,669** | **₹3,514** | **₹6,094** |
| **Margin %** | **84%** | **90%** | **89%** | **88%** | **87%** |

> **Note:** Hosting + Domain cost (₹250/month) is shared across all academies. With 50 academies, per-academy share = ₹5.

### 6.2 Break-Even Analysis

| Fixed Monthly Costs | Amount (₹) |
|---------------------|----------:|
| Hosting + Domain | ₹250 |
| Ongoing Development | ₹10,000 |
| Your Time (Support/Admin) | ₹5,000 |
| **Total Fixed Cost** | **₹15,250** |

| Scenario | Academies Needed | Revenue | Profit |
|----------|----------------:|--------:|-------:|
| All Starter (₹999) | 16 academies | ₹15,984 | Break-even |
| All Basic (₹1,999) | 8 academies | ₹15,992 | Break-even |
| Mixed (realistic) | **12 academies** | ~₹16,000 | Break-even |

---

## 7. MARKET COMPARISON

| Platform | Target Market | Monthly Price | Annual Price | Kalam Advantage |
|----------|--------------|:-------------:|:------------:|-----------------|
| **ClassJuggler** | Global | $45-85 (₹3,750-7,100) | $450-850 | Kalam is **3-4x cheaper** |
| **TeamSnap** | Global | $10-30/team (₹835-2,500) | $100-300/team | Kalam offers more features |
| **CoachNow** | Global | $8-29/coach (₹670-2,420) | $80-290/coach | Kalam is per-academy, not per-coach |
| **iClassPro** | Global | $33-197 (₹2,750-16,450) | $330-1,970 | Kalam is significantly cheaper |
| **Omnify** | Global | $79-249 (₹6,600-20,800) | $790-2,490 | Kalam at ₹1,999 vs ₹6,600 |
| **Local Spreadsheets** | India | ₹0 | ₹0 | Kalam offers digital transformation |
| **Kalam** | **India** | **₹999-6,999** | **₹8,799-61,999** | **India-focused, affordable** |

---

## 8. RECOMMENDED ONBOARDING PACKAGES

### Package A: Quick Start (Small Academies)

| Component | One-Time | Monthly | Annual |
|-----------|--------:|---------:|--------:|
| Setup Fee | ₹3,000 | — | — |
| Starter Plan | — | ₹999 | ₹8,799 |
| Basic Support | — | Included | Included |
| **Total Year 1** | | | **₹11,799** |
| **Total Year 2+** | | | **₹8,799** |

### Package B: Growth (Medium Academies)

| Component | One-Time | Monthly | Annual |
|-----------|--------:|---------:|--------:|
| Setup Fee | ₹5,000 | — | — |
| Basic Plan | — | ₹1,999 | ₹17,499 |
| Standard Support | — | ₹500 | ₹5,000 |
| **Total Year 1** | | | **₹27,499** |
| **Total Year 2+** | | | **₹22,499** |

### Package C: Professional (Large Academies)

| Component | One-Time | Monthly | Annual |
|-----------|--------:|---------:|--------:|
| Setup Fee | ₹7,500 | — | — |
| Standard Plan | — | ₹2,999 | ₹26,499 |
| Standard Support | — | ₹500 | ₹5,000 |
| Data Migration | ₹2,000 | — | — |
| **Total Year 1** | | | **₹40,999** |
| **Total Year 2+** | | | **₹31,499** |

### Package D: Enterprise (Multi-Center Academies)

| Component | One-Time | Monthly | Annual |
|-----------|--------:|---------:|--------:|
| Setup Fee | ₹7,500 | — | — |
| Pro/Enterprise Plan | — | ₹3,999-6,999 | ₹34,999-61,999 |
| Premium Support | — | ₹1,500 | ₹15,000 |
| Data Migration | ₹3,000 | — | — |
| Custom Training (2 sessions) | ₹1,000 | — | — |
| **Total Year 1 (Pro)** | | | **₹61,499** |
| **Total Year 1 (Enterprise)** | | | **₹88,499** |

---

## 9. REVENUE PROJECTIONS

### Year 1 Target (Conservative)

| Quarter | New Academies | Total Academies | Monthly Revenue (₹) | Quarterly Revenue (₹) |
|---------|-------------:|----------------:|---------------------:|----------------------:|
| Q1 | 10 | 10 | ₹15,000 | ₹45,000 |
| Q2 | 15 | 25 | ₹37,500 | ₹1,12,500 |
| Q3 | 20 | 45 | ₹67,500 | ₹2,02,500 |
| Q4 | 25 | 70 | ₹1,05,000 | ₹3,15,000 |
| **Year 1 Total** | **70** | | | **₹6,75,000** |
| + Setup Fees (one-time) | | | | **₹2,80,000** |
| **Grand Total Year 1** | | | | **₹9,55,000** |

### Year 1 Costs

| Item | Annual Cost (₹) |
|------|----------------:|
| Hosting + Domain | ₹3,000 |
| Firebase (70 academies) | ₹6,000 |
| Development (maintenance) | ₹1,20,000 |
| Support Staff (part-time) | ₹60,000 |
| Marketing (basic) | ₹24,000 |
| **Total Year 1 Cost** | **₹2,13,000** |
| **Year 1 Profit** | **₹7,42,000** |

---

## 10. PRICING TIPS

1. **Always offer the Free Trial** — 30 days, 1 coach, 15 students — to let academies experience the platform
2. **Push Annual Plans** — better cash flow for you, savings for the customer
3. **Setup fee is non-negotiable** — covers your onboarding time
4. **Upsell grounds** — when an academy opens a new training center, they naturally upgrade
5. **Support is a revenue stream** — Basic included, Standard/Premium are paid add-ons
6. **Data migration creates lock-in** — once their data is in Kalam, switching cost is high

---

*This document is confidential and intended for internal pricing decisions.*  
*Kalam © 2024-2026. All Rights Reserved.*
