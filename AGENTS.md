# Client Ops Hub Agent Guide

## Project Goal
Build a polished demo SaaS app for small service businesses. Keep the MVP simple, credible, and easy to demo locally.

## Product Scope
- Focus on a clean end-to-end flow: sign in, view dashboard, manage leads, manage projects, use one AI assistant feature.
- Prefer demo-ready sample data and straightforward UI over deep backend complexity.
- Avoid adding enterprise features unless explicitly requested.

## Tech Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase for auth and database
- Vercel-friendly deployment setup

## Working Rules
- Keep changes beginner-friendly and easy to explain.
- Build in small milestones instead of large feature drops.
- Favor simple server actions, route handlers, and Supabase queries over extra abstraction.
- Use clear file names and predictable routes.
- Do not introduce unnecessary packages if the existing stack can handle the job.

## MVP Priority
1. Authentication and app shell
2. Dashboard
3. Leads list and lead detail
4. Projects list and project detail
5. AI notes-to-summary and follow-up email draft

## Suggested Route Shape
- `/`
- `/dashboard`
- `/leads`
- `/leads/[id]`
- `/projects`
- `/projects/[id]`

## Data Principles
- Start with a single-user or single-workspace demo assumption.
- Use simple relational tables with clear foreign keys.
- Keep statuses and stages limited to a short set of values.
- Store AI outputs so they can be shown again in the UI.

## Out of Scope Until Requested
- Complex permissions and multi-team roles
- Billing and subscriptions
- File uploads
- Realtime collaboration
- Full CRM or project management feature depth
