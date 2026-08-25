import alpineHaulerBack from '@assets/generated_images/ridgeline/alpine-hauler-back.jpg';
import alpineHaulerFront from '@assets/generated_images/ridgeline/alpine-hauler-front.jpg';
import apex104Front from '@assets/generated_images/ridgeline/apex-104-front.jpg';
import apex104Profile from '@assets/generated_images/ridgeline/apex-104-profile.jpg';
import beaconProX from '@assets/generated_images/ridgeline/beacon-pro-x-v2.jpg';
import carbonProbe280 from '@assets/generated_images/ridgeline/carbon-probe-280.jpg';
import carbonTourPoles from '@assets/generated_images/ridgeline/carbon-tour-poles.jpg';
import drifterSplitBase from '@assets/generated_images/ridgeline/drifter-split-base.jpg';
import drifterSplitTop from '@assets/generated_images/ridgeline/drifter-split-top.jpg';
import journalApexTesting from '@assets/generated_images/ridgeline/journal-apex-104-testing.jpg';
import journalLayering from '@assets/generated_images/ridgeline/journal-layering-systems.jpg';
import journalRogersPass from '@assets/generated_images/ridgeline/journal-rogers-pass.jpg';
import stormshieldBack from '@assets/generated_images/ridgeline/stormshield-back.jpg';
import stormshieldFront from '@assets/generated_images/ridgeline/stormshield-front.jpg';

export type ProductCategory = 'skis' | 'splitboards' | 'safety' | 'packs' | 'apparel' | 'helmets' | 'poles';

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  inStock: boolean;
  stockCount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  variants: ProductVariant[];
  technicalSpecs: Record<string, string>;
  isNew?: boolean;
  isBestseller?: boolean;
}

export interface JournalEntry {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: 'guide' | 'story' | 'review';
  image: string;
  readTime: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "p-skis-01",
    name: "Apex 104 Carbon Tour",
    description: "Our flagship backcountry ski, completely redesigned for this season. The Apex 104 strikes the elusive balance between uphill efficiency and downhill power. Utilizing a carbon-flax weave and a Paulownia core, it dampens chatter in variable conditions while remaining light enough for 5,000ft days.",
    price: 849.00,
    category: "skis",
    images: [apex104Front, apex104Profile],
    isBestseller: true,
    variants: [
      { id: "v1", size: "172", inStock: true, stockCount: 5 },
      { id: "v2", size: "178", inStock: true, stockCount: 12 },
      { id: "v3", size: "184", inStock: true, stockCount: 3 },
      { id: "v4", size: "190", inStock: false, stockCount: 0 },
    ],
    technicalSpecs: {
      "Weight (per ski)": "1450g @ 178cm",
      "Dimensions": "136 - 104 - 122",
      "Turn Radius": "19m",
      "Core": "Paulownia / Ash",
      "Laminates": "Carbon-Flax Triaxial Weave"
    }
  },
  {
    id: "p-split-01",
    name: "Drifter Split 158",
    description: "A directional freeride splitboard built for deep days and steep lines. The Drifter features our early rise nose and tapered tail to naturally float in powder, while the camber underfoot ensures solid edge hold on icy skin tracks.",
    price: 899.00,
    category: "splitboards",
    images: [drifterSplitTop, drifterSplitBase],
    isNew: true,
    variants: [
      { id: "v1", size: "154", inStock: true, stockCount: 2 },
      { id: "v2", size: "158", inStock: true, stockCount: 8 },
      { id: "v3", size: "162", inStock: true, stockCount: 6 },
      { id: "v4", size: "162W", inStock: false, stockCount: 0 },
    ],
    technicalSpecs: {
      "Weight": "3100g @ 158cm",
      "Profile": "Directional Camber with Early Rise",
      "Flex": "7/10 (Stiff)",
      "Core": "Poplar / Bamboo / Paulownia",
      "Hardware": "Karakoram UltraClips"
    }
  },
  {
    id: "p-safety-01",
    name: "Beacon Pro X",
    description: "The most intuitive and fastest avalanche transceiver we've ever carried. With a 70m circular search strip, interference management, and an easy-to-read display, the Pro X is built for moments when seconds matter.",
    price: 399.00,
    category: "safety",
    images: [beaconProX],
    variants: [
      { id: "v1", size: "One Size", inStock: true, stockCount: 24 },
    ],
    technicalSpecs: {
      "Antennas": "3",
      "Search Range": "70m",
      "Battery Life": "400h (send) / 1h (search)",
      "Weight": "210g (inc. batteries)"
    }
  },
  {
    id: "p-pack-01",
    name: "Alpine Hauler 40L",
    description: "A stripped-down, highly weather-resistant pack designed for multi-day hut trips and technical ski mountaineering. Features dedicated avy tool pocket, back-panel access, and a diagonal or A-frame ski carry.",
    price: 249.00,
    category: "packs",
    images: [alpineHaulerFront, alpineHaulerBack],
    isBestseller: true,
    variants: [
      { id: "v1", size: "S/M", color: "Slate", inStock: true, stockCount: 15 },
      { id: "v2", size: "M/L", color: "Slate", inStock: true, stockCount: 20 },
      { id: "v3", size: "M/L", color: "Rescue Orange", inStock: false, stockCount: 0 },
    ],
    technicalSpecs: {
      "Volume": "40 Liters",
      "Weight": "1150g",
      "Material": "400D Ripstop Nylon with TPU coating",
      "Access": "Top roll-top and full back panel"
    }
  },
  {
    id: "p-apparel-01",
    name: "Stormshield Pro Jacket",
    description: "A 3-layer hardshell designed specifically for the skin track. Highly breathable electrospun membrane meets rugged face fabric. Features chest pockets that are accessible while wearing a pack and harness.",
    price: 499.00,
    category: "apparel",
    images: [stormshieldFront, stormshieldBack],
    isNew: true,
    variants: [
      { id: "v1", size: "S", color: "Alpine Blue", inStock: true, stockCount: 4 },
      { id: "v2", size: "M", color: "Alpine Blue", inStock: true, stockCount: 12 },
      { id: "v3", size: "L", color: "Alpine Blue", inStock: true, stockCount: 9 },
      { id: "v4", size: "XL", color: "Alpine Blue", inStock: true, stockCount: 2 },
    ],
    technicalSpecs: {
      "Waterproofing": "20,000mm",
      "Breathability": "30,000g/m2/24h",
      "Weight": "450g",
      "Fit": "Articulated Freeride"
    }
  },
  {
    id: "p-poles-01",
    name: "Carbon Tour Poles",
    description: "Lightweight, dependable, and simple. These two-piece adjustable poles feature a carbon lower shaft and aluminum upper for the perfect blend of swing weight and durability. The extended EVA grip is ideal for sidehilling.",
    price: 149.00,
    category: "poles",
    images: [carbonTourPoles],
    variants: [
      { id: "v1", size: "105-145cm", inStock: true, stockCount: 30 },
    ],
    technicalSpecs: {
      "Weight (pair)": "480g",
      "Material": "7075 Aluminum upper / Carbon Fiber lower",
      "Lock Mechanism": "Forged Aluminum Flick-lock",
      "Basket": "100mm Powder Basket"
    }
  },
  {
    id: "p-safety-02",
    name: "Carbon Probe 280",
    description: "Fast deployment and rigid probing. The 280cm length is ideal for deeper snowpacks, while the carbon construction keeps weight minimal in your pack.",
    price: 89.00,
    category: "safety",
    images: [carbonProbe280],
    variants: [
      { id: "v1", size: "280cm", inStock: true, stockCount: 18 },
    ],
    technicalSpecs: {
      "Length": "280cm",
      "Weight": "245g",
      "Material": "Carbon Fiber",
      "Segments": "7"
    }
  }
];

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "j-01",
    title: "Understanding Layering Systems for High Output Days",
    excerpt: "Stop sweating on the up. A deep dive into modern active insulation and why your old hardshell might be holding you back.",
    content: "When you're skinning up a 3,000-foot pitch, your body produces massive amounts of heat. The traditional wisdom of wearing a hardshell from car to summit is outdated. Enter the modern active layering system...\n\nThe foundation is a synthetic baselayer that moves moisture fast. Next, a highly breathable midlayer like Polartec Alpha or similar active insulation. The goal is to move moisture through the system before it condenses. \n\nOnly when the wind howls or the snow falls heavily should the hardshell come out of the pack. Pack a 'belay jacket' (a puffy down or synthetic piece) to throw on over everything the moment you transition or stop for lunch.",
    date: "2023-11-12",
    author: "Sarah K.",
    category: "guide",
    image: journalLayering,
    readTime: 6
  },
  {
    id: "j-02",
    title: "A Week in the Rogers Pass",
    excerpt: "Deep snow, steep couloirs, and the unrelenting weather of British Columbia's interior.",
    content: "Rogers Pass is a proving ground. Situated in the Selkirk Mountains of British Columbia, it's known for massive snowfall and complex avalanche terrain. We spent seven days pushing into its deeper corners.\n\nOur base was a small cabin. Every morning started at 5 AM with strong coffee, studying the avalanche bulletin, and planning our aspect based on wind loading from the previous night. \n\nThe highlight was skiing the north face of Mt. Tupper in perfect stability. Dropping in, the snow was that rare combination of deep yet supportive, blowing over our shoulders with every turn.",
    date: "2023-12-04",
    author: "Marcus T.",
    category: "story",
    image: journalRogersPass,
    readTime: 8
  },
  {
    id: "j-03",
    title: "Review: The New Apex 104",
    excerpt: "We put our flagship ski through the wringer over 40 days in the Tetons. Here's how it held up.",
    content: "Designing a ski that tours well but doesn't feel like wet cardboard on the descent is the holy grail. The Apex 104 is our answer, and after 40 days of testing, it's clear we hit the mark.\n\nThe carbon-flax weave is the secret sauce. Carbon alone can be pingy and harsh in variable snow. By weaving it with flax, we get the dampening properties of a heavier metal laminate ski without the weight penalty.\n\nOn the skin track, it feels nimble. In powder, the early rise nose floats effortlessly. But where it truly shines is in mixed conditions—crud, wind-board, and corn—where it tracks predictably and powerfully.",
    date: "2024-01-15",
    author: "Tech Team",
    category: "review",
    image: journalApexTesting,
    readTime: 5
  }
];
