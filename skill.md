# Project 730

## Vision

Build a modern web application called **Project 730**.

Project 730 is a personal Learning Management System (LMS), Developer Growth Tracker, Finance Tracker, and Life Journal.

The website tracks my learning journey, career growth, projects, finances, and daily consistency for **730 days (2 years)**.

The website is **not** a public portfolio.

It is a private platform shared between only two users.

---

# Project Goal

Start Date

20 July 2026

End Date

20 July 2028

Display

Day X / 730

Days Remaining

Overall Completion %

Current Mission

Current Learning Phase

Current Streak

Study Hours Today

Everything updates automatically every day.

---

# Users

Exactly two users exist.

## User 1

Role

Admin

Name

Balamurugan

Permissions

- Full access
- Edit everything
- Add learning progress
- Upload screenshots
- Upload certificates
- Update finance
- Update projects
- Write journal
- Add resources
- Create lessons
- Update roadmap

---

## User 2

Role

Viewer

Purpose

View only

Permissions

- Login
- View dashboard
- View learning progress
- View screenshots
- View finance summary
- View projects
- View certificates
- View journal
- View timeline

Viewer cannot edit anything.

Use Supabase Authentication with Row Level Security.

---

# Technology Stack

Framework

Next.js latest App Router

Language

TypeScript

Styling

Tailwind CSS

shadcn/ui

Icons

Lucide React

Charts

Recharts

Backend

Supabase

Database

PostgreSQL

Storage

Supabase Storage

Hosting

GitHub

Vercel

Environment Variables

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

Never hardcode secrets.

---

# Design Style

Theme

Modern Light Theme

Inspired By

Apple

Notion

Linear

Vercel

Characteristics

White background

Soft Gray cards

Blue Primary

Indigo Accent

Glassmorphism

Rounded 20px

Soft Shadows

Large spacing

Minimal

Elegant

Responsive

Mobile First

Dark Mode optional later.

---

# Navigation

Dashboard

Learning

Courses

Projects

Certificates

Finance

Timeline

Journal

Journey Together

Profile

Admin

---

# Dashboard

Show

Greeting

Current Day

Countdown

Today's Mission

Current Course

Current Lesson

Study Hours

Current Streak

Overall Progress

Charts

Recent Journal

Latest Screenshot

Recent Certificate

Current Salary

Savings

Debt

Projects Completed

Learning Hours

---

# Learning System

The learning system must be completely database driven.

Never hardcode lessons.

Database hierarchy

Course

↓

Module

↓

Chapter

↓

Lesson

↓

Task

↓

Practice

↓

Upload

↓

Completed

Everything loads dynamically from Supabase.

---

# Learning Roadmap

Courses

HTML

CSS

JavaScript

React

TypeScript

SPFx

Power Automate Desktop

Power Apps

Power Automate Cloud

Projects

Interview Preparation

Job Switch

Each course contains

Modules

Each module contains

Chapters

Each chapter contains

Lessons

Each lesson contains

Objectives

Reading

Resources

Video Links

Documentation

Practice

Tasks

Quiz

Notes

Reflection

Screenshot Upload

Completion Status

Estimated Time

Difficulty

---

# Every Lesson

Display

Lesson Title

Estimated Time

Difficulty

Objectives

Prerequisites

Resources

Video

Documentation

Task

Practice

Quiz

Reflection

Screenshot Upload

Completion Button

Completion Date

Study Hours

---

# Screenshot Upload

Workflow

Read Lesson

↓

Complete Task

↓

Take Screenshot

↓

Upload Screenshot

↓

Save

↓

Mark Completed

Store images in

Supabase Storage

Store metadata in database.

---

# Learning Progress

Display

Overall %

Course %

Module %

Chapter %

Lesson %

Tasks Completed

Hours Studied

Projects Built

Last Studied

Completion Date

Charts

---

# Journal

Every day create journal.

Fields

Date

Mood

Study Hours

Today's Topic

Lesson

Achievements

Reflection

Tomorrow Plan

Uploaded Screenshot

---

# Finance

Private

Track

Salary

Savings

Debt

Monthly Savings

Investment

Emergency Fund

Target Salary

Target Savings

Charts

Salary Growth

Savings Growth

Debt Reduction

Monthly Progress

Viewer sees summary only.

---

# Projects

Every project contains

Title

Description

Image

GitHub

Live Demo

Tech Stack

Status

Started Date

Completed Date

Screenshots

Notes

Lessons Learned

---

# Certificates

Title

Provider

Issue Date

Certificate Image

Credential URL

Notes

---

# Timeline

Track

Career

Learning

Finance

Projects

Achievements

Job Switch

Salary Growth

Everything displayed as beautiful timeline.

---

# Journey Together

Special page only for Viewer.

Show

Current Day

Countdown

Today's Learning

Study Hours

Current Course

Current Lesson

Uploaded Screenshot

Current Progress

Projects Completed

Certificates

Journal Summary

Finance Summary

Motivational Message

This page should feel warm and personal.

---

# Profile

Name

Photo

Role

Skills

Dream Company

Current Company

Bio

GitHub

LinkedIn

Portfolio

---

# Notifications

Upcoming Lesson

Daily Reminder

Missed Day

Weekly Progress

Monthly Report

Milestones

---

# Reports

Generate

Weekly Report

Monthly Report

Learning Summary

Finance Summary

Project Summary

Journal Summary

Download PDF

---

# Database Tables

profiles

roles

courses

modules

chapters

lessons

tasks

resources

practice_uploads

journal_entries

finance

projects

certificates

timeline

goals

notifications

user_progress

study_sessions

daily_statistics

---

# Authentication

Supabase Auth

Only two users allowed.

Admin

Viewer

No public registration.

Admin creates Viewer manually.

---

# Performance

Lazy Loading

Image Optimization

Pagination

Infinite Scroll

Caching

Loading Skeletons

Optimistic Updates

---

# Accessibility

Keyboard Navigation

ARIA Labels

Responsive

Screen Reader Friendly

Color Contrast

---

# Future Features

AI Study Assistant

Interview Question Generator

Quiz Generator

Explain Lesson

Weekly AI Feedback

Study Recommendations

Flashcards

Revision Planner

Export Notes

Calendar View

PWA

Offline Support

---

# Project Rules

Use reusable components.

Never duplicate code.

Use TypeScript everywhere.

Follow clean architecture.

Use custom hooks.

Use server actions where appropriate.

Separate UI from business logic.

Everything should come from database.

Never hardcode learning data.

Use optimistic UI updates.

Use proper loading states.

Use error boundaries.

Write maintainable code.

Keep components modular.

The application should feel premium and production-ready.
