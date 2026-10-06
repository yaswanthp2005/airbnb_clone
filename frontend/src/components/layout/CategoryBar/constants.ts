import {
  BedDouble,
  Building2,
  Castle,
  Flame,
  House,
  Landmark,
  Mountain,
  MountainSnow,
  Sailboat,
  Ship,
  Snowflake,
  Sun,
  Tent,
  Tractor,
  TreeDeciduous,
  TreePalm,
  Trees,
  Umbrella,
  WavesLadder,
  Wheat,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  key: string;
  labelKey: string;
  icon: LucideIcon;
};

export const CATEGORIES: Category[] = [
  { key: "trending", labelKey: "categories.trending", icon: Flame },
  { key: "beachfront", labelKey: "categories.beachfront", icon: Umbrella },
  { key: "cabins", labelKey: "categories.cabins", icon: House },
  { key: "amazing-views", labelKey: "categories.amazingViews", icon: Mountain },
  { key: "villas", labelKey: "categories.villas", icon: Castle },
  { key: "treehouses", labelKey: "categories.treehouses", icon: TreeDeciduous },
  { key: "farms", labelKey: "categories.farms", icon: Tractor },
  { key: "rooms", labelKey: "categories.rooms", icon: BedDouble },
  { key: "camping", labelKey: "categories.camping", icon: Tent },
  { key: "lake", labelKey: "categories.lake", icon: Sailboat },
  { key: "amazing-pools", labelKey: "categories.amazingPools", icon: WavesLadder },
  { key: "houseboats", labelKey: "categories.houseboats", icon: Ship },
  { key: "heritage", labelKey: "categories.heritage", icon: Landmark },
  { key: "mansions", labelKey: "categories.mansions", icon: Building2 },
  { key: "countryside", labelKey: "categories.countryside", icon: Wheat },
  { key: "tropical", labelKey: "categories.tropical", icon: TreePalm },
  { key: "skiing", labelKey: "categories.skiing", icon: MountainSnow },
  { key: "islands", labelKey: "categories.islands", icon: Trees },
  { key: "desert", labelKey: "categories.desert", icon: Sun },
  { key: "arctic", labelKey: "categories.arctic", icon: Snowflake },
];

export const DEFAULT_CATEGORY_KEY = CATEGORIES[0].key;
