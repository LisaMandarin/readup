# DEMO CLEANUP INSTRUCTIONS

This file lists all the demo-specific code added for the meeting presentation.

## TO REMOVE AFTER MEETING:

### 1. Delete Demo File
- Delete: `frontend/src/pages/Demo.tsx`

### 2. Update App.tsx
- Remove the demo import: `import Demo from "./pages/Demo";`
- Remove the demo route: `<Route path="/demo" element={<Demo />} />`

### 3. Update SignIn.tsx  
- Remove the demo link section (marked with comments)

### 4. Delete This File
- Delete: `DEMO_CLEANUP.md`

## CORE FUNCTIONALITY TO KEEP:
✅ `backend/models.py` - Session and Passage database models
✅ `backend/schemas.py` - Session API schemas  
✅ `backend/routers/sessions_router.py` - Sessions API endpoints
✅ `frontend/src/api/sessions.ts` - Frontend session API calls
✅ `frontend/src/components/SessionHistory.tsx` - Session history component
✅ `frontend/src/pages/Home.tsx` - Updated with session history sidebar
✅ `frontend/src/pages/Passage.tsx` - Updated with session creation

These are the actual implemented features for your assignment!