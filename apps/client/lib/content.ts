export const profileData = {
  name: "Naufal Syarif",
  role: "Software Engineer",
};

// --- Types ---

export type SocialPlatform = "github" | "linkedin" | "twitter" | "instagram";

export type LayoutConfig = {
  colSpan: 1 | 2 | 3;
  rowSpan: 1 | 2;
};

export type StyleConfig = {
  background?: string; // e.g., "bg-zinc-300"
  textColor?: string; // e.g., "text-white"
  borderRadius?: string; // e.g., "rounded-3xl"
  overflow?: "hidden" | "visible"; // Replaces className="overflow-hidden"
  contentAlignment?: "center" | "start"; // Replaces className="flex items-center justify-center"
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl"; // New variable for drop shadow
};

// Discriminated Union Types
export type ProfileCard = {
  id: number; // Numeric ID
  slug: string; // URL Slug
  type: "profile";
  layout: LayoutConfig;
  style?: StyleConfig;
  data: {
    avatar: string;
    variant?: "circle" | "square";
  };
};

export type SocialCard = {
  id: number;
  slug: string;
  type: "social";
  layout: LayoutConfig;
  style?: StyleConfig;
  data: {
    variant?: "default" | "glass" | "outline";
    links: { platform: SocialPlatform; url: string }[];
  };
};

export type SheetCard = {
  id: number;
  slug: string;
  type: "sheet";
  layout: LayoutConfig;
  style?: StyleConfig;
  data: {
    title?: string;
    description?: string;
    content?: string; // Short text displayed on the card
    sheetTitle?: string;

    sheetContent?: string; // HTML content for the sheet
    heroImageUrl?: string; // Optional image URL for the header
    gallery?: string[]; // Array of image URLs for the gallery
    tags?: string[]; // Array of tags/tech stack
    date?: string; // e.g., "Oct 2023 - Present"
    cta?: {
      label: string;
      url: string;
      icon?: "github" | "link"; // Optional icon type
    };
    alignment?: "center" | "bottom-left";
    cover?: {
      url: string;
      type?: "image" | "video"; // Default to 'image'
      expandedPosition?: "header" | "content"; // Default to 'header'
    };
    label?: string; // New: Badge Label
    labelPosition?: "top-left" | "top-center"; // New: Label Position
  };
};

// Widget Data Types
export type BaseWidgetData = {
  label?: string;
  labelPosition?: "top-left" | "top-center";
};

export type SpotifyWidgetData = BaseWidgetData & {
  type: "spotify";
  variant?: "default" | "large";
  isPlaying: boolean;
  songTitle: string;
  artist: string;
  albumArtUrl: string;
  spotifyUrl: string;
};

export type TechStackWidgetData = BaseWidgetData & {
  type: "tech-stack";
  variant?: "default" | "terminal" | "icons" | "bubble" | "bubble-grid";
  stack: string[];
};

export type TimeLocationWidgetData = BaseWidgetData & {
  type: "time-location";
  variant?: "default" | "analog" | "cycle";
  withFace?: boolean;
  timeZone: string;
  locationName?: string;
  latLng: [number, number];
};

export type ChatWidgetData = BaseWidgetData & {
  type: "chat";
};

export type WidgetCard = {
  id: number;
  slug: string;
  type: "widget";
  layout: LayoutConfig;
  style?: StyleConfig;
  data:
    | SpotifyWidgetData
    | TechStackWidgetData
    | TimeLocationWidgetData
    | ChatWidgetData;
};

export type BentoItem = ProfileCard | SocialCard | SheetCard | WidgetCard;

// --- Data ---

export const bentoGridItems: BentoItem[] = [
  {
    id: 1,
    slug: "profile-photo",
    type: "profile",
    layout: { colSpan: 1, rowSpan: 1 },
    style: {
      background: "bg-transparent",
      textColor: "text-white",
      overflow: "visible",
    },
    data: {
      avatar: "/assets/identity/profile_picture2.jpg",
      variant: "circle",
    },
  },
  {
    id: 2,
    slug: "about-me",
    type: "sheet",
    layout: { colSpan: 1, rowSpan: 1 },
    style: {
      contentAlignment: "center",
      shadow: "lg",
    },
    data: {
      label: "About Me",
      labelPosition: "top-center",
      title: "I'm a Software Engineer",
      description: "crafting digital experiences that matter.",
      sheetTitle: "Hello, I'm Naufal.",
      sheetContent: `
        <div class="prose dark:prose-invert">
          <p>
              I'm a Software Engineer based in Jakarta, ID. I don't just write code; I build digital products that people love to use.
          </p>
          <p>
              My journey started with a curiosity about how things work on the web. That curiosity turned into a passion for building high-quality applications using <strong>Next.js</strong>, <strong>React</strong>, and <strong>TypeScript</strong>. I obsess over small details—the micro-interactions, the performance optimizations, and the clean architecture that no one sees but everyone feels.
          </p>
          <h3>What I Do</h3>
          <ul>
              <li><strong>Frontend Engineering:</strong> Building responsive, accessible, and performant user interfaces.</li>
              <li><strong>System Design:</strong> Architecting scalable frontend solutions that can grow with the product.</li>
              <li><strong>UI/UX Collaboration:</strong> Bridging the gap between design and engineering to ensure pixel-perfect implementation.</li>
          </ul>
        </div>
      `,
    },
  },
  {
    id: 3,
    slug: "local-time",
    type: "widget",
    layout: { colSpan: 1, rowSpan: 1 },
    style: {
      contentAlignment: "center",
      background: "bg-transparent",
    },
    data: {
      type: "time-location",
      variant: "analog",
      withFace: false,
      timeZone: "Asia/Jakarta",
      // locationName: "Jakarta, ID",
      latLng: [-6.2088, 106.8456],
    },
  },
  {
    id: 4,
    slug: "building-a-design-system",
    type: "sheet",
    layout: { colSpan: 2, rowSpan: 1 },
    style: {
      shadow: "lg",
    },
    data: {
      label: "Blog",
      labelPosition: "top-left",
      title: "Manual Code vs Vibe Coding",
      description: "Is AI replacing the joy of crafting code?",
      sheetTitle: "Manual Code vs Vibe Coding",

      sheetContent: `
        <div>
          <h2>The Craft of Manual Coding</h2>
          <p>
             There is an undeniable intimacy in writing code line by line. It’s a craft, much like woodworking. You choose your tools, you understand the grain of the material, and you build with intention. Every function is a decision; every component structure is a deliberate act of design.
          </p>
          <p>
             When you code manually, you aren't just telling the computer <em>what</em> to do—you are defining <em>how</em> it exists. You build muscle memory for syntax and a deep intuition for logic. When a bug appears, you know where to look because you laid the bricks yourself.
          </p>

          <h2>The Rise of "Vibe Coding"</h2>
          <p>
             But then comes AI, and with it, "Vibe Coding." It shifts the paradigm from <strong>implementation</strong> to <strong>intent</strong>. You describe the outcome—the <em>vibe</em>—and the machine handles the plumbing. It’s like being a film director instead of the camera operator.
          </p>
          <ul>
            <li><strong>Velocity:</strong> Prototyping happens at the speed of thought.</li>
            <li><strong>Creativity:</strong> You can explore five different architectural approaches in the time it used to take to write one boilerplate file.</li>
            <li><strong>Democratization:</strong> The barrier to entry drops; ideas matter more than syntax memorization.</li>
          </ul>
          
          <blockquote>
            "The best code is the code you don't write. But the deepest understanding comes from the code you do."
          </blockquote>

          <h2>Finding Harmony</h2>
          <p>
             I don't see it as a binary choice. I use AI to scaffold, to debug, to handle the mundane. But when it comes to the core business logic, the complex state management, or that one specific animation that needs to feel <em>just right</em>—I take the wheel.
          </p>
          <p>
             <strong>Vibe coding for the velocity, manual coding for the veracity.</strong>
          </p>
        </div>
      `,
      date: "December 12, 2024",
      gallery: [
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
      ],
    },
  },
  {
    id: 5,
    slug: "socials",
    type: "social",
    layout: { colSpan: 1, rowSpan: 1 },
    style: {
      background: "bg-transparent",
      shadow: "none",
    },
    data: {
      variant: "default",
      links: [
        { platform: "github", url: "https://github.com/naufalsyarif" },
        { platform: "linkedin", url: "https://linkedin.com/in/naufalsyarif" },
        { platform: "twitter", url: "https://twitter.com/naufalsyarif" },
        { platform: "instagram", url: "https://instagram.com/naufalsyarif" },
      ],
    },
  },
];

export const contactBentoItems: BentoItem[] = [
  {
    id: 1,
    slug: "chat",
    type: "widget",
    layout: { colSpan: 3, rowSpan: 2 },
    style: {
      background: "bg-white",
      shadow: "xl",
      overflow: "hidden",
    },
    data: {
      type: "chat",
      label: "AI Assistant",
      labelPosition: "top-center",
    },
  },
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  link: string;
  imageUrl: string;
  videoUrl?: string; // Optional video URL for hover preview
  gallery?: string[]; // Optional gallery images
};

export const projectsData: Project[] = [
  {
    title: "Project One",
    description:
      "A modern web application built with Next.js and Tailwind CSS.",
    tags: ["Next.js", "React", "Tailwind"],
    link: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-typing-on-a-macbook-keyboard-4638/1080p.mp4",
    gallery: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583795128727-6ec36d97eb4b?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2066&auto=format&fit=crop",
    ],
  },
  {
    title: "Project Two",
    description: "An e-commerce platform with a custom design system.",
    tags: ["TypeScript", "Node.js", "PostgreSQL"],
    link: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-coding-on-laptop-2-4523/1080p.mp4",
  },
  {
    title: "Project Three",
    description: "A productivity tool for remote teams.",
    tags: ["Vue.js", "Firebase", "Sass"],
    link: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-working-on-a-monitor-2626/1080p.mp4",
  },
  {
    title: "Project Four",
    description: "Real-time analytics dashboard with D3.js.",
    tags: ["D3.js", "WebSocket", "Node.js"],
    link: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-analyzing-graphs-on-screens-5353/1080p.mp4",
  },
  {
    title: "Project Five",
    description: "AI-powered image generator app.",
    tags: ["OpenAI", "React", "Python"],
    link: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-ai-generated-scifi-landscape-5339/1080p.mp4",
  },
  {
    title: "Project Six",
    description: "Mobile fitness tracking application.",
    tags: ["React Native", "Expo", "Supabase"],
    link: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-scrolling-on-mobile-phone-4903/1080p.mp4",
  },
];
