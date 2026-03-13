/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--color-primary)",
                "primary-foreground": "var(--primary-foreground)",
                accent: "var(--color-accent)",
                electric: "var(--color-electric)",
                muted: "var(--muted)",
                "muted-foreground": "var(--muted-foreground)",
                surface1: "var(--surface-1)",
                surface2: "var(--surface-2)",
                surface3: "var(--surface-3)",
            },
            fontFamily: {
                sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
                display: ['Syne', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            boxShadow: {
                'glow-sm': '0 0 15px rgba(74, 143, 232, 0.15)',
                'glow': '0 0 30px rgba(74, 143, 232, 0.2)',
                'glow-lg': '0 0 60px rgba(74, 143, 232, 0.25)',
                'glow-purple': '0 0 30px rgba(124, 92, 252, 0.2)',
            },
        },
	},
	plugins: [
        require('@tailwindcss/typography'),
    ],
}
