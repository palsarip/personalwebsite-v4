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
      title: "Building a Design System",
      description: "Lessons learned from scaling UI components.",
      sheetTitle: "Building a Design System",
      sheetContent: `
        <div class="prose dark:prose-invert">
          <p>Full article about design systems...</p>
          <p>Key takeaways include...</p>
        </div>
      `,
    },
  },
  {
    id: 5,
    slug: "personal-space",
    type: "sheet",
    layout: { colSpan: 1, rowSpan: 2 },
    style: {
      contentAlignment: "center",
      textColor: "text-white",
      shadow: "lg",
    },
    data: {
      title: "",
      description: "",
      sheetTitle: "Personal Space",
      sheetContent: `
        <div class="prose dark:prose-invert">
          <p>
              This is my personal space where I share my thoughts, experiences, and insights. 
          </p>
        </div>
      `,
      cover: {
        url: "/assets/content/photos/jakarta.jpg",
        type: "image",
      },
    },
  },

  {
    id: 6,
    slug: "tech-stack",
    type: "widget",
    layout: { colSpan: 1, rowSpan: 1 },
    style: {
      background: "bg-transparent",
      textColor: "text-zinc-900",
      shadow: "none",
    },
    data: {
      type: "tech-stack",
      variant: "bubble-grid",
      stack: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind",
        "Node.js",
        "Express.js",
        "Nest.js",
        "MySQL",
        "PostgreSQL",
        "Python",
        "Splunk",
        "Figma",
        "Git",
      ],
    },
  },
  {
    id: 7,
    slug: "socials",
    type: "social",
    layout: { colSpan: 1, rowSpan: 1 },
    style: {
      background: "bg-transparent",
      textColor: "text-white",
    },
    data: {
      links: [
        { platform: "github", url: "https://github.com/naufalsyarif" },
        { platform: "linkedin", url: "https://linkedin.com/in/naufalsyarif" },
        { platform: "twitter", url: "https://twitter.com/naufalsyarif" },
        { platform: "instagram", url: "https://instagram.com/naufalsyarif" },
      ],
    },
  },
  {
    id: 8,
    slug: "video-demo",
    type: "sheet",
    layout: { colSpan: 2, rowSpan: 1 },
    style: {
      contentAlignment: "center",
    },
    data: {
      cover: {
        url: "/assets/content/videos/rdr2.mp4",
        type: "video",
        expandedPosition: "header",
      },
    },
  },
];
