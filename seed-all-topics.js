const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read env variables
const envPath = path.join(__dirname, '.env.development.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabaseUrl = env['SUPABASE_URL'] || env['NEXT_PUBLIC_SUPABASE_URL'] || 'https://vdzwduxloayvwasbhntm.supabase.co';
const serviceRoleKey = env['SUPABASE_SERVICE_ROLE_KEY'] || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const topicsDir = path.join(__dirname, 'topics');
const files = fs.readdirSync(topicsDir);

const richJSContent = `## Topics
History of JavaScript
Why JavaScript?
Where JavaScript runs
Browser vs Node.js
ECMAScript
JavaScript Engine
V8 Engine
JavaScript Runtime
JavaScript Versions (ES5 → ES6 → ES2024)
Why every frontend developer needs JavaScript

## Theory
JavaScript is a programming language used to make websites interactive.
Without JavaScript:
Button won't work
Form won't validate
Popup won't open
Login won't happen
API won't work
HTML creates the structure.
CSS styles it.
JavaScript adds behavior.

## Example
HTML -> Button -> CSS -> Blue Button -> JavaScript -> When clicked, show message.

## Where JavaScript Runs
Browser: Chrome, Firefox, Edge, Safari
Server: Node.js

## What Can JavaScript Do?
✓ Change HTML
✓ Change CSS
✓ Validate Forms
✓ Fetch API
✓ Login
✓ Dashboard
✓ Animation
✓ Games
✓ Chat
✓ AI
✓ Desktop Apps
✓ Mobile Apps

## Browser JavaScript
HTML -> Browser -> JavaScript -> DOM -> Page Changes

## Node.js
JavaScript -> Node -> Backend -> Database -> API

## JavaScript Engine
Every browser has an engine.
Chrome -> V8 Engine
Firefox -> SpiderMonkey
Safari -> JavaScriptCore

## ECMAScript
ECMAScript is the official standard of JavaScript.
ES5 -> Old JavaScript
ES6 -> Modern JavaScript (Introduced let, const, Arrow Functions, Classes, Template Literals, Modules)

## Applications
Websites
React
Angular
Vue
Node.js
Electron
React Native
SPFx
Power Apps Custom Components

## Quick Notes
High Level Language
Dynamic Language
Interpreted Language
Event Driven
Object Oriented
Functional Language

## Interview Questions
Q1: What is JavaScript?
Answer: JavaScript is a scripting language used to create dynamic and interactive web applications.
Q2: Who created JavaScript?
Answer: Brendan Eich in 1995.
Q3: Difference between JavaScript and ECMAScript?
Answer: ECMAScript is the specification. JavaScript is the implementation.
Q4: Where does JavaScript run?
Answer: Browser and Node.js.
Q5: Name any JavaScript engine.
Answer: V8 Engine.
Q6: What is Node.js?
Answer: Node.js allows JavaScript to run outside the browser.
Q7: Can JavaScript connect to databases?
Answer: Yes, using backend technologies like Node.js.
Q8: Can JavaScript create mobile apps?
Answer: Yes. Example: React Native.
Q9: Is JavaScript compiled?
Answer: Modern engines use Just-In-Time (JIT) compilation.
Q10: Why is JavaScript popular?
Answer: Because it works everywhere, is easy to learn, and powers both frontend and backend development.

## Practice Questions
Practice 1: Write 5 real-world applications of JavaScript.
Practice 2: Write the difference between HTML, CSS, and JavaScript.
Practice 3: Research and write the features introduced in ES6 (at least 10).

## Assignment
Create a document answering: What is JS, Why is it needed, Browser vs Node.js, ECMAScript, JS Engines, and 10 ES6 features.

## Mini Quiz
1. JavaScript is a ______ language.
2. Who created JavaScript?
3. Which browser uses the V8 engine?
4. What does ECMAScript define?
5. Can JavaScript run outside the browser?
6. What is Node.js used for?
7. Name one JavaScript framework.
8. What is the latest JavaScript standard called?
9. What is JIT compilation?
10. Give one use case for JavaScript on the server.`;

async function run() {
  console.log('Bypassing certificate validations...');
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  console.log('Clearing existing curriculum database tables...');
  const { error: clearErr } = await supabase.from('courses').delete().neq('title', '');
  if (clearErr) {
    console.error('Clear failed:', clearErr.message);
    return;
  }

  for (let fIdx = 0; fIdx < files.length; fIdx++) {
    const filename = files[fIdx];
    if (!filename.endsWith('.txt') && filename !== 'typescript') continue;

    console.log(`\nParsing file outline: ${filename}`);
    const filePath = path.join(topicsDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    let courseTitle = filename.replace('.txt', '');
    let courseSlug = courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (courseSlug.endsWith('-')) courseSlug = courseSlug.slice(0, -1);

    let firstLine = lines[0].trim();
    if (firstLine) {
      courseTitle = firstLine;
    }

    // Parse course structure locally
    const modules = [];
    let currentMod = null;
    let currentChap = null;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.toLowerCase().startsWith('module')) {
        currentMod = { title: line, chapters: [] };
        modules.push(currentMod);
        currentChap = null;
      } else if (line.toLowerCase().startsWith('chapter')) {
        if (!currentMod) {
          currentMod = { title: 'Introduction Module', chapters: [] };
          modules.push(currentMod);
        }
        currentChap = { title: line, lessons: [] };
        currentMod.chapters.push(currentChap);
      } else {
        if (!currentMod) {
          currentMod = { title: 'Introduction Module', chapters: [] };
          modules.push(currentMod);
        }
        if (!currentChap) {
          currentChap = { title: 'General Chapter', lessons: [] };
          currentMod.chapters.push(currentChap);
        }
        currentChap.lessons.push(line);
      }
    }

    // Insert Course
    const { data: course, error: cErr } = await supabase
      .from('courses')
      .insert({
        title: courseTitle,
        slug: courseSlug,
        description: `Complete master course path for ${courseTitle}.`,
        difficulty: 'Intermediate',
        estimated_hours: 45,
        icon: courseSlug.includes('js') || courseSlug.includes('script') ? 'code' : 'layout',
        color: 'blue',
        status: 'Active',
        order: fIdx
      })
      .select().single();

    if (cErr) {
      console.error(`Failed to insert course ${courseTitle}:`, cErr.message);
      continue;
    }

    // Bulk Insert Modules
    if (modules.length === 0) continue;
    const modulesPayload = modules.map((m, mIdx) => ({
      course_id: course.id,
      title: m.title,
      description: `Module details for ${m.title}`,
      order: mIdx
    }));

    const { data: insertedMods, error: modsErr } = await supabase
      .from('modules')
      .insert(modulesPayload)
      .select();

    if (modsErr) {
      console.error(`Failed bulk modules insert:`, modsErr.message);
      continue;
    }

    // Prepare & Bulk Insert Chapters
    const chaptersPayload = [];
    insertedMods.forEach((mod, mIdx) => {
      const parsedMod = modules[mIdx];
      parsedMod.chapters.forEach((chap, chIdx) => {
        chaptersPayload.push({
          module_id: mod.id,
          title: chap.title,
          description: `Chapter details for ${chap.title}`,
          order: chIdx,
          // temporary reference to map children
          _modIdx: mIdx,
          _chapIdx: chIdx
        });
      });
    });

    if (chaptersPayload.length === 0) continue;
    // Strip temporary references before insert
    const cleanChaptersPayload = chaptersPayload.map(({ _modIdx, _chapIdx, ...rest }) => rest);
    const { data: insertedChaps, error: chapsErr } = await supabase
      .from('chapters')
      .insert(cleanChaptersPayload)
      .select();

    if (chapsErr) {
      console.error(`Failed bulk chapters insert:`, chapsErr.message);
      continue;
    }

    // Map chapters to their DB ID
    chaptersPayload.forEach((ch, idx) => {
      ch.id = insertedChaps[idx].id;
    });

    // Prepare & Bulk Insert Lessons
    const lessonsPayload = [];
    let globalLessonCounter = 0;
    chaptersPayload.forEach((ch) => {
      const parsedChap = modules[ch._modIdx].chapters[ch._chapIdx];
      parsedChap.lessons.forEach((les, lIdx) => {
        let lessonSlug = les.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (lessonSlug.endsWith('-')) lessonSlug = lessonSlug.slice(0, -1);
        if (lessonSlug.startsWith('-')) lessonSlug = lessonSlug.slice(1);
        
        // Append Course Slug and a unique incrementing counter for absolute safety
        lessonSlug = `${courseSlug}-l${globalLessonCounter++}-${lessonSlug}`.slice(0, 250);

        lessonsPayload.push({
          chapter_id: ch.id,
          title: les,
          slug: lessonSlug,
          description: `Syllabus details: ${les}`,
          estimated_minutes: 45,
          difficulty: 'Beginner',
          learning_objectives: [`Master core details of ${les}`],
          prerequisites: [],
          completed: false,
          order: lIdx
        });
      });
    });

    if (lessonsPayload.length === 0) continue;
    const { data: insertedLessons, error: lessonsErr } = await supabase
      .from('lessons')
      .insert(lessonsPayload)
      .select();

    if (lessonsErr) {
      console.error(`Failed bulk lessons insert for ${courseTitle}:`, lessonsErr.message);
      continue;
    }

    // Prepare & Bulk Insert Tasks
    const tasksPayload = insertedLessons.map((les) => ({
      lesson_id: les.id,
      title: `Submit practice assignment for ${les.title}`,
      task_type: 'practice',
      upload: true,
      estimated_minutes: 30
    }));

    if (tasksPayload.length === 0) continue;
    const { error: tasksErr } = await supabase
      .from('tasks')
      .insert(tasksPayload);

    if (tasksErr) {
      console.error(`Failed bulk tasks insert for ${courseTitle}:`, tasksErr.message);
    }
  }

  console.log('\nSeeding rich content for What is JavaScript lesson...');
  const { error: updErr } = await supabase
    .from('lessons')
    .update({ description: richJSContent })
    .eq('slug', 'js-l0-what-is-javascript'); // matches the l0 increment unique format

  if (updErr) {
    console.error('Failed to update JavaScript Lesson 1 description:', updErr.message);
  } else {
    console.log('Rich JavaScript Lesson 1 description updated successfully!');
  }

  console.log('\nAll topics seeded successfully into your Supabase database!');
}

run();
