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
  };
};

// Widget Data Types
export type SpotifyWidgetData = {
  type: "spotify";
  variant?: "default" | "large"; // "default" = standard padding, "large" = full bleed/prominent
  isPlaying: boolean;
  songTitle: string;
  artist: string;
  albumArtUrl: string;
  spotifyUrl: string;
};

export type TechStackWidgetData = {
  type: "tech-stack";
  variant?: "default" | "terminal" | "icons" | "bubble" | "bubble-grid"; // New field
  stack: string[];
};

export type TimeLocationWidgetData = {
  type: "time-location";
  variant?: "default" | "analog" | "cycle";
  withFace?: boolean; // Toggle clock face (border/bg)
  timeZone: string;
  locationName?: string;
  latLng: [number, number];
};

export type WidgetCard = {
  id: number;
  slug: string;
  type: "widget";
  layout: LayoutConfig;
  style?: StyleConfig;
  data: SpotifyWidgetData | TechStackWidgetData | TimeLocationWidgetData;
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
      title: "I'm a Software Engineer",
      description: "who likes to build things",
      sheetTitle: "I'm a Software Engineer",
      sheetContent: `
        <div class="prose dark:prose-invert">
          <p>
              Hello! I'm Naufal Syarif, a Software Engineer based in Jakarta, ID. 
              I specialize in building high-quality web applications using modern technologies like Next.js, React, and TypeScript.
          </p>
          <p>
              With a passion for design and user experience, I strive to create interfaces that are not only functional but also beautiful and intuitive.
          </p>
          <h3>Experience</h3>
          <ul>
              <li>Software Engineer at [Company] (2023 - Present)</li>
              <li>Frontend Developer at [Company] (2021 - 2023)</li>
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
      title: "Manual Code vs Vibe Coding",
      description: "Is AI replacing the joy of crafting code?",
      sheetTitle: "Manual Code vs Vibe Coding",
      sheetContent: `
        <div class="prose dark:prose-invert max-w-none">
          <p class="lead text-xl text-zinc-800 font-medium">
            There's a shift happening in how we build software. The debate isn't just about efficiency anymore—it's about the soul of programming.
          </p>
          
          <h2>The Craft of Manual Coding</h2>
          <p>
            For years, writing code was like carpentry. You picked your tools, you measured twice, and you cut once. Every function was a deliberate choice, every variable name a small act of design. There's a deep satisfaction in understanding every layer of your stack, from the database query to the CSS transition.
          </p>
          <p>
            Manual coding forces you to think deeply about structure. It's slow, yes. But it builds muscle memory and intuition. When things break, you know exactly where to look because you placed every brick yourself.
          </p>

          <div class="my-8 rounded-2xl overflow-hidden shadow-sm">
             <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop" alt="Coding Setup" class="w-full h-auto object-cover" />
             <p class="text-sm text-center text-zinc-500 mt-2 italic">The classic manual setup: terminal, code editor, and focus.</p>
          </div>

          <h2>Enter "Vibe Coding"</h2>
          <p>
            Then comes the AI era. "Vibe coding" is less about syntax and more about intent. You describe the outcome, the <em>vibe</em>, and the machine handles the implementation. It's like being a director rather than a cinematographer.
          </p>
          <p>
            It's exhilarating. You can prototype an entire app in an afternoon. But does it feel the same? Is the connection to the craft lost when you're just prompting instead of typing?
          </p>

          <blockquote>
            "The best code is the code you don't write. But the best understanding comes from the code you do."
          </blockquote>

          <h2>Finding the Balance</h2>
          <p>
            Maybe it's not binary. I use AI to scaffold, to debug, to explore. But when it comes to the core logic, the critical path, I still want my hands on the wheel. Vibe coding for the mundane, manual coding for the meaningful.
          </p>
        </div>
      `,
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
