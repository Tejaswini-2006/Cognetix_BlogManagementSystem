const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Post = require('../models/Post');

const samplePosts = [
  {
    title: 'Architecting Scalable Microservices with Node.js and Event-Driven Pipelines',
    category: 'Software Engineering',
    excerpt: 'An engineering deep-dive into breaking monoliths into resilient, decoupled microservices using message brokers, idempotent consumers, and distributed tracing.',
    content: `Modern software systems operate under demands of continuous availability and elastic scalability. When moving from a monolithic architecture to microservices, software engineers frequently confront the challenges of distributed transactions, network latency, and eventual consistency.

In this comprehensive guide, we will analyze the key architectural patterns required to build resilient microservice backends with Node.js and MongoDB.

### 1. Decoupled Communication via Message Brokers
Synchronous HTTP calls between microservices introduce tight coupling and cascading failure modes. By introducing asynchronous event brokers such as RabbitMQ or Kafka, services publish domain events without knowing or waiting for consumers.

### 2. Idempotent Consumer Design
In distributed systems, networks will periodically duplicate packets. Designing idempotent consumers ensures that processing a message multiple times yields the exact same state as processing it once. Mongoose unique compound indexes and optimistic concurrency control (OCC) using version keys (__v) provide built-in safeguards.

### 3. Distributed Tracing & Observability
Without correlation IDs, debugging requests across six distinct services becomes nearly impossible. By tagging incoming HTTP requests with an X-Correlation-ID header, all downstream queries and logs can be aggregated into a single trace timeline.

Adopting these architectural patterns ensures your backend scales seamlessly as user traffic surges.`
  },
  {
    title: 'Mastering React 18: Concurrent Mode, Suspense, and State Synchronization',
    category: 'Web Development',
    excerpt: 'Explore how React 18 revolutionizes user experience with Concurrent Mode, transitions, and streaming server components for sub-second page loads.',
    content: `React 18 introduced foundational upgrades to how the virtual DOM reconciles updates and prioritizes CPU cycles. By giving developers control over concurrent rendering, sluggish user interfaces can be rendered obsolete.

### Understanding Concurrent Rendering
Traditionally, rendering in React was an uninterrupted, synchronous operation. Once React began evaluating the component tree, it could not yield back to the main thread until the entire tree was resolved. If an update took 80 milliseconds, keystrokes and scroll events suffered visible frame drops.

With Concurrent Rendering, React can pause, resume, and abandon rendering tasks based on user priority.

### useTransition: Prioritizing Critical Updates
When users type in a search input, updating the input box must feel instantaneous (urgent update), while filtering a large table of 500 records is non-urgent. The useTransition hook allows developers to designate the filtering operation as a low-priority transition:

\`\`\`javascript
const [isPending, startTransition] = useTransition();

const handleSearch = (e) => {
  setInputValue(e.target.value); // Urgent
  startTransition(() => {
    setFilterQuery(e.target.value); // Non-urgent
  });
};
\`\`\`

By strategically segregating high-priority and transition updates, React applications feel lightning-fast even under heavy computational load.`
  },
  {
    title: 'Securing REST APIs: Beyond Simple JWTs and OWASP Top 10 Best Practices',
    category: 'Technology',
    excerpt: 'A defensive guide to locking down Node.js APIs against injection, broken object-level authorization (BOLA), and credential stuffing.',
    content: `API security is often reduced to slapping a JSON Web Token into an Authorization header. However, real-world penetration tests show that authentication is only the first line of defense. Broken Object-Level Authorization (BOLA)—where an authenticated user accesses another user's private data—remains the #1 vulnerability on the OWASP API Security Top 10 list.

### 1. Server-Enforced Ownership Verification
Never trust client parameters blindly. If an endpoint receives \`DELETE /api/posts/:id\`, the server must verify not only that the token is valid, but also that \`post.author.equals(req.user._id)\`. Hiding a button on the UI provides zero real protection against malicious API tools.

### 2. Robust Password Hashing with Salt Rounds
Bcrypt provides computationally expensive hashing designed to withstand brute-force attacks. Generating unique cryptographic salts with cost factor 10 or 12 guarantees that identical passwords produce completely distinct hashes, defeating precomputed rainbow tables.

### 3. Rate Limiting and Payload Constraints
Unbounded JSON bodies allow denial-of-service attacks by exhausting memory. Always configure \`express.json({ limit: '10kb' })\` and rate-limit authentication endpoints to prevent credential stuffing.

Security is not a feature you add at the end of development; it is a foundational mindset built into every route handler.`
  },
  {
    title: 'The Art of Modern UI/UX: Design Systems, Glassmorphism, and Accessibility',
    category: 'Design & UI/UX',
    excerpt: 'How to craft digital products that balance aesthetic beauty, responsive versatility, and accessible WCAG standards.',
    content: `Great user experience is the synthesis of visual delight and effortless usability. Modern web interfaces have evolved from flat, uninspired boxes into dynamic, multi-layered digital canvases.

### 1. Design Tokens and Unified Rhythm
A cohesive design system begins with CSS variables that define colors, radii, shadows, and typographic scales. When spacing is constrained to a 4px/8px modular scale, every card, button, and header resonates with visual harmony.

### 2. Glassmorphism and Depth
By utilizing backdrop filters (\`backdrop-filter: blur(14px)\`) combined with semi-transparent surfaces (\`rgba(15, 23, 42, 0.7)\`) and subtle inset borders, interfaces gain a tactile sense of depth without cluttering the screen.

### 3. Accessibility First (a11y)
A beautiful interface is a failure if people with assistive technologies cannot navigate it. High color contrast ratios (WCAG AA compliant), visible keyboard focus rings, semantic HTML elements (<main>, <nav>, <article>), and descriptive ARIA labels ensure your app welcomes everyone.

When design meets empathetic engineering, great software happens.`
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cognetix_blog');
    console.log('[Seed] Connected to MongoDB database');

    // Create or find default demo author
    const demoEmail = 'author@cognetix.com';
    let author = await User.findOne({ email: demoEmail });

    if (!author) {
      author = await User.create({
        name: 'Tejaswini Dev',
        email: demoEmail,
        password: 'password123'
      });
      console.log(`[Seed] Created demo author: ${demoEmail} (password: password123)`);
    } else {
      console.log(`[Seed] Existing demo author found: ${demoEmail}`);
    }

    // Check existing posts count
    const existingPostsCount = await Post.countDocuments();
    if (existingPostsCount === 0) {
      for (const item of samplePosts) {
        await Post.create({
          ...item,
          author: author._id
        });
      }
      console.log(`[Seed] Successfully inserted ${samplePosts.length} initial blog posts!`);
    } else {
      console.log(`[Seed] Database already has ${existingPostsCount} posts. Skipping sample insertion.`);
    }

    console.log('[Seed] Database seeding completed successfully.');
  } catch (err) {
    console.error('[Seed Error]:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seedDB();
