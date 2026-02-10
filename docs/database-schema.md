# Database Schema Overview

The database schema is designed to support the prioritized MVP features identified in Milestone 1.

## User
The User entity supports authentication and role-based behavior for buyers, sellers, and administrators, including OSU-only access.

## Listing
The Listing entity represents items posted by sellers and supports the product catalog and item detail views.

## Transaction
The Transaction entity connects users and listings, enabling secure exchanges and tracking of marketplace activity.

## Message
The Message entity supports communication between buyers and sellers, addressing user needs for coordination and clarification.

## Review
The Review entity allows users to provide feedback on listings, supporting trust and transparency within the marketplace.

## AdminAction
The AdminAction entity supports administrative moderation of listings and reviews, addressing safety and content oversight needs.
