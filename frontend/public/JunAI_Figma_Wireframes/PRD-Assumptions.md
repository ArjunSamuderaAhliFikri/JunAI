# PRD grounding & assumptions

## Explicitly supported by PRD JunAI V1.0.0
- JunAI is a meeting AI agent for Discord, Zoom, and Google Meet; Discord is recommended.
- Main flow: Record → Transcribe → Analyze → Organize → Follow Up.
- Gemini is the summarizer model.
- Output summary can be PDF or TXT.
- Audio processing combines multiple `.pcm` files into one `.wav`.
- Roles: Super Admin, Admin / Project Manager, Employee, Guest, Super Guest.
- Super Admin can change roles and delete accounts below its role (Admin, Employee, Guest).
- Admin / Project Manager has broad control but cannot delete user accounts.
- Employee can see meeting history, meeting files, and users, but cannot see Super Admin accounts.
- Guest has limited access: meeting files, smart scheduling, and read-only user data.
- Super Guest resembles Guest but cannot read Guest data; described as a 30-day trial.
- Meeting history can be exported to Excel for Admin / Project Manager.
- Reminder types: Kickoff, Deadline, Follow_Up, Custom.
- Notification types: Meeting Reminder, Meeting Started, Meeting Ended.
- Business rules say Employee / Guest can view results but cannot create plans or see plans created by PM; Guest cannot see specific plans.

## Assumptions / points to validate
- S-05 verification UI is proposed; PRD has `Is_Verified` but no verification flow details.
- S-04 reset-password form is a conventional completion screen; PRD only specifies Forgot Password.
- S-16 transcribe stage is shown because the overall business logic mentions Transcribe, but detailed transcription behavior is not specified.
- S-30 schedule fields (date/time/participants) are reasonable UI assumptions; exact required fields are not fully specified.
- Follow-up/task-list screens expand the high-level Follow Up and reminder-chat entities; workflow details need product confirmation.
- Search, filters, empty states, retry, and detail screens are UI conventions proposed for usability.
- Role permissions for Excel export by Employee/Guest and detailed permissions for Super Guest should be confirmed.
- The PRD uses “Admin / Project Manager” in one section and separately “Project Manager” in business rules. This wireframe treats them as the same operational role label “Admin / PM” unless the product owner decides otherwise.
- Example names, dates, counts, and meeting titles are dummy content, not real user data.
