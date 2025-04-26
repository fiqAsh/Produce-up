CSE470 Section 6
Group 10
M1 : Ashfiqur rahman (22301593)
M2 : Hasna Johir Borno (22301671)
M3 : MD. Rafiqul Islam (22101759)
M4 : Meraj Mahamud (24241318)

Project Name : Produce Up

Synopsis: This Project focuses on solving the problem of price discrepancies in fresh Produce in our country. We often see that produce that is low in price in rural areas has four to five times the price in cities. A centralized system can lower this cost by relative margin and make it affordable to customers. So in this project we will focus on making a system that will let customers know how much produce is around them and also a delivery system that will deliver produce nearby the users.

Produce Up - Functional & Non-Functional Requirements

Functional Requirements

#

Requirement Description

F1
User Registration & Login – Users can sign up and log in with role-based access.
F2
Role Management – There are three roles: Admin, Market Manager, and User.
F3
Market CRUD – Admin can create, update, and delete markets.
F4
Assign Market Managers – Admin can assign managers to markets.
F5
Produce Management – Admin and Managers can manage produce and pricing.
F6
Price Update – Managers can update produce prices for their assigned market.
F7
View Nearby Market – Users can see prices of produce in their nearest market.
F8
Price Comparison – Users can compare prices of produce across all markets.
F9
Lowest Price Finder – Users can find the market offering the lowest price for an item.
F10
Market-to-Market Delivery – System allows delivery between markets twice daily.
F11
Delivery Scheduling – Admin and Managers can manage delivery schedules.
F12
Buy/Request Produce – Users can request produce delivery from other markets.
F13
Location Detection – App can detect and use user's location for proximity-based results.
F14
Notifications – Alerts for users, managers, and admin on events like price drops or deliveries.
F15
Admin Dashboard – View overall app statistics, reports, and market performance.
F16
User & Manager Dashboards – Personalized views for activities and history.

Non-Functional Requirements

#

Requirement Description
NF1
Performance – The app should load pages and results within 2 seconds.
NF2
Scalability – Should handle a growing number of users, markets, and produce data.
NF3
Security – Role-based access, secure login (JWT/Auth), data validation.
NF4
Usability – Clean and intuitive UI for all user types.
NF5
Availability – The system should be available 99.9% of the time.
NF6
Maintainability – Codebase should be modular and well-documented for easy updates.

NF8
Localization – Support for Bangla and English languages.
NF9
Data Accuracy – Ensure produce prices are up-to-date and consistent.
NF10
Backup & Recovery – Daily backups and ability to restore data in case of failure.

Features:

M1
Users can sign up, login, logout

Users can compare prices across markets

Admin can create/delete new markets

Admin can assign managers

M2
Users can find produce with the lowest price

Users can find nearest market

Admin can update all markets

Managers can update their assigned markets

M3
Users can see delivery time and charge

Users can track delivery vehicle

Managers can process orders of their markets

Delivery man can update the delivery status

M4
Admin can see statistics of all markets

Managers can see statistics of their market

Users can get notifications when price drops

Users, Admins, Managers, Delivery man will have different dashboards
