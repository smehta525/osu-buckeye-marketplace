# System Architecture Overview

The OSU Buckeye Marketplace uses a three-tier architecture to support scalability, security, and clear separation of concerns. This design directly supports the user needs and pain points identified in Milestone 1.

## Frontend
The frontend is a React-based web application that allows OSU students to browse listings, view product details, communicate with sellers, and manage their accounts. This layer focuses on usability and accessibility, addressing user needs for easy navigation and efficient item discovery.

## Backend
The backend consists of a .NET Web API that handles business logic, authentication, and access control. OSU email verification ensures that only verified students can use the platform, addressing trust and safety concerns identified during user research. The backend manages listings, messaging, reviews, transactions, and admin moderation.

## Database
A SQL Server database stores core application data including users, listings, messages, reviews, and transactions. The schema is designed to support prioritized MVP features while allowing future expansion as additional features are introduced.

## External Services
External services are used for email verification, payment processing, and cloud hosting. These services support system reliability, security, and scalability, ensuring a smooth experience for users during launch and future growth.
