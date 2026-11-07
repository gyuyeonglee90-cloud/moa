/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F6F5F4',
        surface: '#FFFFFF',
        hairline: '#E6E6E6',
        ink: '#000000',
        'ink-2': '#31302E',
        'ink-3': '#615D59',
        'ink-4': '#A39E98',
        'field-border': '#8A857F',
        accent: '#0075DE',
        'accent-strong': '#005BAB',
        success: '#137A2A',
        notice: '#B45309',
        char: {
          lime: { light: '#E4FBC9', base: '#8FE05A', deep: '#3FB82E', tint: '#EEFBE0' },
          pink: { light: '#FFE0F3', base: '#FF9AD8', deep: '#FF64C8', tint: '#FFEEF8' },
          coral: { light: '#FFE1DA', base: '#FF8A7A', deep: '#F0503C', tint: '#FFEFEB' },
          sky: { light: '#DDEEFF', base: '#8CC4F5', deep: '#3D8FE0', tint: '#EAF4FF' },
          sun: { light: '#FFF3CC', base: '#FFD36B', deep: '#FFAE1A', tint: '#FFF8E3' },
          lavender: { light: '#F2E8FD', base: '#D6B6F6', deep: '#9B6FD6', tint: '#F6F0FE' },
        },
      },
      fontFamily: {
        sans: ['Pretendard Variable', 'Pretendard', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        wordmark: ['3.5rem', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '900' }],
        display: ['2rem', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '700' }],
        h1: ['1.625rem', { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '700' }],
        h2: ['1.375rem', { lineHeight: '1.3', letterSpacing: '-0.012em', fontWeight: '700' }],
        h3: ['1.125rem', { lineHeight: '1.35', letterSpacing: '-0.008em', fontWeight: '700' }],
        title: ['1.0625rem', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.45', fontWeight: '400' }],
        button: ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
        caption: ['0.875rem', { lineHeight: '1.43', fontWeight: '400' }],
        eyebrow: ['0.75rem', { lineHeight: '1.33', letterSpacing: '0.01em', fontWeight: '600' }],
        stat: ['2.25rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '700' }],
      },
      spacing: {
        xxs: '0.25rem',
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '1.75rem',
        xxl: '2rem',
        '3xl-space': '3rem',
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        level1:
          '0 0.175px 1.04px rgba(0,0,0,.01), 0 0.8px 2.93px rgba(0,0,0,.02), 0 2px 7.85px rgba(0,0,0,.027), 0 4px 18px rgba(0,0,0,.04)',
        level2:
          '0 0.175px 1.04px rgba(0,0,0,.01), 0 0.8px 2.93px rgba(0,0,0,.02), 0 2px 7.85px rgba(0,0,0,.027), 0 4px 18px rgba(0,0,0,.04), 0 23px 52px rgba(0,0,0,.05)',
      },
      backgroundImage: {
        hero: 'linear-gradient(to bottom, #E3F1FF, #F7FAFF, #FFFFFF)',
      },
    },
  },
  plugins: [],
}
