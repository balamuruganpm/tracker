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
  {
    title: 'JavaScript Masterclass',
    slug: 'javascript',
    description: 'Master the core runtime, syntax, asynchronous loops, event queues, and functional elements of JavaScript.',
    difficulty: 'Intermediate',
    estimated_hours: 45,
    icon: 'js',
    color: 'yellow',
    modules: [
      {
        title: 'Core Fundamentals',
        description: 'Deep dive into standard variables, arrays, scope, and loops.',
        chapters: [
          {
            title: 'Scope and Closures',
            description: 'Learn execution context, lexical scope, and closures.',
            lessons: [
              {
                title: 'Lexical Scope & Scope Chain',
                slug: 'js-lexical-scope',
                description: 'Understand how compilation and scopes determine variable accessibility.',
                estimated_minutes: 60,
                difficulty: 'Beginner',
                learning_objectives: ['Define global and block scopes', 'Understand nested scope execution loops', 'Identify shadow variables'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Write lexical scoping exercises',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 30
                  }
                ]
              },
              {
                title: 'Closures in Practice',
                slug: 'js-closures-practice',
                description: 'Learn to use closures for private states, helper factories, and memorization cache layers.',
                estimated_minutes: 90,
                difficulty: 'Intermediate',
                learning_objectives: ['Define private state variables', 'Build module patterns using closures', 'Handle memory allocation checks'],
                prerequisites: ['js-lexical-scope'],
                tasks: [
                  {
                    title: 'Create a stateful counter factory program',
                    task_type: 'coding',
                    upload: true,
                    estimated_minutes: 45
                  }
                ]
              }
            ]
          },
          {
            title: 'Asynchronous JavaScript',
            description: 'Promises, Async/Await, and Web APIs.',
            lessons: [
              {
                title: 'The Event Loop & Call Stack',
                slug: 'js-event-loop',
                description: 'Deconstruct how JavaScript handles concurrency, microtasks, and macrotasks.',
                estimated_minutes: 120,
                difficulty: 'Advanced',
                learning_objectives: ['Differentiate macro and micro task queues', 'Trace call stack executions', 'Avoid blocking CPU threads'],
                prerequisites: ['js-closures-practice'],
                tasks: [
                  {
                    title: 'Map a visual sequence of setTimeout vs Promise tasks',
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
    title: 'Modern React Architecture',
    slug: 'react',
    description: 'Learn hooks lifecycles, virtual DOM mechanics, performance tuning, rendering optimization, and advanced patterns.',
    difficulty: 'Intermediate',
    estimated_hours: 60,
    icon: 'react',
    color: 'cyan',
    modules: [
      {
        title: 'Core Engine & Hooks',
        description: 'Master rendering life-cycles, reconciliation, state queues, and side effects.',
        chapters: [
          {
            title: 'State and Effects',
            description: 'Hooks usage patterns, dependencies, and synchronization.',
            lessons: [
              {
                title: 'Reconciliation & Virtual DOM',
                slug: 'react-reconciliation-vdom',
                description: 'How React updates the DOM tree efficiently using diffing algorithms.',
                estimated_minutes: 90,
                difficulty: 'Intermediate',
                learning_objectives: ['Understand key attribute dependencies', 'Explore component render phases', 'Analyze fiber nodes'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Demonstrate component re-render loops',
                    task_type: 'practice',
                    upload: true,
                    estimated_minutes: 30
                  }
                ]
              },
              {
                title: 'Custom Hooks Factory',
                slug: 'react-custom-hooks-factory',
                description: 'Extract stateful components logic into reusable React Hooks.',
                estimated_minutes: 120,
                difficulty: 'Intermediate',
                learning_objectives: ['Encapsulate fetch actions', 'Handle debounce logic in custom hooks', 'Synchronize states across render layers'],
                prerequisites: ['react-reconciliation-vdom'],
                tasks: [
                  {
                    title: 'Develop a useDebounce hook component',
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
    title: 'TypeScript Advanced Types',
    slug: 'typescript',
    description: 'Strict type verifications, generics mapping, conditional definitions, utility helpers, and configurations.',
    difficulty: 'Advanced',
    estimated_hours: 35,
    icon: 'ts',
    color: 'sky',
    modules: [
      {
        title: 'Generics & Utilities',
        description: 'Build reusable interfaces, utility definitions, and union checks.',
        chapters: [
          {
            title: 'Advanced Type Mapping',
            description: 'Conditional checking, generic constraints, and infer operations.',
            lessons: [
              {
                title: 'Generic Constraints & Infer',
                slug: 'ts-generics-infer',
                description: 'Design flexible functions using dynamic constraints and return value type infers.',
                estimated_minutes: 100,
                difficulty: 'Advanced',
                learning_objectives: ['Apply extends constraints to generic values', 'Infer object parameter parameters', 'Build mapped interfaces'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Implement generic array transformer functions',
                    task_type: 'coding',
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
    title: 'SharePoint Framework (SPFx)',
    slug: 'spfx',
    description: 'Build enterprise-grade SPFx web parts, extensions, Graph API integrations, PnPJS templates, and teams models.',
    difficulty: 'Advanced',
    estimated_hours: 50,
    icon: 'sharepoint',
    color: 'teal',
    modules: [
      {
        title: 'Enterprise Customization',
        description: 'Build SPFx web parts and extensions connected to Microsoft Graph.',
        chapters: [
          {
            title: 'SPFx Core Web Parts',
            description: 'Properties pane, Yeoman templates, dynamic settings.',
            lessons: [
              {
                title: 'Microsoft Graph Integration',
                slug: 'spfx-microsoft-graph',
                description: 'Query tenant data using MSGraphClient and SPHttpClient structures.',
                estimated_minutes: 180,
                difficulty: 'Advanced',
                learning_objectives: ['Verify Azure AD registration permissions', 'Query user profiles using Graph', 'Format cards dynamically in web parts'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Build a tenant profile lookup web part',
                    task_type: 'upload',
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
    title: 'Power Apps Canvas & Model Driven',
    slug: 'power-apps',
    description: 'Design canvas pages, galleries mapping, Dataverse configurations, variables lifecycle, and formulas.',
    difficulty: 'Intermediate',
    estimated_hours: 45,
    icon: 'layout',
    color: 'pink',
    modules: [
      {
        title: 'App Construction',
        description: 'Canvas layout design, collections, performance, and variables.',
        chapters: [
          {
            title: 'State & Variables',
            description: 'Global vs context variables, collections, and delegations.',
            lessons: [
              {
                title: 'Variable Scopes & ClearCollect',
                slug: 'powerapps-state-variables',
                description: 'Manage canvas application state via Set, UpdateContext, and Collections.',
                estimated_minutes: 120,
                difficulty: 'Intermediate',
                learning_objectives: ['Implement Context vs Global variables', 'Build multi-item local Collections', 'Perform search validations'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Create an offline invoice collection dashboard',
                    task_type: 'practice',
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
    title: 'Power Automate Desktop (RPA)',
    slug: 'power-automate-desktop',
    description: 'Construct UI flows, system loops, Excel automation, web parsing processes, and desktop scripts.',
    difficulty: 'Intermediate',
    estimated_hours: 40,
    icon: 'cpu',
    color: 'purple',
    modules: [
      {
        title: 'RPA Flows',
        description: 'UI recording, Excel parsing, file handlers, and desktop automation.',
        chapters: [
          {
            title: 'Excel Data Extraction',
            description: 'Read spreadsheets, process cell data, and insert logs.',
            lessons: [
              {
                title: 'Excel Data Extraction Loops',
                slug: 'pad-excel-data-extraction',
                description: 'Open files, extract columns, apply transformations, and write results.',
                estimated_minutes: 100,
                difficulty: 'Intermediate',
                learning_objectives: ['Launch Excel flows', 'Parse cells into DataTables', 'Loop rows applying conditional validation'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Build Excel customer list extraction RPA script',
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
    title: 'Power Automate Online (Cloud)',
    slug: 'power-automate-online',
    description: 'Create automated, scheduled, and instant cloud flows with custom connectors, triggers, variables, and JSON parsers.',
    difficulty: 'Intermediate',
    estimated_hours: 40,
    icon: 'cloud',
    color: 'indigo',
    modules: [
      {
        title: 'Cloud Workflows',
        description: 'Triggers, custom connectors, loops, and conditions.',
        chapters: [
          {
            title: 'JSON Parsing & Loops',
            description: 'Read payloads, extract attributes, and run loops.',
            lessons: [
              {
                title: 'Parse JSON in Cloud Flows',
                slug: 'pao-parse-json-flows',
                description: 'Trigger flow on web requests, parse body JSON, and loop attributes.',
                estimated_minutes: 90,
                difficulty: 'Intermediate',
                learning_objectives: ['Configure request triggers', 'Generate JSON schemas', 'Perform Apply to Each iterations'],
                prerequisites: [],
                tasks: [
                  {
                    title: 'Build automated email payload parser flow',
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
  }
]
