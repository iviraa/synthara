import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      maxWidth: {
        "8xl": "1408px",
        page: "1200px",
      },
      fontFamily: {
        sans: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        caption: ["10px", { lineHeight: "1.5" }],
        "body-sm": ["14px", { lineHeight: "1.5" }],
        body: ["16px", { lineHeight: "1.5" }],
        subheading: ["18px", { lineHeight: "1.33" }],
        "heading-sm": ["22px", { lineHeight: "1.25", letterSpacing: "-0.44px" }],
        heading: ["50px", { lineHeight: "1.18", letterSpacing: "-2px" }],
        "heading-lg": ["54px", { lineHeight: "1.17", letterSpacing: "-2.16px" }],
        display: ["72px", { lineHeight: "1.11", letterSpacing: "-2.88px" }],
      },
      colors: {
        // Dia palette
        "ink-black": "#000000",
        snow: "#ffffff",
        canvas: "#f8f8f8",
        fog: "#efefef",
        pebble: "#d9d9d9",
        graphite: "#636363",
        slate: "#959595",
        steel: "#aeaeae",
        ash: "#7c7c7c",
        "rose-quartz": "#c679c4",
        marigold: "#ffb005",
        "signal-blue": "#0358f7",
        "hot-pink": "#fd02f5",
        "spectrum-red": "#fa3d1d",

        // shadcn compat (kept so existing app surfaces still build)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        image: "10px",
        nav: "16px",
        card: "30px",
        button: "30px",
        container: "40px",
      },
      backgroundImage: {
        spectrum:
          "linear-gradient(90deg, rgb(198,121,196) 0%, rgb(250,61,29) 25%, rgb(255,176,5) 50%, rgb(225,225,254) 75%, rgb(3,88,247) 100%)",
      },
      boxShadow: {
        soft: "rgba(0, 0, 0, 0.08) 0px 0px 8px 0px",
      },
      backdropBlur: {
        frost: "24px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0px" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0px" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-up": "accordion-up 0.2s ease-out",
        "accordion-down": "accordion-down 0.2s ease-out",
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,0.61,0.36,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
