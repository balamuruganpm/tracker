export interface SeedTask {
  title: string
  description?: string
  task_type: string
  upload: boolean
  estimated_minutes: number
}

interface SeedLesson {
  title: string
  slug: string
  description?: string
  estimated_minutes: number
  difficulty: string
  learning_objectives: string[]
  prerequisites: string[]
  tasks: SeedTask[]
}

interface SeedChapter {
  title: string
  description?: string
  lessons: SeedLesson[]
}

interface SeedModule {
  title: string
  description?: string
  chapters: SeedChapter[]
}

export interface SeedCourse {
  title: string
  slug: string
  description: string
  difficulty: string
  estimated_hours: number
  icon: string
  color: string
  modules: SeedModule[]
}

export const seedCurriculum: SeedCourse[] = [
  // 1. Frontend
  {
    title: 'HTML Complete Course',
    slug: 'html',
    description: 'Learn structure, tags, elements, forms, and semantic markup.',
    difficulty: 'Beginner',
    estimated_hours: 15,
    icon: 'code',
    color: 'orange',
    modules: [
      {
        title: 'HTML Fundamentals',
        description: 'Basics of web structure.',
        chapters: [
          {
            title: 'Introduction to HTML',
            lessons: [
              {
                title: 'What is HTML?',
                slug: 'what-is-html',
                description: 'HTML is the standard markup language for creating web pages. It defines the structure of your content.',
                estimated_minutes: 30,
                difficulty: 'Beginner',
                learning_objectives: ['Understand elements & tags', 'Create headers & paragraphs'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Create your first index.html file',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 20
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'CSS Complete Course',
    slug: 'css',
    description: 'Master styles, selectors, flexbox, grid, and layouts.',
    difficulty: 'Beginner',
    estimated_hours: 20,
    icon: 'palette',
    color: 'blue',
    modules: [
      {
        title: 'CSS Styling',
        description: 'Master margins, paddings, colors, and layout systems.',
        chapters: [
          {
            title: 'CSS Basics',
            lessons: [
              {
                title: 'Introduction to CSS',
                slug: 'what-is-css',
                description: 'CSS describes how HTML elements are to be displayed on screen, paper, or in other media.',
                estimated_minutes: 40,
                difficulty: 'Beginner',
                learning_objectives: ['Understand selectors', 'Apply styles and colors'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Style your first HTML page with custom colors',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 30
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'JavaScript Complete Course',
    slug: 'javascript',
    description: 'Master fundamentals, DOM, events, asynchronous logic, and ES6 functions.',
    difficulty: 'Intermediate',
    estimated_hours: 45,
    icon: 'js',
    color: 'yellow',
    modules: [
      {
        title: 'JavaScript Fundamentals',
        description: 'Core concepts of variables, functions, scopes, and loops.',
        chapters: [
          {
            title: 'Introduction to JavaScript',
            lessons: [
              {
                title: 'What is JavaScript?',
                slug: 'what-is-javascript',
                description: `## Topics
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
JavaScript is:
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
10. Give one use case for JavaScript on the server.`,
                estimated_minutes: 60,
                difficulty: 'Beginner',
                learning_objectives: ['Define core JavaScript behaviors', 'Compare Browser and Node.js Runtimes', 'Explain JS Engines'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Practice 1: Write 5 real-world applications of JavaScript',
                    task_type: 'practice',
                    upload: false,
                    estimated_minutes: 20
                  },
                  {
                    title: 'Practice 2: Write the difference between HTML, CSS, and JavaScript',
                    task_type: 'practice',
                    upload: false,
                    estimated_minutes: 20
                  },
                  {
                    title: 'Assignment: Complete JavaScript Intro document',
                    task_type: 'upload',
                    upload: true,
                    estimated_minutes: 40
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'React Architecture',
    slug: 'react',
    description: 'Learn virtual DOM, component architecture, states, and hooks.',
    difficulty: 'Intermediate',
    estimated_hours: 30,
    icon: 'atom',
    color: 'cyan',
    modules: [
      {
        title: 'React Core',
        description: 'Fundamentals of React components.',
        chapters: [
          {
            title: 'Components & State',
            lessons: [
              {
                title: 'Introduction to React Hooks',
                slug: 'react-hooks-intro',
                description: 'Learn useState and useEffect for functional stateful components.',
                estimated_minutes: 60,
                difficulty: 'Intermediate',
                learning_objectives: ['Manage local state', 'Trigger side effects'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Create a dynamic counter component',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 30
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'TypeScript Complete',
    slug: 'typescript',
    description: 'Statically typed JavaScript helper rules, generic values, and mapped types.',
    difficulty: 'Intermediate',
    estimated_hours: 20,
    icon: 'shield',
    color: 'sky',
    modules: [
      {
        title: 'Strict Types',
        description: 'Introduction to types and interfaces.',
        chapters: [
          {
            title: 'Core Typing',
            lessons: [
              {
                title: 'Types vs Interfaces',
                slug: 'types-vs-interfaces',
                description: 'Understand the syntax difference and extendability features.',
                estimated_minutes: 45,
                difficulty: 'Intermediate',
                learning_objectives: ['Define custom types', 'Extend interfaces'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Build strict interfaces for a user profile object',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 30
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Next.js Architecture',
    slug: 'nextjs',
    description: 'Master file-based App Router routing, server/client components, and APIs.',
    difficulty: 'Advanced',
    estimated_hours: 35,
    icon: 'globe',
    color: 'zinc',
    modules: [
      {
        title: 'Next App Router',
        description: 'Server side rendering & routing configurations.',
        chapters: [
          {
            title: 'Dynamic Routing',
            lessons: [
              {
                title: 'App Router Layouts & Pages',
                slug: 'nextjs-layouts-pages',
                description: 'Create nested routes and custom layouts.',
                estimated_minutes: 70,
                difficulty: 'Advanced',
                learning_objectives: ['Implement layouts', 'Build custom route handlers'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Design a nested route configuration',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 40
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // 2. Microsoft 365 Development
  {
    title: 'SharePoint Online',
    slug: 'sharepoint-online',
    description: 'Lists creation, document libraries mapping, custom columns, views, and schemas.',
    difficulty: 'Beginner',
    estimated_hours: 20,
    icon: 'sharepoint',
    color: 'green',
    modules: [
      {
        title: 'SharePoint Configuration',
        description: 'Tenant setups, schemas, site groups.',
        chapters: [
          {
            title: 'SPO Lists & Document Libraries',
            lessons: [
              {
                title: 'SPO List Schema Definitions',
                slug: 'spo-list-schemas',
                description: 'Define fields, choice columns, lookups, and views.',
                estimated_minutes: 50,
                difficulty: 'Beginner',
                learning_objectives: ['Create custom columns', 'Create SPO lookup views'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Provision custom SPO lists for employee database',
                    task_type: 'practice',
                    upload: true,
                    estimated_minutes: 40
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'SharePoint Framework (SPFx)',
    slug: 'spfx',
    description: 'Enterprise customization of custom web parts using SPFx Yeoman generators.',
    difficulty: 'Advanced',
    estimated_hours: 40,
    icon: 'terminal',
    color: 'teal',
    modules: [
      {
        title: 'SPFx Components',
        description: 'Properties panes and extensions.',
        chapters: [
          {
            title: 'Client Web Parts',
            lessons: [
              {
                title: 'Build SPFx Client Web Parts',
                slug: 'spfx-client-webparts',
                description: 'Install dependencies and build SPFx webparts with React.',
                estimated_minutes: 120,
                difficulty: 'Advanced',
                learning_objectives: ['Run Yeoman generator', 'Define property pane parameters'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Build custom SPFx layout view web part',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 80
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'PnP JS Library',
    slug: 'pnpjs',
    description: 'Learn simple querying commands for SPO lists, attachments, and profiles.',
    difficulty: 'Intermediate',
    estimated_hours: 20,
    icon: 'link',
    color: 'sky',
    modules: [
      {
        title: 'PnPJS Integration',
        description: 'SPO CRUD actions.',
        chapters: [
          {
            title: 'PnPJS SPO Operations',
            lessons: [
              {
                title: 'SPO Item CRUD Actions',
                slug: 'pnpjs-spo-crud',
                description: 'Retrieve, create, edit, and delete list items using PnPJS.',
                estimated_minutes: 90,
                difficulty: 'Intermediate',
                learning_objectives: ['Query lists using PnPJS sp.web.lists', 'Execute batch updates'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Build a list CRUD operations dashboard helper',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 60
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Microsoft Graph API',
    slug: 'msgraph',
    description: 'Authorize client tokens to read User profiles, Outlook calendar logs, and MS Teams details.',
    difficulty: 'Advanced',
    estimated_hours: 25,
    icon: 'user-check',
    color: 'indigo',
    modules: [
      {
        title: 'Graph API Authentication',
        description: 'Microsoft Entra integrations.',
        chapters: [
          {
            title: 'Graph SDK Queries',
            lessons: [
              {
                title: 'Querying User Profiles via Graph',
                slug: 'msgraph-user-query',
                description: 'Authenticate and fetch tenant profiles using Graph SDK client.',
                estimated_minutes: 100,
                difficulty: 'Advanced',
                learning_objectives: ['Request tenant tokens', 'Decode Microsoft Graph user payload'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Fetch user profile payload',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 50
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // 3. Power Platform
  {
    title: 'Power Apps Complete',
    slug: 'power-apps',
    description: 'Design canvas layout pages, custom galleries, properties binding, variables, and Dataverse inputs.',
    difficulty: 'Intermediate',
    estimated_hours: 30,
    icon: 'layout',
    color: 'pink',
    modules: [
      {
        title: 'Canvas Applications',
        description: 'App creation, formulas, collections.',
        chapters: [
          {
            title: 'Gallery Binding & State',
            lessons: [
              {
                title: 'Galleries Data Binding',
                slug: 'powerapps-gallery-binding',
                description: 'Bind SharePoint lists and Dataverse entities to galleries.',
                estimated_minutes: 90,
                difficulty: 'Intermediate',
                learning_objectives: ['Bind Data Sources', 'Design custom cards layout'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Design customer ticket gallery layout',
                    task_type: 'practice',
                    upload: true,
                    estimated_minutes: 60
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Power Automate Cloud',
    slug: 'power-automate-cloud',
    description: 'Trigger workflows, scheduled loops, custom JSON responses, and approval templates.',
    difficulty: 'Intermediate',
    estimated_hours: 25,
    icon: 'cloud',
    color: 'indigo',
    modules: [
      {
        title: 'Cloud Triggers',
        description: 'Automated triggers, loops, approvals.',
        chapters: [
          {
            title: 'Approval Flows',
            lessons: [
              {
                title: 'SPO Approval System Flow',
                slug: 'pao-approval-systems',
                description: 'Trigger flow when items are added and execute approval loops.',
                estimated_minutes: 90,
                difficulty: 'Intermediate',
                learning_objectives: ['Trigger approval steps', 'Handle response conditionals'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Build employee leave approval flow',
                    task_type: 'practice',
                    upload: true,
                    estimated_minutes: 45
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Power Automate Desktop',
    slug: 'power-automate-desktop',
    description: 'Automate tasks, Excel parsing loops, file handlers, browser interactions, and systems scripting.',
    difficulty: 'Intermediate',
    estimated_hours: 30,
    icon: 'cpu',
    color: 'purple',
    modules: [
      {
        title: 'RPA Automation',
        description: 'RPA Excel, file processing.',
        chapters: [
          {
            title: 'RPA Excel Operations',
            lessons: [
              {
                title: 'RPA Spreadsheet Parsing Loops',
                slug: 'pad-excel-parsing',
                description: 'Load spreadsheets, loop rows, map cells, and write logs.',
                estimated_minutes: 90,
                difficulty: 'Intermediate',
                learning_objectives: ['Launch Excel flows', 'Parse cells into DataTables'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Build Excel lists extraction RPA flow',
                    task_type: 'practice',
                    upload: true,
                    estimated_minutes: 50
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Dataverse Customization',
    slug: 'dataverse',
    description: 'Configure custom tables, relationships mapping, fields validations, security groups, and rules.',
    difficulty: 'Advanced',
    estimated_hours: 25,
    icon: 'database',
    color: 'violet',
    modules: [
      {
        title: 'Dataverse Tables',
        description: 'Relations, security, permissions.',
        chapters: [
          {
            title: 'Entity Customization',
            lessons: [
              {
                title: 'Relations Mapping (1:N, N:N)',
                slug: 'dataverse-relations',
                description: 'Design robust schemas with custom relationships and lookups.',
                estimated_minutes: 80,
                difficulty: 'Advanced',
                learning_objectives: ['Establish lookups', 'Implement cascade settings'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Construct project tables relations schema',
                    task_type: 'practice',
                    upload: true,
                    estimated_minutes: 40
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // 4. Microsoft Identity & DevOps
  {
    title: 'Microsoft Entra ID (Azure AD)',
    slug: 'entra-id',
    description: 'Authentication setup, app registrations configuration, OAuth scopes, and tenant directory permissions.',
    difficulty: 'Advanced',
    estimated_hours: 20,
    icon: 'key',
    color: 'emerald',
    modules: [
      {
        title: 'Entra Registrations',
        description: 'OAuth scopes, API permissions.',
        chapters: [
          {
            title: 'App Registrations',
            lessons: [
              {
                title: 'Configure OAuth Scopes',
                slug: 'entra-app-registrations',
                description: 'Register apps, configure permissions, and generate client secrets.',
                estimated_minutes: 90,
                difficulty: 'Advanced',
                learning_objectives: ['Register Azure AD apps', 'Grant API admin consents'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Configure Entra ID app registration secrets',
                    task_type: 'practice',
                    upload: true,
                    estimated_minutes: 40
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Power BI Fundamentals',
    slug: 'power-bi',
    description: 'Visualize data dashboards, DAX queries, fields mapping, and custom graphics reports.',
    difficulty: 'Intermediate',
    estimated_hours: 20,
    icon: 'bar-chart-2',
    color: 'yellow',
    modules: [
      {
        title: 'Power BI Reports',
        description: 'DAX formulas, dashboards compilation.',
        chapters: [
          {
            title: 'DAX Analytics',
            lessons: [
              {
                title: 'DAX Formulas & Relationships',
                slug: 'powerbi-dax-relationships',
                description: 'Write custom DAX columns and calculate filters.',
                estimated_minutes: 90,
                difficulty: 'Intermediate',
                learning_objectives: ['Create custom metrics', 'Apply filters inside DAX'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Build Sales performance DAX dashboard',
                    task_type: 'practice',
                    upload: true,
                    estimated_minutes: 50
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Azure Fundamentals (AZ-900)',
    slug: 'azure-fundamentals',
    description: 'Core cloud services definitions, storage accounts configuration, and networking groups.',
    difficulty: 'Beginner',
    estimated_hours: 15,
    icon: 'cloud-lightning',
    color: 'sky',
    modules: [
      {
        title: 'Azure Cloud Core',
        description: 'VMs, storage accounts, groups.',
        chapters: [
          {
            title: 'Azure Storage & Security',
            lessons: [
              {
                title: 'Provision Storage Accounts',
                slug: 'az-storage-accounts',
                description: 'Establish containers, configure SAS tokens, and verify permissions.',
                estimated_minutes: 60,
                difficulty: 'Beginner',
                learning_objectives: ['Create storage containers', 'Generate SAS keys'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Provision secure blob storage account',
                    task_type: 'practice',
                    upload: true,
                    estimated_minutes: 30
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Azure DevOps Services',
    slug: 'azure-devops',
    description: 'Git repository setups, Boards configurations, Pipelines CI/CD builds, and work items tracker.',
    difficulty: 'Advanced',
    estimated_hours: 25,
    icon: 'git-branch',
    color: 'indigo',
    modules: [
      {
        title: 'DevOps Pipelines',
        description: 'CI/CD YAML files, repositories, boards.',
        chapters: [
          {
            title: 'YAML Builds & Boards',
            lessons: [
              {
                title: 'Build CI/CD Pipelines with YAML',
                slug: 'devops-ci-cd-pipelines',
                description: 'Configure automated YAML trigger builds and deployment steps.',
                estimated_minutes: 100,
                difficulty: 'Advanced',
                learning_objectives: ['Define YAML pipeline triggers', 'Configure deployment pools'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Build continuous integration YAML flow',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 50
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // 5. Capstone Projects
  {
    title: 'Microsoft 365 Employee Portal',
    slug: 'm365-employee-portal',
    description: 'Deploy SPFx webparts dashboard integrated with Entra ID profiles and Microsoft Graph.',
    difficulty: 'Advanced',
    estimated_hours: 40,
    icon: 'user-plus',
    color: 'teal',
    modules: [
      {
        title: 'Project Construction',
        description: 'Integrate SharePoint documents, profiles lookup, and dynamic notifications.',
        chapters: [
          {
            title: 'Core Intranet Portal Deployment',
            lessons: [
              {
                title: 'Build Portal Dashboard Layout',
                slug: 'build-portal-layout',
                description: 'Assemble all SPFx webparts into a single active employee portal dashboard.',
                estimated_minutes: 240,
                difficulty: 'Advanced',
                learning_objectives: ['Deploy web parts', 'Configure tenant permissions'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Complete and deploy Employee Portal project',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 180
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'HR Management System',
    slug: 'hr-management-system',
    description: 'Assemble canvas layout pages, custom list databases, approval workflows, and roles permissions.',
    difficulty: 'Intermediate',
    estimated_hours: 35,
    icon: 'users',
    color: 'pink',
    modules: [
      {
        title: 'HR App Portal',
        description: 'Employee onboarding checklists, leave approvals, and profiles databases.',
        chapters: [
          {
            title: 'Onboarding & Approvals',
            lessons: [
              {
                title: 'Build Onboarding Workflows App',
                slug: 'build-hr-app',
                description: 'Integrate leave approvals cloud flows with Power Apps dashboards.',
                estimated_minutes: 200,
                difficulty: 'Intermediate',
                learning_objectives: ['Link approvals', 'Format custom gallery cards'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Deploy HR onboarding canvas application',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 120
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Learning Management System',
    slug: 'learning-management-system',
    description: 'Create training outline portals, tasks tracking checklists, and certificates verification databases.',
    difficulty: 'Intermediate',
    estimated_hours: 35,
    icon: 'book',
    color: 'purple',
    modules: [
      {
        title: 'LMS Application',
        description: 'Track course modules, progress percentages, and download credentials.',
        chapters: [
          {
            title: 'Course Outline Tracker',
            lessons: [
              {
                title: 'Build Progress Tracking Dashboard',
                slug: 'build-lms-tracker',
                description: 'Implement user progress checklists with certificates generation logic.',
                estimated_minutes: 180,
                difficulty: 'Intermediate',
                learning_objectives: ['Query progress logs', 'Generate certificates'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Submit training LMS dashboard program',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 120
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    title: 'Enterprise Intranet Portal',
    slug: 'enterprise-intranet-portal',
    description: 'Consolidate multiple SPO document libraries, search filters, Entra groups, and approvals in a secure site.',
    difficulty: 'Advanced',
    estimated_hours: 50,
    icon: 'layout',
    color: 'blue',
    modules: [
      {
        title: 'Intranet Architecture',
        description: 'Search configurations, document management schemas, security policies.',
        chapters: [
          {
            title: 'Intranet Deployment',
            lessons: [
              {
                title: 'Consolidate Enterprise Sites Layout',
                slug: 'build-intranet-portal',
                description: 'Link department sites and configure global navigation headers.',
                estimated_minutes: 300,
                difficulty: 'Advanced',
                learning_objectives: ['Configure global navigation', 'Deploy SPO security groups'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Deploy final Intranet Portal layout',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 240
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]
