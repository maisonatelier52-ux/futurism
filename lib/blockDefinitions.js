// lib/blockDefinitions.js
import {
  Zap, Star, LayoutGrid, FolderKanban, MessageSquareQuote, Users,
  Megaphone, PlaySquare, Image as ImageIcon, Rows3, Mail, Code2, Columns3,
  Newspaper, StickyNote, Moon, LayoutPanelTop, Sparkles,
} from "lucide-react";

export const CATEGORY_OPTIONS = ["Power", "Wealth", "Real Estate", "Technology", "Markets", "Opinion", "Politics", "Business", "World", "Health", "Justice", "Free Speech"];

export const BLOCK_DEFINITIONS = {
  breakingNews: {
    type: "breakingNews",
    label: "Breaking News Ticker",
    description: "Auto feed of the latest articles",
    icon: Zap,
    defaultData: () => ({
      limit: 5,
      bg: "#111111",
      labelBg: "#cc0000",
      textColor: "#ffffff",
      labelText: "BREAKING",
      speed: 80,
      enabled: true,
      labelStyle: "badge",
    }),
  },
  heroStory: {
    type: "heroStory",
    label: "Hero Story",
    description: "Large featured-article display",
    icon: Star,
    defaultData: () => ({
      articleId: "",
      title: "Global Markets Rally As Inflation Fears Ease",
      subheadline: "Central banks signal coordinated pause on rate hikes",
      category: "BUSINESS",
      ctaLabel: "Read More",
      ctaUrl: "#",
      bgImage: "",
      overlayOpacity: 50,
      fontFamily: "sans",
      titleSize: 28,
      titleWeight: "bold",
      titleColor: "#ffffff",
      alignment: "left",
      paddingTop: 48,
      paddingBottom: 48,
      showCategory: true,
      showCta: true,
    }),
  },
  topStoriesGrid: {
    type: "topStoriesGrid",
    label: "Top Stories Grid",
    description: "Grid of recent top stories",
    icon: LayoutGrid,
    defaultData: () => ({ limit: 4, columns: 4, showImage: true, showCategory: true }),
  },
  categorySection: {
    type: "categorySection",
    label: "Category Section",
    description: "Articles from a chosen category",
    icon: FolderKanban,
    defaultData: () => ({
      category: "Power",
      layout: "grid",
      limit: 6,
      title: "",
      bg: "#ffffff",
      textColor: "#111111",
      showImages: true,
    }),
  },
  featuredStoriesRow: {
    type: "featuredStoriesRow",
    label: "Featured Stories Row",
    description: "Horizontal strip of featured stories",
    icon: Rows3,
    defaultData: () => ({
      limit: 4,
      title: "Featured Stories",
      showImage: true,
      imageHeight: 120,
    }),
  },
  opinion: {
    type: "opinion",
    label: "Opinion Block",
    description: "Featured editorial / opinion content",
    icon: MessageSquareQuote,
    defaultData: () => ({
      articleId: "",
      title: "The case for deliberate slowness in an age of algorithmic haste",
      author: "Sarah Mills",
      bg: "#f8f8f6",
    }),
  },
  authorSpotlight: {
    type: "authorSpotlight",
    label: "Author Spotlight",
    description: "Show top authors",
    icon: Users,
    defaultData: () => ({ limit: 3, title: "Our Writers" }),
  },
  video: {
    type: "video",
    label: "Video Block",
    description: "Featured videos",
    icon: PlaySquare,
    defaultData: () => ({ videoUrl: "", title: "Featured video", caption: "", thumbUrl: "" }),
  },
  fullWidthBanner: {
    type: "fullWidthBanner",
    label: "Full-Width Banner",
    description: "Edge-to-edge image with heading & CTA",
    icon: ImageIcon,
    defaultData: () => ({
      imageUrl: "",
      heading: "Exploring The World's Most Incredible Places",
      subheading: "",
      ctaLabel: "Read Story",
      ctaUrl: "",
      overlayColor: "rgba(0,0,0,0.45)",
      height: 320,
      linkUrl: "",
    }),
  },
  newsletter: {
    type: "newsletter",
    label: "Newsletter Signup",
    description: "Email capture block",
    icon: Mail,
    defaultData: () => ({
      heading: "Stay ahead of the story",
      subheading: "Get the headlines that matter, every morning.",
      placeholder: "Enter your email",
      ctaLabel: "Subscribe",
      ctaBg: "#cc0000",
      ctaTextColor: "#ffffff",
      bg: "#f5f5f0",
      textColor: "#111111",
      enabled: true,
    }),
  },
  advertisement: {
    type: "advertisement",
    label: "Advertisement",
    description: "Ad banner / placeholder",
    icon: Megaphone,
    defaultData: () => ({
      size: "leaderboard",
      imageUrl: "",
      linkUrl: "",
      overlayColor: "",
      height: 90,
      altText: "Advertisement",
    }),
  },
  customHtml: {
    type: "customHtml",
    label: "Custom HTML",
    description: "Add custom content",
    icon: Code2,
    defaultData: () => ({ html: "<!-- Add custom markup -->", enabled: true }),
  },
  threeColumnLayout: {
    type: "threeColumnLayout",
    label: "3-Column Layout",
    description: "Left sticky + center feed + right sidebar",
    icon: Columns3,
    defaultData: () => ({
      leftTitle: "Most Read",
      leftItems: [
        { id: "l1", label: "Global Markets Rally As Inflation Fears Ease" },
        { id: "l2", label: "Power Brokers of the Year: The 50 Who Shape Our World" },
        { id: "l3", label: "Real Estate Outlook 2026: Buy, Sell, or Wait?" },
        { id: "l4", label: "Tech Giants Face New Antitrust Pressure in Brussels" },
        { id: "l5", label: "Opinion: Why Central Banks Are Losing the Plot" },
      ],
      leftShowNumbers: true,
      centerTitle: "Latest News",
      centerCategory: "All",
      centerLimit: 5,
      centerLayout: "list",
      rightTitle: "In Brief",
      rightShowAd: true,
      rightAdSize: "sidebar",
      rightShowNewsletter: true,
      rightNewsletterHeading: "Stay ahead of the story",
      bg: "#ffffff",
      border: "#e5e7eb",
      padding: 24,
      borderRadius: 12,
      widthMode: "equal",
    }),
  },
  newsFeed: {
    type: "newsFeed",
    label: "News Feed",
    description: "Vertical list of articles with images",
    icon: Newspaper,
    defaultData: () => ({
      title: "",
      category: "All",
      limit: 8,
      layout: "list",
      showImages: true,
      showCategory: true,
      showDate: true,
      showExcerpt: true,
      imageSize: "medium",
    }),
  },
  stickyNotice: {
    type: "stickyNotice",
    label: "Sticky Notice",
    description: "Announcements / site-wide notices",
    icon: StickyNote,
    defaultData: () => ({
      text: "Subscribe for full access to all stories.",
      ctaLabel: "Subscribe Now",
      ctaUrl: "#",
      bg: "#1a1a1a",
      textColor: "#ffffff",
      ctaBg: "#cc0000",
      dismissible: true,
      enabled: true,
    }),
  },
  newspaperEditorial: {
    type: "newspaperEditorial",
    label: "Newspaper Editorial Layout",
    description: "3-column newspaper layout: sticky left sidebar + center editorial + right sidebar",
    icon: Columns3,
    defaultData: () => ({
      // Top Stories Grid (4 cards)
      showTopStories: true,
      topStoriesTitle: "FEATURED STORIES",
      topStoriesCount: 4,
      topStoriesImageRatio: "4/3",
      topStoriesSpacing: 16,
      topStoriesCategoryColor: "#cc0000",

      // Left Sidebar blocks
      leftBlocks: [
        { id: "lb1", type: "featuredArticle", label: "Featured Article", visible: true, category: "WHITE HOUSE • LIVE", categoryColor: "#dc2626", headline: "Live updates from The White House: diplomatic tensions mount", description: "Senior officials confirm back-channel talks with three European counterparts are ongoing, amid growing calls for a formal summit before the autumn recess.", author: "James Whitmore", date: "Jan 8, 2026", showImage: true, showDesc: true, showAuthor: true, showDate: true },
        { id: "lb2", type: "smallStoryCard", label: "Economy Card", visible: true, category: "ECONOMY", categoryColor: "#d97706", headline: "It's Never Been More Expensive to Visit New York City", author: "Anna Cole", date: "Jan 8", showImage: true, showDesc: false, showAuthor: true, showDate: true },
        { id: "lb3", type: "smallStoryCard", label: "Health Card", visible: true, category: "HEALTH", categoryColor: "#059669", headline: "How Sarah Coped With Her Chronic Disease — and Found Clarity", author: "Mark Wells", date: "Jan 8", showImage: true, showDesc: false, showAuthor: true, showDate: true },
        { id: "lb4", type: "opinionCard", label: "Opinion Card", visible: true, category: "OPINION", categoryColor: "#6b7280", label2: "EDITOR'S PICK", headline: "The case for deliberate slowness in an age of algorithmic haste", author: "Eleanor Marsh, Senior Columnist", date: "Jan 8", showImage: false, showDesc: false, showAuthor: true, showDate: false },
        { id: "lb5", type: "smallStoryCard", label: "Economy Card 2", visible: true, category: "ECONOMY", categoryColor: "#d97706", headline: "It's Never Been More Expensive to Visit New York City", author: "Maya Chen", date: "Jan 8", showImage: false, showDesc: false, showAuthor: true, showDate: true },
        { id: "lb6", type: "smallStoryCard", label: "Justice Card", visible: true, category: "JUSTICE", categoryColor: "#7c3aed", headline: "The slow reckoning: how courts are reshaping AI liability law", author: "Marcus Reid", date: "Jan 8", showImage: false, showDesc: true, showAuthor: true, showDate: true },
        { id: "lb7", type: "smallStoryCard", label: "Finance Card", visible: true, category: "FINANCE", categoryColor: "#2563eb", headline: "Extra £2.50 for half a prawn? The surcharge economy arrives", author: "Marcus Reid", date: "Jan 8", showImage: false, showDesc: false, showAuthor: true, showDate: true },
      ],

      // Center Column
      heroHeadline: "Live updates from The White House: A new chapter in transatlantic diplomacy",
      heroCategory: "WORLD • POLITICS",
      heroDate: "JANUARY 8, 2026",
      heroSummary: "Senior diplomats from twelve nations convened in an extraordinary session yesterday as mounting trade tensions threatened to derail the framework agreements painstakingly built over the past eighteen months.",
      heroAuthor: "James Whitmore",
      heroAuthorRole: "White House Correspondent",

      // Category sections in center
      centerSections: [
        { id: "cs1", category: "ECONOMY", color: "#d97706", stories: 2, imagePosition: "left", showDesc: true, showDate: true, showAuthor: true },
        { id: "cs2", category: "CULTURE", color: "#7c3aed", stories: 3, imagePosition: "top", showDesc: false, showDate: true, showAuthor: true },
        { id: "cs3", category: "BUSINESS", color: "#2563eb", stories: 4, imagePosition: "top", showDesc: false, showDate: true, showAuthor: false },
      ],

      // Right Sidebar
      rightBlocks: [
        { id: "rb1", type: "futureStory", label: "Future Story", visible: true, title: "Future of Contemporary Art", enabled: true, showImage: true, showDate: true, showExcerpt: true },
        { id: "rb2", type: "topOfMonth", label: "Top of Month", visible: true, title: "Top of Month", enabled: true, showImages: true, showDates: true, itemCount: 3 },
        { id: "rb3", type: "mostCommented", label: "Most Commented", visible: true, title: "Most Commented", enabled: true, itemCount: 5, showDates: true },
        { id: "rb4", type: "topAuthors", label: "Top Authors", visible: true, title: "Top Authors", enabled: true, showImages: true, itemCount: 4 },
        { id: "rb5", type: "advertisement", label: "Advertisement", visible: true, enabled: true, title: "Advertisement" },
        { id: "rb6", type: "newsletter", label: "Newsletter", visible: false, enabled: false, title: "Newsletter" },
      ],

      // Layout
      maxWidth: 1600,
      columnGap: 24,
      bg: "#ffffff",
    }),
  },
  // ─── Template 2: Modern Magazine ───────────────────────────────────────────
  modernMagazineLayout: {
    type: "modernMagazineLayout",
    label: "Modern Magazine Layout",
    description: "Full Template 2 homepage: 75/25 layout, hero, top stories, sidebar, latest news, editor's picks, category grid & more",
    icon: LayoutPanelTop,
    defaultData: () => ({
      // Layout
      maxWidth: 1600,
      columnGap: 24,
      bg: "#ffffff",

      // Section 1: Hero
      heroEnabled: true,
      heroImage: "",
      heroOverlayOpacity: 55,
      heroCategory: "BUSINESS",
      heroHeadline: "Global Markets Rally As Inflation Fears Ease",
      heroDescription: "Central banks signal coordinated pause on rate hikes as economic outlook improves across major economies.",
      heroCtaLabel: "Read More",
      heroCtaUrl: "#",
      heroHeight: 420,
      heroTitleSize: 32,
      heroBg: "#1a1a2e",

      // Section 2: Top Stories
      topStoriesEnabled: true,
      topStoriesTitle: "Top Stories",
      topStoriesCount: 4,

      // Right Sidebar widgets
      sidebarWidgets: [
        { id: "sw1", type: "trending", label: "Trending Stories", enabled: true, title: "Trending Now", itemCount: 5, showImages: true, showTime: true },
        { id: "sw2", type: "popular", label: "Popular Articles", enabled: true, title: "Popular Articles", itemCount: 5, showNumbers: true },
        { id: "sw3", type: "newsletter", label: "Newsletter", enabled: true, title: "Stay updated", description: "Get the latest news and insights." },
        { id: "sw4", type: "advertisement", label: "Advertisement", enabled: true, size: "sidebar" },
        { id: "sw5", type: "categories", label: "Categories", enabled: true, title: "Categories", categories: ["World", "Business", "Technology", "Politics", "Sports"] },
      ],

      // Section 3: Latest News
      latestNewsEnabled: true,
      latestNewsTitle: "Latest News",
      latestNewsLimit: 8,

      // Section 4: Editor's Picks
      editorsPicksEnabled: true,
      editorsPicksTitle: "Editor's Picks",

      // Section 5: Category Grid
      categoryGridEnabled: true,
      categoryGridCategories: [
        { id: "cg1", name: "Business", articleCount: 4 },
        { id: "cg2", name: "Technology", articleCount: 4 },
        { id: "cg3", name: "Politics", articleCount: 4 },
        { id: "cg4", name: "Lifestyle", articleCount: 4 },
      ],

      // Section 6: Advertisement Banner
      adEnabled: true,
      adSize: "970x90",

      // Section 7: Latest Articles Grid
      latestGridEnabled: true,
      latestGridTitle: "Latest Articles",
      latestGridColumns: 3,
      latestGridLimit: 9,

      // Section 8: Newsletter
      newsletterEnabled: true,
      newsletterHeading: "Stay ahead of the story",
      newsletterSubheading: "Get the headlines that matter, every morning.",
      newsletterCtaLabel: "Subscribe",
      newsletterBg: "#f5f5f0",

      // Section 9: Load More
      loadMoreEnabled: true,
      loadMoreLabel: "Load More Articles",
      loadMoreColor: "#cc0000",
      loadMoreRadius: 6,
      loadMoreAction: "loadMore",
      loadMoreUrl: "",
    }),
  },

  // ─── Template 3: Dark News ──────────────────────────────────────────────────
  darkNewsLayout: {
    type: "darkNewsLayout",
    label: "Dark News Layout",
    description: "Full Template 3 homepage: premium dark theme, 75/25 layout, hero, featured stories, most read, editor's choice & more",
    icon: Moon,
    defaultData: () => ({
      // Theme / Layout
      maxWidth: 1600,
      columnGap: 24,
      bg: "#111111",
      cardBg: "#1a1a1a",
      accentColor: "#cc0000",
      textColor: "#ffffff",

      // Section 1: Hero
      heroEnabled: true,
      heroImage: "",
      heroOverlayOpacity: 65,
      heroCategory: "TECHNOLOGY",
      heroHeadline: "The Future of AI: How Technology is Shaping Our World",
      heroDescription: "Artificial intelligence is transforming industries and redefining the future of humanity.",
      heroCtaLabel: "Read More",
      heroCtaUrl: "#",
      heroHeight: 460,
      heroTitleSize: 34,

      // Right Sidebar (after hero)
      sidebarWidgets: [
        { id: "dw1", type: "trending", label: "Trending Stories", enabled: true, title: "Trending Now", itemCount: 5, showImages: true, showTime: true },
        { id: "dw2", type: "newsletter", label: "Newsletter", enabled: true, title: "Stay informed", description: "Stay updated with the latest breaking news." },
        { id: "dw3", type: "advertisement", label: "Advertisement", enabled: true, size: "sidebar" },
      ],

      // Section 2: Featured Stories
      featuredStoriesEnabled: true,
      featuredStoriesTitle: "Featured Stories",
      featuredStoriesCount: 4,

      // Section 3: Latest News
      latestNewsEnabled: true,
      latestNewsTitle: "Latest News",
      latestNewsLimit: 6,

      // Section 4: Most Read
      mostReadEnabled: true,
      mostReadTitle: "Most Read",
      mostReadCount: 5,

      // Section 5: Editor's Choice
      editorsChoiceEnabled: true,
      editorsChoiceTitle: "Editor's Choice",
      editorsChoiceCount: 4,

      // Section 6: Category Blocks
      categoryBlocksEnabled: true,
      categoryBlocks: [
        { id: "db1", name: "World", articleCount: 2 },
        { id: "db2", name: "Business", articleCount: 2 },
        { id: "db3", name: "Technology", articleCount: 2 },
      ],

      // Lower right sidebar (used in category blocks row)
      lowerSidebarWidgets: [
        { id: "lw1", type: "newsletter", label: "Newsletter", enabled: true, title: "Newsletter", description: "Stay updated with the latest breaking news." },
        { id: "lw2", type: "advertisement", label: "Advertisement", enabled: true, size: "sidebar" },
      ],

      // Section 7: Advertisement
      adEnabled: true,
      adSize: "728x90",

      // Section 8: Latest Articles
      latestGridEnabled: true,
      latestGridTitle: "Latest Articles",
      latestGridColumns: 3,
      latestGridLimit: 6,

      // Section 9: Newsletter
      newsletterEnabled: true,
      newsletterHeading: "Stay ahead of the story",
      newsletterSubheading: "Subscribe for the headlines that matter.",
      newsletterCtaLabel: "Subscribe",

      // Section 10: Load More
      loadMoreEnabled: true,
      loadMoreLabel: "Load More Articles",
      loadMoreColor: "#cc0000",
      loadMoreRadius: 6,
      loadMoreAction: "loadMore",
      loadMoreUrl: "",
    }),
  },

  // ─── Template 7: Masonry Editorial Layout ──────────────────────────────────
  masonryEditorialLayout: {
    type: "masonryEditorialLayout",
    label: "Masonry Editorial Layout",
    description: "Full Template 7 homepage: hero masonry, editor's picks, latest+sidebar, category grid, trending, authors & more",
    icon: LayoutGrid,
    defaultData: () => ({
      // Layout
      maxWidth: 1600,
      columnGap: 24,
      padding: 24,
      bg: "#ffffff",

      // Section 1: Hero Masonry
      heroSource: "manual",
      heroCategory: "WORLD",
      heroHeadline: "Global economy outlook for the rest of 2026",
      heroDescription: "Experts predict steady growth despite inflation and geopolitical risks.",
      heroAuthor: "Anna Cole",
      heroDate: "2h ago",
      heroImage: "",
      heroImageHeight: 420,
      heroOverlayOpacity: 45,
      heroCtaLabel: "Read More",
      heroCtaUrl: "#",
      heroSmallStories: 2,

      // Section 2: Editor's Picks
      editorsPicksEnabled: true,
      editorsPicksTitle: "Editor's Picks",
      editorsPicksCount: 4,

      // Section 3: Latest News + Sidebar
      latestNewsEnabled: true,
      latestNewsTitle: "Latest News",
      latestNewsLimit: 6,
      sidebarWidgets: [
        { id: "mw1", type: "popular", label: "Popular Articles", enabled: true, title: "Popular Articles", itemCount: 5, showNumbers: false },
        { id: "mw2", type: "newsletter", label: "Newsletter", enabled: true, title: "Newsletter", description: "Stay updated with the latest news and insights." },
        { id: "mw3", type: "categories", label: "Categories", enabled: true, title: "Categories", categories: ["World", "Business", "Technology", "Politics", "Sports", "Lifestyle"] },
        { id: "mw4", type: "advertisement", label: "Advertisement", enabled: true, size: "sidebar" },
      ],

      // Section 4: More News Masonry Grid
      moreNewsEnabled: true,
      moreNewsTitle: "More News",
      moreNewsCount: 6,

      // Section 5: Category Grid
      categoryGridEnabled: true,
      categoryGridColumns: 4,
      categoryGridImageRatio: "4/3",
      categoryGridArticleCount: 4,
      categoryGridCategories: [
        { id: "mc1", name: "Business", articleCount: 4 },
        { id: "mc2", name: "Technology", articleCount: 4 },
        { id: "mc3", name: "Politics", articleCount: 4 },
        { id: "mc4", name: "World", articleCount: 4 },
        { id: "mc5", name: "Sports", articleCount: 4 },
        { id: "mc6", name: "Lifestyle", articleCount: 4 },
      ],

      // Section 6: Trending Stories
      trendingEnabled: true,
      trendingTitle: "Trending Stories",
      trendingCount: 6,

      // Section 7: Newsletter
      newsletterEnabled: true,
      newsletterHeading: "Stay updated with the latest news and insights.",
      newsletterSubheading: "We respect your privacy.",
      newsletterCtaLabel: "Subscribe",
      newsletterBg: "#f5f5f0",
      newsletterRadius: 12,

      // Section 8: Featured Authors
      authorsEnabled: true,
      authorsTitle: "Featured Authors",
      authorsCount: 4,

      // Section 9: Advertisement
      adEnabled: true,
      adSize: "970x250",

      // Section 10: Latest Articles Grid
      latestGridEnabled: true,
      latestGridTitle: "Latest Articles",
      latestGridLimit: 8,

      // Load More
      loadMoreEnabled: true,
      loadMoreLabel: "Load More Articles",
      loadMoreColor: "#cc0000",
      loadMoreRadius: 6,
      loadMoreAction: "loadMore",
      loadMoreUrl: "",
    }),
  },

  // ─── Template 8: Futurism Classic (your live homepage) ──────────────────────
  futurismClassicLayout: {
    type: "futurismClassicLayout",
    label: "Futurism Classic Layout",
    description: "Your exact homepage: hero + secondary featured articles, latest stories sidebar, top stories grid, category sections, the feed, newsletter & originals",
    icon: Sparkles,
    defaultData: () => ({
      // Layout
      maxWidth: 1280,
      bg: "#f9fafb", // gray-50

      // Section 1: Featured Articles (hero + 2 secondary) + Latest Stories sidebar
      heroCategory: "MENTAL HEALTH",
      heroTitle: "Google's AI Overviews Feature Is Telling Users That SCP Horror Fiction Entities Are Real",
      heroExcerpt: "Google's AI Overviews are having severe trouble distinguishing between fact and fiction.",
      heroAuthor: "Maggie Harrison Dupré",
      heroImage: "/images/img1.webp",
      heroUrl: "#",

      secondaryArticles: [
        { id: "sa1", category: "ROBOTICS", title: "DoorDash Delivery Robot Invades SWAT Scene, Won't Leave as Cops Flashbang Resident", author: "Frank Landymore", image: "/images/img2.webp", href: "#" },
        { id: "sa2", category: "CLIMATE CHANGE", title: "Mass Deaths Attributed to Brutal Heat Wave", author: "Frank Landymore", image: "/images/img3.webp", href: "#" },
      ],

      latestStoriesTitle: "Our Latest Stories",
      latestStories: [
        { id: "ls1", category: "FUTURE SOCIETY", title: "Trump's Truth Social Stock Just Hit Its Lowest Point Ever", author: "Victor Tangermann" },
        { id: "ls2", category: "SPACEX", title: "SpaceX Stock Has Fallen So Far That Elon Musk Is No Longer a Trillionaire", author: "Victor Tangermann" },
        { id: "ls3", category: "ENVIRONMENT", title: "Trump's Reflecting Pool Is No Match for the AlgaeBTQ Agenda", author: "Victor Tangermann" },
        { id: "ls4", category: "RENEWABLE ENERGY", title: "Scientists Say New Method Turns Coffee Grounds Into High-Potency Renewable Fuel", author: "Joe Wilkins" },
        { id: "ls5", category: "SPACEX", title: "SpaceX Launches Secretive New Spacecraft Shaped Like Flying Saucer", author: "Victor Tangermann" },
      ],

      // Section 2: Top Stories grid
      topStoriesEnabled: true,
      topStoriesTitle: "Top Stories",
      topStories: [
        { id: "ts1", category: "ROBOTICS", title: "Failing Robot Cop Company Knightscope Now Publishing Bizarre AI Slop Fan Fiction About Its Robots Solving Absurd Crimes", author: "Joe Wilkins", image: "/images/img4.webp", href: "#" },
        { id: "ts2", category: "PRIVACY", title: "Amazon Investigating Its Own Employees for Daring to Oppose AI Data Center", author: "Joe Wilkins", image: "/images/img5.webp", href: "#" },
        { id: "ts3", category: "META", title: "Meta's Program That Spies on Every Employee's Computer Just Blew Up in Its Face In Spectacular Fashion", author: "Frank Landymore", image: "/images/img6.webp", href: "#" },
        { id: "ts4", category: "TREATMENTS", title: "White House Pushes Back Against Claim That Trump Was Given Early Access to a Powerful Experimental Weight Loss Drug", author: "Victor Tangermann", image: "/images/img7.webp", href: "#" },
      ],

      // Section 3: Category Sections (repeatable)
      categorySectionsEnabled: true,
      categorySections: [
        {
          id: "cs1", title: "AI Psychosis",
          articles: [
            { id: "cs1a1", category: "ARTIFICIAL INTELLIGENCE", title: "New Paper Proposes What Really Causes AI Psychosis", author: "Maggie Harrison Dupré", image: "/images/img1.webp", href: "#" },
            { id: "cs1a2", category: "OPENAI", title: "Was This the Moment That AI Psychosis Began?", author: "Maggie Harrison Dupré", image: "/images/img2.webp", href: "#" },
            { id: "cs1a3", category: "XAI", title: "Certain Chatbots Vastly Worse For AI Psychosis, Study Finds", author: "Maggie Harrison Dupré", image: "/images/img3.webp", href: "#" },
          ],
        },
        {
          id: "cs2", title: "Musk Watch",
          articles: [
            { id: "cs2a1", category: "ELON MUSK", title: "Elon Musk Says SpaceX Is Like Union Pacific, Which Is Extremely Funny If You Know What Actually Happened to Union Pacific", author: "Joe Wilkins", image: "/images/img4.webp", href: "#" },
            { id: "cs2a2", category: "ELON MUSK", title: "Musk Furious After SpaceX Stock Get Worst Possible Environmental Grade", author: "Victor Tangermann", image: "/images/img5.webp", href: "#" },
            { id: "cs2a3", category: "ELON MUSK", title: "Elon Musk's Conflicts of Interest With the Trump Administration Regulating SpaceX Are So Profound That They Have Grim Implications for Society", author: "Victor Tangermann", image: "/images/img6.webp", href: "#" },
          ],
        },
      ],

      // Section 4: The Feed + right sidebar (newsletter + originals)
      feedTitle: "The Feed",
      feedShowMoreLabel: "More Stories",
      feedArticles: [
        { id: "fa1", category: "ETHICS", title: "Softbank CEO Who's Invested $64 Billion in OpenAI Says It's Blasphemy to Mention the AI Bubble", author: "Victor Tangermann", image: "/images/img1.webp", href: "#" },
        { id: "fa2", category: "ETHICS", title: "Customers Are Ditching Companies That Force Them to Talk to an AI Agent", author: "Victor Tangermann", image: "/images/img2.webp", href: "#" },
        { id: "fa3", category: "FINANCE", title: "Americans Increasingly Alarmed About Tech Industry's Looming AI Bubble", author: "Joe Wilkins", image: "/images/img3.webp", href: "#" },
        { id: "fa4", category: "CLIMATE CHANGE", title: "Government Scientists Fired by Trump Launch New Website for Sharing Climate Data", author: "Frank Landymore", image: "/images/img4.webp", href: "#" },
        { id: "fa5", category: "ARTIFICIAL INTELLIGENCE", title: "New Study Finds AI Models Are Getting Worse at Basic Reasoning Tasks Over Time", author: "Maggie Harrison Dupré", image: "/images/img5.webp", href: "#" },
        { id: "fa6", category: "SPACEX", title: "SpaceX's Latest Starship Test Ends in Another Spectacular Explosion Over the Gulf", author: "Victor Tangermann", image: "/images/img6.webp", href: "#" },
        { id: "fa7", category: "HEALTH", title: "Scientists Discover Gut Bacteria That May Protect Against Alzheimer's Disease", author: "Joe Wilkins", image: "/images/img7.webp", href: "#" },
        { id: "fa8", category: "ROBOTICS", title: "Boston Dynamics Robot Dog Now Being Used to Patrol National Parks", author: "Frank Landymore", image: "/images/img2.webp", href: "#" },
        { id: "fa9", category: "OPENAI", title: "OpenAI Quietly Removes Safety Commitments From Its Website Ahead of New Model Launch", author: "Maggie Harrison Dupré", image: "/images/img6.webp", href: "#" },
        { id: "fa10", category: "ENVIRONMENT", title: "Arctic Sea Ice Just Hit Its Lowest Recorded Level for This Time of Year", author: "Victor Tangermann", image: "/images/img7.webp", href: "#" },
      ],

      // Feed Newsletter (dark box, right column)
      feedNewsletterEnabled: true,
      feedNewsletterHeading: "Sign up to see the future, today",
      feedNewsletterSubheading: "Can't-miss innovations from the bleeding edge of science and tech",
      feedNewsletterPlaceholder: "Enter your email",
      feedNewsletterCtaLabel: "Sign Up",
      feedNewsletterBg: "#1f2326",

      // Futurism Originals (sticky box, right column)
      originalsEnabled: true,
      originalsTitle: "Futurism Originals",
      originalsFeaturedImage: "/images/img8.webp",
      originalsArticles: [
        { id: "or1", category: "ETHICS", title: "ChatGPT Is Blowing Up Marriages as Spouses Use AI to Attack Their Partners", author: "Maggie Harrison Dupré", href: "#" },
        { id: "or2", category: "ARTIFICIAL INTELLIGENCE", title: "Support Group Launches for People Suffering \"AI Psychosis\"", author: "Maggie Harrison Dupré", href: "#" },
        { id: "or3", category: "ARTIFICIAL INTELLIGENCE", title: "People Are Being Involuntarily Committed, Jailed After Spiraling Into \"ChatGPT Psychosis\"", author: "Maggie Harrison Dupré", href: "#" },
        { id: "or4", category: "OPENAI", title: "People Are Becoming Obsessed with ChatGPT and Spiraling Into Severe Delusions", author: "Maggie Harrison Dupré", href: "#" },
      ],
      originalsSeeMoreLabel: "See More",
    }),
  },
};

export const BLOCK_LIBRARY_ORDER = [
  "breakingNews",
  "heroStory",
  "threeColumnLayout",
  "newsFeed",
  "topStoriesGrid",
  "categorySection",
  "featuredStoriesRow",
  "opinion",
  "authorSpotlight",
  "video",
  "fullWidthBanner",
  "newsletter",
  "advertisement",
  "stickyNotice",
  "customHtml",
  "newspaperEditorial",
  "modernMagazineLayout",
  "darkNewsLayout",
  "masonryEditorialLayout",
  "futurismClassicLayout",
];

export function createBlock(type) {
  const def = BLOCK_DEFINITIONS[type];
  if (!def) throw new Error(`Unknown block type: ${type}`);
  return {
    id: `${type}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`,
    type,
    data: def.defaultData(),
  };
}

// ─── Template 5: Newspaper Editorial block types ─────────────────────────────

