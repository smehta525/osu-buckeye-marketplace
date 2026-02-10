# ADR 001: Technology Stack Selection

## Status
Accepted

## Context
The OSU Buckeye Marketplace requires a scalable, secure, and maintainable architecture that supports authenticated users, real-time listings, and transaction management.

## Decision
The system uses a React frontend, a .NET Web API backend, and a SQL Server database. Cloud deployment is used to support scalability and availability.

## Rationale
- React enables modular UI components and efficient rendering for a dynamic product catalog.
- .NET provides strong support for authentication, API development, and business logic.
- SQL Server supports relational data needed for users, listings, and transactions.
- Cloud hosting allows the system to scale as usage increases.

## Consequences
This technology stack supports MVP development while allowing future enhancements such as additional moderation tools and analytics.
