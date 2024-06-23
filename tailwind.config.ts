import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        "verde": "#c0ffea",
        "verdeFuerte": "#559F68",
        "headerNav": "#467351",
        "verdeDetails": "#75D18B",
        success: "#2C332E",
        warning:"#559F68",
        "delete": "#DF3131",
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
