import React, { createContext, useState, useEffect } from 'react';

export const MockDBContext = createContext();

const initialNotes = [
  {
    id: 'note-1',
    title: 'MongoDB Aggregation Course',
    content: `# MongoDB Aggregation Pipeline

A deep dive into building advanced data aggregation processes in MongoDB.

## Key Pipeline Stages
- **$match**: Filters documents to pass only matching documents to the next stage (equivalent to SQL WHERE).
- **$group**: Groups input documents by a specified identifier and applies accumulator expressions.
- **$lookup**: Performs left outer joins to collections in the same database (equivalent to SQL JOIN).
- **$project**: Reshapes documents by adding, removing, or renaming fields.
- **$unwind**: Deconstructs an array field from input documents to output a document for each element.

## Optimization Strategies
1. **Stage Ordering**: Put \`$match\` and \`$sort\` stages at the very beginning of the pipeline to leverage indexing.
2. **Memory Limit**: Individual stages have a 100MB limit. If exceeded, use \`allowDiskUse: true\`.
3. **Index Usage**: Only the initial \`$match\` and \`$sort\` stages can use indexes; once shapes change, indexing is lost.`,
    tags: ['Backend', 'Database', 'MongoDB'],
    lastModified: '2026-06-20',
    summary: 'Detailed handbook on aggregation pipelines, stage behaviors, and index utilization rules.'
  },
  {
    id: 'note-2',
    title: 'Redis Cache Invalidation Patterns',
    content: `# Redis Cache Invalidation

Maintaining consistency between the cache and the primary database is one of the hardest problems in distributed systems.

## Primary Invalidation Strategies
- **Cache-Aside (Lazy Loading)**: Application queries cache first. On miss, it reads from DB, updates cache, and returns. Simple, but can have stale data.
- **Write-Through**: Application writes to cache, and cache immediately writes to DB. Ensures consistency but increases write latency.
- **Write-Behind (Write-Back)**: Application writes to cache, which queues the write for asynchronous DB updating. Fast, but risks data loss on cache crash.

## Eviction Algorithms
- **LRU (Least Recently Used)**: Evicts keys that haven't been accessed for the longest time.
- **LFU (Least Frequently Used)**: Evicts keys with the lowest access frequency counters.

## Cache Stampede Prevention
Avoid concurrent DB hits on cache expiration by using *Mutex locks* or *XFetch* algorithms to rebuild cache before it expires in background threads.`,
    tags: ['Backend', 'Caching', 'Redis', 'Systems'],
    lastModified: '2026-06-22',
    summary: 'A study on Cache-Aside vs Write-Through strategies, eviction mechanisms, and cache stampede protection.'
  },
  {
    id: 'note-3',
    title: 'React Server Components Deep Dive',
    content: `# React Server Components (RSC)

RSCs represent a paradigm shift in how we build React applications, combining server-side security/performance with client-side interactivity.

## RSC vs SSR
- **SSR (Server-Side Rendering)**: Generates HTML string on the server, ships it to client, hydrates it. Still runs React code on client.
- **RSC**: Renders components *only* on the server. Outputs a JSON-like serialized stream (RSC payload) instead of HTML. Never hydrates on client.

## Benefits
- **Zero Bundle Size**: Server-only dependencies (like markdown parsers, DB drivers) are never shipped to the browser.
- **Direct Backend Access**: Query databases or fetch APIs directly from the component function body.
- **Security**: Hide API keys, SQL queries, and sensitive data on the server securely.`,
    tags: ['Frontend', 'React', 'RSC'],
    lastModified: '2026-06-23',
    summary: 'Exploring how Server Components serialize rendering payloads to client, and comparison with SSR.'
  },
  {
    id: 'note-4',
    title: 'Docker Containerization Guide',
    content: `# Docker Optimization Guidelines

How to create efficient, lightweight, and secure container images.

## Multi-stage Builds
Use multi-stage builds to keep build tools out of your final image:
\`\`\`dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --only=production
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Image Size Optimization
1. Use **Alpine** or **Distroless** base images.
2. Minimize build layers by grouping commands (\`RUN apt-get update && apt-get install -y...\`).
3. Create a \`.dockerignore\` file to prevent copying node_modules or source git data.`,
    tags: ['DevOps', 'Infrastructure', 'Docker'],
    lastModified: '2026-06-18',
    summary: 'Best practices for Dockerfiles, multi-stage builds, and minimizing build layers.'
  },
  {
    id: 'note-5',
    title: 'GraphQL API Design vs REST',
    content: `# GraphQL vs REST Architecture

Choosing the right API paradigm for microservice communication.

## Core Differences
- **REST**: Resource-oriented. Over-fetching or under-fetching requires multiple roundtrips to different endpoints (e.g. \`/users/1\`, \`/users/1/posts\`).
- **GraphQL**: Query-oriented. Client requests exactly what fields it needs in a single request.

## The N+1 Query Problem in GraphQL
When fetching a list of posts and their authors, a naive resolver might hit the database once for the list of posts (1) and then once for *each* author (N).
*Solution*: Use **DataLoader** to batch and cache database requests.`,
    tags: ['Backend', 'API', 'GraphQL', 'REST'],
    lastModified: '2026-06-15',
    summary: 'Evaluating over-fetching, N+1 request bottlenecks, and batched resolvers using DataLoader.'
  }
];

const initialResources = [
  {
    id: 'res-1',
    title: 'MongoDB Aggregation Masterclass',
    type: 'YouTube',
    url: 'https://youtube.com/watch?v=mongo-agg',
    savedDate: '2026-06-10',
    tags: ['Backend', 'Database', 'MongoDB'],
    summary: 'Comprehensive visual guide on complex group, join, and projection operations. Great indexing tutorials.'
  },
  {
    id: 'res-2',
    title: 'Redis Crash Course for Backend Devs',
    type: 'YouTube',
    url: 'https://youtube.com/watch?v=redis-crash',
    savedDate: '2026-06-16',
    tags: ['Backend', 'Caching', 'Redis'],
    summary: 'Interactive tutorial showing pub-sub implementation, transactions, persistent stores, and cache topologies.'
  },
  {
    id: 'res-3',
    title: 'Designing Data-Intensive Applications (Summary)',
    type: 'Website',
    url: 'https://martin.kleppmann.com/ddia-summary',
    savedDate: '2026-06-04',
    tags: ['Architecture', 'Systems', 'Database'],
    summary: 'Brief overview of database internals: log-structured merge trees (LSM), B-trees, replication models, and partition boundaries.'
  },
  {
    id: 'res-4',
    title: 'DynamoDB: Amazon Highly Available Key-Value Store',
    type: 'Research Paper',
    url: 'https://aws.amazon.com/dynamodb-paper',
    savedDate: '2026-05-25',
    tags: ['Database', 'NoSQL', 'Systems'],
    summary: 'The original 2007 paper outlining Dynamo design using consistent hashing, vector clocks, and Dynamo replication.'
  },
  {
    id: 'res-5',
    title: 'Advanced Node.js Event Loop Debugging',
    type: 'Blog Article',
    url: 'https://dev.to/nodejs-event-loop',
    savedDate: '2026-06-19',
    tags: ['Backend', 'Nodejs', 'Performance'],
    summary: 'Debugging guidelines explaining phase timelines (timers, poll, check), libuv threads, and CPU-intensive bottlenecks.'
  }
];

const initialTasks = [
  {
    id: 'task-1',
    title: 'Optimize MongoDB aggregation query for analytics dashboard',
    description: 'The dashboard aggregation query takes >400ms. We need to add an index on project_id + created_at and reorganize the pipeline stages to matching first.',
    priority: 'Urgent',
    dueDate: '2026-06-26',
    status: 'Todo',
    category: 'Daily'
  },
  {
    id: 'task-2',
    title: 'Implement Redis Caching in API Gateway',
    description: 'Cache list endpoints for 60s using standard Cache-Aside pattern. Implement cache invalidation hooks on write.',
    priority: 'High',
    dueDate: '2026-06-29',
    status: 'Backlog',
    category: 'Weekly'
  },
  {
    id: 'task-3',
    title: 'Design database schema for user profiles',
    description: 'Incorporate preferences, OAuth credentials, and settings tables. Optimize for frequent profile reads.',
    priority: 'Medium',
    dueDate: '2026-06-25',
    status: 'In Progress',
    category: 'Daily'
  },
  {
    id: 'task-4',
    title: 'Review Node.js security best practices checklist',
    description: 'Ensure helmet middleware is active, check package audits, prevent prototype pollution, and set secure cookie configurations.',
    priority: 'Medium',
    dueDate: '2026-06-22',
    status: 'Done',
    category: 'Daily'
  },
  {
    id: 'task-5',
    title: 'Deploy staging environment on AWS ECS Fargate',
    description: 'Dockerize frontend/backend, upload to ECR registry, set up ECS cluster, and configure Application Load Balancer.',
    priority: 'High',
    dueDate: '2026-06-20',
    status: 'Done',
    category: 'Monthly'
  }
];

const initialGoals = [
  {
    id: 'goal-1',
    title: 'Become Backend Developer',
    category: 'Monthly',
    progress: 75,
    status: 'In Progress',
    milestones: [
      { name: 'Learn Node.js core modules & event loop', completed: true },
      { name: 'Master SQL & MongoDB Aggregations', completed: true },
      { name: 'Implement Redis cache invalidation layers', completed: false },
      { name: 'Design microservices communication patterns', completed: false }
    ],
    timeline: 'June 1 - July 15'
  },
  {
    id: 'goal-2',
    title: 'Build Synora AI Prototype',
    category: 'Weekly',
    progress: 80,
    status: 'In Progress',
    milestones: [
      { name: 'Define visual layouts & index.css tokens', completed: true },
      { name: 'Setup Mock Data & Global state context', completed: true },
      { name: 'Write client-side AI parsing query logic', completed: true },
      { name: 'Polish components and interactive flows', completed: false }
    ],
    timeline: 'June 22 - June 28'
  },
  {
    id: 'goal-3',
    title: 'Read 12 Technical Books',
    category: 'Yearly',
    progress: 33,
    status: 'In Progress',
    milestones: [
      { name: 'Read Designing Data-Intensive Applications', completed: true },
      { name: 'Read Clean Architecture by Uncle Bob', completed: true },
      { name: 'Read High Performance Browser Networking', completed: false },
      { name: 'Read System Design Interview', completed: false },
      { name: 'Read Kubernetes in Action', completed: false },
      { name: 'Read Refactoring by Martin Fowler', completed: false }
    ],
    timeline: 'Jan 1 - Dec 31'
  }
];

const initialTrackers = [
  {
    id: 'track-1',
    title: 'MERN Stack Progress',
    topics: [
      { name: 'HTML & Semantic Elements', completed: true },
      { name: 'CSS Variables & Flexbox', completed: true },
      { name: 'JavaScript Event Loop & Promises', completed: true },
      { name: 'React State Hooks & Context', completed: true },
      { name: 'Node.js & Express API routing', completed: true },
      { name: 'MongoDB Aggregations', progress: 70, completed: false },
      { name: 'Redis Caching & Pub-Sub', progress: 20, completed: false }
    ]
  },
  {
    id: 'track-2',
    title: 'System Design Interview Prep',
    topics: [
      { name: 'DNS & Load Balancer Topologies', completed: true },
      { name: 'CDN & Caching hierarchies', progress: 80, completed: false },
      { name: 'Horizontal Scaling vs Sharding', progress: 30, completed: false },
      { name: 'Message Queues (RabbitMQ/Kafka)', progress: 50, completed: false }
    ]
  }
];

const initialJournals = [
  {
    id: 'j-1',
    date: '2026-06-24',
    mood: 'focused', // focused, happy, tired, calm, anxious
    text: 'Woke up early, reviewed database architectures. Started implementing Redis cache invalidation strategies in my sandbox code. Struggled with a cache stampede issue, but resolved it using mutex locking. Feeling productive about backend goals.',
    aiSummary: 'Worked on Redis caching invalidation. Fixed cache stampede via mutex locking. High focus.',
    type: 'Daily'
  },
  {
    id: 'j-2',
    date: '2026-06-23',
    mood: 'happy',
    text: 'Completed MongoDB indexing optimizations on user transactions query. The query execution time dropped from 350ms to 12ms. Felt like a massive win. Uploaded a resource video on MongoDB aggregations as references.',
    aiSummary: 'Optimized MongoDB transactions query (350ms to 12ms). Added aggregation resource.',
    type: 'Daily'
  },
  {
    id: 'j-3',
    date: '2026-06-22',
    mood: 'tired',
    text: 'Tired today. Spent 4 hours debugging a memory leak in Node.js streaming API. Turns out it was an unclosed readable stream. System was holding references. Fixed it by wrapping it in try-finally and listening for end events.',
    aiSummary: 'Debugged and patched unclosed stream memory leak in Node.js. Wrote security best practices note.',
    type: 'Daily'
  },
  {
    id: 'j-month-1',
    date: '2026-06-01',
    mood: 'calm',
    text: 'Monthly Reflection: May was a heavy DevOps month. I dockerized all projects, configured ECS clusters, and ran CI/CD staging pipelines. June will focus on deep-diving into databases: indexes, replication, and caching layer design. Need to focus on MERN roadmaps.',
    aiSummary: 'Completed DevOps dockerization in May. June goals: DB indexes, caching layer designs.',
    type: 'Monthly'
  }
];

export const MockDBProvider = ({ children }) => {
  const [notes, setNotes] = useState(() => {
    const local = localStorage.getItem('sb_notes');
    return local ? JSON.parse(local) : initialNotes;
  });

  const [resources, setResources] = useState(() => {
    const local = localStorage.getItem('sb_resources');
    return local ? JSON.parse(local) : initialResources;
  });

  const [tasks, setTasks] = useState(() => {
    const local = localStorage.getItem('sb_tasks');
    return local ? JSON.parse(local) : initialTasks;
  });

  const [goals, setGoals] = useState(() => {
    const local = localStorage.getItem('sb_goals');
    return local ? JSON.parse(local) : initialGoals;
  });

  const [trackers, setTrackers] = useState(() => {
    const local = localStorage.getItem('sb_trackers');
    return local ? JSON.parse(local) : initialTrackers;
  });

  const [journals, setJournals] = useState(() => {
    const local = localStorage.getItem('sb_journals');
    return local ? JSON.parse(local) : initialJournals;
  });

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('sb_notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('sb_resources', JSON.stringify(resources)); }, [resources]);
  useEffect(() => { localStorage.setItem('sb_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('sb_goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('sb_trackers', JSON.stringify(trackers)); }, [trackers]);
  useEffect(() => { localStorage.setItem('sb_journals', JSON.stringify(journals)); }, [journals]);

  // Operations
  const addNote = (newNote) => {
    const note = {
      id: `note-${Date.now()}`,
      title: newNote.title || 'Untitled Note',
      content: newNote.content || '',
      tags: newNote.tags || [],
      lastModified: new Date().toISOString().split('T')[0],
      summary: newNote.summary || (newNote.content ? newNote.content.substring(0, 100) + '...' : '')
    };
    setNotes(prev => [note, ...prev]);
    return note;
  };

  const updateNote = (id, updated) => {
    setNotes(prev => prev.map(n => n.id === id ? {
      ...n,
      ...updated,
      lastModified: new Date().toISOString().split('T')[0]
    } : n));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const addResource = (newRes) => {
    const res = {
      id: `res-${Date.now()}`,
      title: newRes.title || 'Untitled Resource',
      type: newRes.type || 'Website',
      url: newRes.url || '',
      savedDate: new Date().toISOString().split('T')[0],
      tags: newRes.tags || [],
      summary: newRes.summary || 'Added resources summary.'
    };
    setResources(prev => [res, ...prev]);
    return res;
  };

  const deleteResource = (id) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const addTask = (newTask) => {
    const task = {
      id: `task-${Date.now()}`,
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      priority: newTask.priority || 'Medium',
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      status: newTask.status || 'Todo',
      category: newTask.category || 'Daily'
    };
    setTasks(prev => [task, ...prev]);
    return task;
  };

  const updateTask = (id, updated) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addGoal = (newGoal) => {
    const goal = {
      id: `goal-${Date.now()}`,
      title: newGoal.title || 'Untitled Goal',
      category: newGoal.category || 'Weekly',
      progress: 0,
      status: 'In Progress',
      milestones: (newGoal.milestones || []).map(m => typeof m === 'string' ? { name: m, completed: false } : m),
      timeline: newGoal.timeline || 'TBD'
    };
    setGoals(prev => [goal, ...prev]);
    return goal;
  };

  const toggleMilestone = (goalId, milestoneIndex) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const milestones = g.milestones.map((m, idx) =>
        idx === milestoneIndex ? { ...m, completed: !m.completed } : m
      );
      const completedCount = milestones.filter(m => m.completed).length;
      const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;
      return {
        ...g,
        milestones,
        progress,
        status: progress === 100 ? 'Completed' : 'In Progress'
      };
    }));
  };

  const toggleTrackerTopic = (trackerId, topicIndex, currentVal = null) => {
    setTrackers(prev => prev.map(track => {
      if (track.id !== trackerId) return track;
      const topics = track.topics.map((top, idx) => {
        if (idx !== topicIndex) return top;
        if (top.progress !== undefined) {
          // If it has a specific progress, toggle between completed (100) and uncompleted (0) or increment
          const nextProgress = currentVal !== null ? currentVal : (top.progress === 100 ? 0 : top.progress + 25);
          return {
            ...top,
            progress: Math.min(nextProgress, 100),
            completed: nextProgress >= 100
          };
        } else {
          return { ...top, completed: !top.completed };
        }
      });
      return { ...track, topics };
    }));
  };

  const addJournal = (newJ) => {
    const j = {
      id: `j-${Date.now()}`,
      date: newJ.date || new Date().toISOString().split('T')[0],
      mood: newJ.mood || 'calm',
      text: newJ.text || '',
      aiSummary: newJ.aiSummary || 'Simulated AI summary generation.',
      type: newJ.type || 'Daily'
    };
    setJournals(prev => [j, ...prev]);
    return j;
  };

  // Global search autocomplete helper
  const globalSearch = (query) => {
    if (!query) return { notes: [], resources: [], tasks: [] };
    const q = query.toLowerCase();
    return {
      notes: notes.filter(n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)),
      resources: resources.filter(r => r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q)),
      tasks: tasks.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    };
  };

  // Mock AI Assistant Engine
  const askAI = (query) => {
    const q = query.toLowerCase();
    let textResponse = '';
    const citations = {
      notes: [],
      resources: [],
      tasks: [],
      goals: [],
      journals: []
    };

    const hasMongo = q.includes('mongo');
    const hasRedis = q.includes('redis');
    const hasGoals = q.includes('goal') || q.includes('complete') || q.includes('achieve') || q.includes('month');
    const hasBackend = q.includes('backend') || q.includes('learn') || q.includes('journey');

    if (hasMongo) {
      // Crawl and index Mongo
      citations.notes = notes.filter(n => n.title.toLowerCase().includes('mongo') || n.content.toLowerCase().includes('mongo'));
      citations.resources = resources.filter(r => r.title.toLowerCase().includes('mongo') || r.summary.toLowerCase().includes('mongo'));
      citations.tasks = tasks.filter(t => t.title.toLowerCase().includes('mongo') || t.description.toLowerCase().includes('mongo'));
      citations.goals = goals.filter(g => g.title.toLowerCase().includes('developer') || g.milestones.some(m => m.name.toLowerCase().includes('mongo')));
      citations.journals = journals.filter(j => j.text.toLowerCase().includes('mongo'));

      textResponse = `Based on your Synora database, you have been extensively studying and configuring **MongoDB** for backend application systems.

### 💡 Key Insights:
1. **Aggregations & Pipelines**: You have been learning advanced aggregation pipelines. Your notes detail stages like \`$match\`, \`$group\`, and \`$lookup\`. You documented that structuring \`$match\` first is crucial to preserve index mappings.
2. **Performance Improvements**: Yesterday, you successfully optimized a MongoDB transactions query. By introducing targeted index structures, you reduced query times from **350ms to 12ms**, marking a massive efficiency upgrade.
3. **Open Action Items**: You have a daily task: *"Optimize MongoDB aggregation query for analytics dashboard"* which is currently marked as **Todo**.

Your learning roadmap shows **MongoDB Aggregations** at **70% completion**.`;

    } else if (hasRedis) {
      // Crawl and index Redis
      citations.notes = notes.filter(n => n.title.toLowerCase().includes('redis') || n.content.toLowerCase().includes('redis'));
      citations.resources = resources.filter(r => r.title.toLowerCase().includes('redis') || r.summary.toLowerCase().includes('redis'));
      citations.tasks = tasks.filter(t => t.title.toLowerCase().includes('redis') || t.description.toLowerCase().includes('redis'));
      citations.journals = journals.filter(j => j.text.toLowerCase().includes('redis'));

      textResponse = `Based on your Synora records, you are implementing **Redis** as a caching and performance optimization layer.

### 💡 Key Insights:
1. **Consistency Patterns**: Your notes contain detailed research on Cache Invalidation. You are comparing **Cache-Aside** (lazy load) with **Write-Through** write pipelines.
2. **Recent Activities**: Two days ago, you worked on locking mechanisms to prevent *Cache Stampedes* in your codebase, resolving concurrency issues by implementing mutex locks around hot-path database queries.
3. **Tasks & Milestones**: You have a high-priority task in your backlog: *"Implement Redis Caching in API Gateway"*. This is linked to your milestone *"Implement Redis cache invalidation layers"* under your primary **Become Backend Developer** monthly goal.

Your progress roadmap shows **Redis Caching** at **20% completion**.`;

    } else if (hasGoals) {
      // Crawl and index Goals & Milestones
      citations.goals = goals;
      citations.tasks = tasks.filter(t => t.status === 'Done');
      citations.journals = journals.filter(j => j.type === 'Monthly' || j.text.toLowerCase().includes('goal'));

      textResponse = `Here is a report on your goal achievements and planning progress from your personal tracking metrics:

### 🎯 Monthly & Weekly Goals Status:
- **Become Backend Developer (Monthly)**: You are currently at **75% progress**. You completed core Node.js event loops and SQL/Mongo mastering. The next target is integrating Redis caching mechanisms.
- **Build Synora AI Prototype (Weekly)**: At **80% progress**. The styles, database context, and search indexer are complete. You are currently polishing CSS custom layouts.
- **Read 12 Tech Books (Yearly)**: Currently at **33% progress** (4 out of 12 milestones). You have finished Martin Kleppmann's *Designing Data-Intensive Applications* and Uncle Bob's *Clean Architecture*.

You have completed **2 key tasks** recently, including staging environment deployments on AWS ECS.`;

    } else if (hasBackend) {
      // Crawl backend focus
      citations.notes = notes.filter(n => n.tags.includes('Backend') || n.tags.includes('Database'));
      citations.resources = resources.filter(r => r.tags.includes('Backend') || r.tags.includes('Database'));
      citations.tasks = tasks.filter(t => t.priority === 'High' || t.priority === 'Urgent');
      citations.goals = goals.filter(g => g.id === 'goal-1');
      citations.journals = journals.filter(j => j.text.toLowerCase().includes('backend') || j.text.toLowerCase().includes('node'));

      textResponse = `Your **Backend Learning Journey** spans database design, performance optimizations, memory debugging, and staging cloud pipelines.

### 🗺️ Journey Highlights:
1. **Core Runtime**: You debugged memory leaks in the Node.js event loop streams API, learning V8 garbage collection behavior and fixing resource handles in try-finally structures.
2. **Databases**: You established deep index capabilities in MongoDB and explored DynamoDB consistent hashing patterns from classic system design literature.
3. **Caching & Scaling**: You are progressing through Cache-Aside architecture designs and stampede guards.
4. **Cloud Infrastructure**: You containerized services with multi-stage Docker builds and launched services on AWS ECS clusters.

Your primary path is structured around the **Become Backend Developer** goal (75%) and the **MERN Stack Roadmap** tracker.`;

    } else {
      // Fallback search
      const matchedNotes = notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
      const matchedResources = resources.filter(r => r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q));
      
      if (matchedNotes.length > 0 || matchedResources.length > 0) {
        citations.notes = matchedNotes;
        citations.resources = matchedResources;
        textResponse = `I found related matches in your Synora database regarding "${query}".

### 🔍 Retrieved Materials:
${matchedNotes.map(n => `- **Note**: [${n.title}] (${n.summary})`).join('\n')}
${matchedResources.map(r => `- **Resource** [${r.type}]: ${r.title} (${r.summary})`).join('\n')}

How can I help you extract further details from these saved notes or videos?`;
      } else {
        textResponse = `I searched your Synora database (Notes, Resources, Tasks, Goals, and Journals) but found no direct references to "${query}". 

However, here is what you are actively working on today:
- Notes on **React Server Components** and **Redis caching**
- Weekly goal: **Build Synora AI Prototype** (80% complete)
- Urgent Task: **Optimize MongoDB aggregations**

Would you like to write a new note or save a resource web link about "${query}" to add it to your knowledge base?`;
      }
    }

    return {
      text: textResponse,
      citations
    };
  };

  return (
    <MockDBContext.Provider value={{
      notes,
      resources,
      tasks,
      goals,
      trackers,
      journals,
      addNote,
      updateNote,
      deleteNote,
      addResource,
      deleteResource,
      addTask,
      updateTask,
      deleteTask,
      addGoal,
      toggleMilestone,
      toggleTrackerTopic,
      addJournal,
      globalSearch,
      askAI
    }}>
      {children}
    </MockDBContext.Provider>
  );
};
