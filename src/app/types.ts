import { LucideIcon } from "lucide-react";
import {
  Globe,
  ShieldCheck,
  Layers,
  Sparkles,
  Star,
  CheckCircle,
  Wrench,
  Rocket,
  Calendar,
  Heart,
  Award,
  Leaf,
  FlaskConical,
  Gem,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Globe,
  ShieldCheck,
  Layers,
  Sparkles,
  Star,
  CheckCircle,
  Wrench,
  Rocket,
  Calendar,
  Heart,
  Award,
  Leaf,
  FlaskConical,
  Gem,
};

export type Feature = {
  title: string;
  desc: string;
  icon: keyof typeof iconMap;
};

export type Product = {
  id: string;
  slug: string | null;
  images: string[];
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  brand: string | null;
  best_selling: boolean;
  likes: number | null;
  disabled: boolean | null;
};

export const BRAND_UI: Record<
  string,
  {
    primary: string;
    gradient: string;
    glow: string;
    badge: string;
    logo?: string;
  }
> = {
  "Covix Care": {
    primary: "#F97316", 
    gradient: "from-orange-500 to-amber-400",
    glow: "shadow-orange-500/30",
    badge: "bg-orange-500",
    logo: "/images/covix.png",
  },
  "Sensa": {
    primary: "var(--main)",
    gradient: "from-[#0E4D38] to-[#D0DAD6]",
    glow: "shadow-[#0E4D38]/30",
    badge: "bg-[#0E4D38]",
    logo: "/images/Sensa.png",
  },
  "Le Visage Plus": {
    primary: "var(--main)",
    gradient: "from-[#0E4D38] to-[#D0DAD6]",
    glow: "shadow-[#0E4D38]/30",
    badge: "bg-[#0E4D38]",
    logo: "/images/Sensa.png",
  },
};
