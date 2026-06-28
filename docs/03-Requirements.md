# 03 Requirements

# Phase 1 — Requirement Analysis

This document outlines the detailed requirements for each core module of the application.

---

## Journal Module

**Purpose**
A dedicated, private space for users to record their daily thoughts, reflections, and experiences.

**Why needed**
Facilitates self-reflection, improves mental clarity, and allows users to track personal growth, mood changes, and memorable events over time.

**User stories**
- As a user, I want to create a new daily journal entry so I can document my day.
- As a user, I want to browse past entries by date so I can reflect on previous experiences.
- As a user, I want to attach my current mood to the journal entry.

**Flow**
1. User navigates to the Journal module.
2. Clicks "New Entry" (or selects a specific date on a calendar).
3. The editor opens. User types their entry, optionally adding tags or mood.
4. Auto-saves or manual save.
5. The entry appears in the chronological journal feed.

**Validation**
- Date must be a valid date format.
- A journal entry for a specific date must be unique (or appended to if one already exists).
- Text content cannot exceed a predefined maximum length (e.g., 100,000 characters).

**Edge cases**
- Creating entries for future dates (should prompt a warning or be disabled).
- Saving entries while offline and syncing later to avoid conflicts.
- Handling media attachments (images/videos) limits.

**Database schema**
- `Journal { id: uuid, user_id: uuid, content: text, mood: string, entry_date: date, created_at: timestamp, updated_at: timestamp }`

**API endpoints**
- `GET /api/journals` - Fetch paginated list of entries.
- `GET /api/journals/:date` - Fetch a specific entry by date.
- `POST /api/journals` - Create a new entry.
- `PUT /api/journals/:id` - Update an existing entry.

**Frontend screens**
- **Journal Feed/Calendar View:** Displays a calendar or timeline of past entries.
- **Journal Editor:** A rich text editing interface for writing.

**Interview questions**
- How will we handle search functionality for past journal entries efficiently?
- Should the journal support rich text (Markdown) and inline images?
- How is user data encrypted to ensure privacy?

---

## Goals Module

**Purpose**
To allow users to define, track, and achieve their short-term and long-term objectives.

**Why needed**
Provides direction and motivation. Breaking down larger aspirations into trackable targets helps maintain momentum.

**User stories**
- As a user, I want to set a specific goal with a target completion date.
- As a user, I want to break down my goal into smaller milestones.
- As a user, I want to see my progress percentage towards the goal.

**Flow**
1. Navigate to the Goals module.
2. Click "Create New Goal".
3. Enter title, description, deadline, and associated milestones.
4. Save the goal.
5. Update progress periodically, marking milestones as complete.

**Validation**
- Goal title is required.
- Deadline date must be in the future.
- Progress value must be between 0 and 100 (if percentage-based).

**Edge cases**
- A goal passes its deadline without being completed (Overdue state).
- Updating a goal's deadline multiple times.
- Deleting a goal that has historical tracking data tied to it.

**Database schema**
- `Goal { id: uuid, user_id: uuid, title: string, description: text, target_date: timestamp, status: enum(active, completed, abandoned), created_at: timestamp }`
- `Milestone { id: uuid, goal_id: uuid, title: string, is_completed: boolean }`

**API endpoints**
- `GET /api/goals` - Fetch user's goals.
- `POST /api/goals` - Create a new goal.
- `PUT /api/goals/:id` - Update goal details or status.
- `DELETE /api/goals/:id` - Remove a goal.

**Frontend screens**
- **Goals Dashboard:** Overview of active, completed, and overdue goals with progress bars.
- **Goal Detail View:** Breakdown of milestones, timeline, and descriptive details.

**Interview questions**
- How do we visualize progress (e.g., progress bars, charts)?
- Can goals be linked to specific habits in the Tracker module?

---

## Tracker Module

**Purpose**
To monitor daily habits, mood, or custom metrics (e.g., water intake, reading, exercise).

**Why needed**
Builds consistency through visual streaks and helps users analyze trends in their daily behaviors over time.

**User stories**
- As a user, I want to log whether I read a book today (boolean tracker).
- As a user, I want to log how many glasses of water I drank (numeric tracker).
- As a user, I want to view a monthly chart of my tracked habits.

**Flow**
1. User opens the Tracker module.
2. Presented with today's checklist of active habits/metrics.
3. User taps to toggle completion or enters a numeric value.
4. Data is saved, and visual streaks/charts are updated immediately.

**Validation**
- Numeric tracker inputs must be numbers.
- Cannot log values for future dates.

**Edge cases**
- Changing a tracker's type (e.g., numeric to boolean) after data has already been recorded.
- Retroactively logging data for past days.
- Managing timezone differences when determining what "today" is.

**Database schema**
- `TrackerItem { id: uuid, user_id: uuid, name: string, type: enum(boolean, numeric, time), active: boolean }`
- `TrackerLog { id: uuid, tracker_item_id: uuid, date: date, value: string/numeric, created_at: timestamp }`

**API endpoints**
- `GET /api/trackers` - Get configured trackers.
- `POST /api/trackers` - Create a new tracker configuration.
- `POST /api/trackers/log` - Log a daily entry.
- `GET /api/trackers/stats/:id` - Fetch historical streak/chart data.

**Frontend screens**
- **Daily Tracker List:** Quick-action widgets for today's logging.
- **Analytics View:** Heatmaps (GitHub style) or line charts showing history.

**Interview questions**
- How are we visualizing numerical vs. boolean tracking data?
- Should the app send reminders if a tracker isn't logged by a certain time?

---

## Todo Module

**Purpose**
A task management system for handling daily and upcoming actionable items.

**Why needed**
Organizes day-to-day responsibilities, ensuring tasks are prioritized and nothing slips through the cracks.

**User stories**
- As a user, I want to quickly add a task to my inbox.
- As a user, I want to set a priority level (High, Medium, Low) for my tasks.
- As a user, I want to check off a task to mark it as complete.

**Flow**
1. Focus on the quick-add input field.
2. Type task description and press Enter.
3. The task is added to the "Inbox" or "Today" view.
4. User clicks the checkbox next to the task when done.
5. Task moves to the completed section.

**Validation**
- Task title cannot be empty.
- Priority must be a recognized value.

**Edge cases**
- Extremely long task titles breaking UI layouts.
- Recovering a deleted task.
- Handling recurring tasks (e.g., "Every Monday").

**Database schema**
- `Todo { id: uuid, user_id: uuid, title: string, due_date: timestamp, is_completed: boolean, priority: enum(low, medium, high), created_at: timestamp }`

**API endpoints**
- `GET /api/todos` - Fetch active/completed tasks.
- `POST /api/todos` - Create a task.
- `PUT /api/todos/:id` - Update task (mark complete, change priority).
- `DELETE /api/todos/:id` - Delete a task.

**Frontend screens**
- **Task List View:** Grouped by date (Today, Upcoming, Someday).
- **Task Edit Sidebar:** For adding details, subtasks, or changing dates.

**Interview questions**
- Do we support recurring todos natively?
- How does this integrate with the Tomorrow Planner module?

---

## Notes Module

**Purpose**
A flexible workspace for capturing unstructured information, meeting notes, project ideas, and reference material.

**Why needed**
Acts as a "second brain" for information that doesn't fit neatly into tasks, goals, or daily journals.

**User stories**
- As a user, I want to create a new note with rich formatting (Markdown).
- As a user, I want to organize notes into folders or using tags.
- As a user, I want to search across all my notes for a specific keyword.

**Flow**
1. Navigate to the Notes module.
2. Click "New Note".
3. Write content using a rich text editor.
4. Assign a folder or tags.
5. Note auto-saves.

**Validation**
- A note must have at least a title or some content (cannot save completely blank).
- File size limits if attachments are allowed inside notes.

**Edge cases**
- Concurrent editing (if multi-device access is supported).
- Offline access and syncing conflicts.
- Deeply nested folder structures causing UI navigation issues.

**Database schema**
- `Folder { id: uuid, user_id: uuid, name: string, parent_id: uuid }`
- `Note { id: uuid, user_id: uuid, folder_id: uuid, title: string, content: text, tags: jsonb, updated_at: timestamp }`

**API endpoints**
- `GET /api/notes` - Fetch summary list of notes.
- `GET /api/notes/:id` - Fetch full note content.
- `POST /api/notes` - Create a note.
- `PUT /api/notes/:id` - Update note content.

**Frontend screens**
- **Notes Explorer (Sidebar):** Tree view of folders and note titles.
- **Note Editor:** Large text area with formatting toolbar.

**Interview questions**
- Do we support Markdown, block-based editing (like Notion), or simple rich text?
- How do we handle file and image attachments within the notes?

---

## Resources Module

**Purpose**
A bookmarking and asset management area for saving external links, articles, videos, and reference files.

**Why needed**
Keeps external references organized and easily accessible without cluttering up personal notes or task lists.

**User stories**
- As a user, I want to paste a URL and have the app automatically fetch the page title and thumbnail.
- As a user, I want to categorize my saved links (e.g., "To Read", "Design Inspiration").
- As a user, I want to search my saved resources.

**Flow**
1. User clicks "Add Resource" and pastes a URL.
2. Backend scrapes the URL for Open Graph metadata (title, image, description).
3. User adds relevant tags or categorizes it.
4. Resource is saved and displayed in a grid or list layout.

**Validation**
- Input must be a valid URL format.
- Graceful failure if the URL cannot be scraped for metadata.

**Edge cases**
- Broken URLs or pages behind paywalls/logins.
- Unfetchable metadata resulting in blank cards.
- Duplicate resources saved by the user.

**Database schema**
- `Resource { id: uuid, user_id: uuid, url: string, title: string, description: text, image_url: string, tags: jsonb, created_at: timestamp }`

**API endpoints**
- `GET /api/resources` - Fetch resources (with filtering).
- `POST /api/resources` - Add a resource (triggers metadata fetch).
- `DELETE /api/resources/:id` - Remove a resource.

**Frontend screens**
- **Resource Gallery:** A visual card grid (Pinterest/Notion style).
- **Add Resource Modal:** Input field for URL and tag selection.

**Interview questions**
- How do we scrape URL metadata securely without exposing our backend to SSRF attacks?
- Will we support hosting actual files (PDFs, images) or just URLs?

---

## AI Chat Module

**Purpose**
An integrated AI assistant to help query the user's personal data, brainstorm ideas, and generate summaries across all modules.

**Why needed**
Enhances productivity by allowing natural language interaction with the user's own journal, notes, tasks, and goals (acting as a personal RAG agent).

**User stories**
- As a user, I want to ask the AI, "What tasks do I have pending for today?"
- As a user, I want the AI to summarize the recurring themes in my journal entries from the past month.
- As a user, I want to brainstorm ideas with the AI and save the output as a Note.

**Flow**
1. User opens the AI Chat interface.
2. Types a prompt (e.g., "Summarize my recent notes on Project X").
3. Backend retrieves relevant context from the database (RAG).
4. AI streams the response back to the user.

**Validation**
- Prompt cannot be empty.
- Rate limiting to prevent API abuse and control costs.

**Edge cases**
- AI hallucinating information not present in the user's data.
- User asking questions when they have zero data in the system.
- Third-party LLM API timeouts or failures.

**Database schema**
- `ChatSession { id: uuid, user_id: uuid, title: string, updated_at: timestamp }`
- `ChatMessage { id: uuid, session_id: uuid, role: enum(user, assistant), content: text, created_at: timestamp }`

**API endpoints**
- `POST /api/chat/completions` - Streaming endpoint for AI responses.
- `GET /api/chat/sessions` - Fetch user's chat history.

**Frontend screens**
- **Chat Interface:** Standard conversational UI (messages list, input box at bottom).
- **Floating Widget (Optional):** Quick access to the AI from any page.

**Interview questions**
- What foundational LLM model will we use (e.g., OpenAI, Anthropic, local)?
- How do we ensure strict data privacy when sending user context to an external LLM API?

---

## Tomorrow Planner Module

**Purpose**
A dedicated planning interface to review unfinished tasks from today and structure the agenda for tomorrow.

**Why needed**
Encourages intentionality and reduces morning friction by having a clear plan set the night before. Shows yesterday's planned tasks on the next day to ensure continuity.

**User stories**
- As a user, I want to review tasks I didn't finish today and decide whether to move them to tomorrow or delete them.
- As a user, I want to time-block or prioritize my tasks for the next day.
- As a user, when I open the app tomorrow, I want to immediately see the plan I made last night.

**Flow**
1. In the evening, the user clicks "Plan Tomorrow".
2. The UI shows all uncompleted tasks from "Today" (rollover view).
3. The user drags tasks they want to tackle tomorrow into the "Tomorrow's Agenda" bucket.
4. User adds new tasks specifically for tomorrow.
5. User finalizes the plan.
6. The next day, this plan becomes the default "Today" view.

**Validation**
- Cannot plan for past dates.
- Tasks must have valid references to the Todo module.

**Edge cases**
- User skips planning for multiple days (how to handle backlogged overdue tasks).
- Timezone changes crossing midnight while planning.
- Tasks that are repeatedly rolled over day after day (maybe flag them as "stale").

**Database schema**
- Relies primarily on the `Todo` schema (updating `due_date` or `scheduled_date`).
- Optional: `DailyPlan { id: uuid, user_id: uuid, target_date: date, planned_task_ids: jsonb, finalized: boolean }`

**API endpoints**
- `GET /api/planner/rollover` - Fetch incomplete tasks from the past.
- `POST /api/planner/finalize` - Lock in the plan for tomorrow (batch update task dates).

**Frontend screens**
- **Rollover Review Screen:** Split view showing "Unfinished" vs "Tomorrow's Plan".
- **Daily Focus View:** The resulting screen shown on the actual day.

**Interview questions**
- Should the app send a push notification reminding the user to plan their tomorrow?
- How do we handle tasks that the user leaves in the "Unfinished" pile without migrating them?
