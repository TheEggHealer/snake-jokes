import { createTheme } from '@mantine/core';

const theme = createTheme({
  colors: {
    // https://mantine.dev/colors-generator/?color=F05F42
    // Default: 4
    primary: [
      "#ffece6",
      "#ffd8d0",
      "#fab0a1",
      "#f5856f",
      "#f05f42",
      "#ee4a29",
      "#ee3d1a",
      "#d42f0e",
      "#bd270a",
      "#a61c04"
    ],

    // https://mantine.dev/colors-generator/?color=9A594C
    // Default: 7
    secondary: [
      '#fff0ed',
      '#f2e1de',
      '#dec2bc',
      '#cba198',
      '#ba847a',
      '#b17266',
      '#ad695b',
      '#9a594c',
      '#894d41',
      '#794035'
    ],

    custom: [
      '#F8F6F6', // Background color
      '#F5F2EF', // Overlay level 1
      '#F3E9E7', // Overlay level 2
      '#E7EEEC', // Overlay green
      '#3BCA70', // Green
      '#F4E3DD', // Overlay active
      '#3BCA70',
      '#3BCA70',
      '#3BCA70',
      '#3BCA70',
    ]
  },
  primaryColor: 'primary',


  fontFamily: "Arimo, sans-serif",
  headings: {
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '24px', fontWeight: '900' },
      h2: { fontSize: '20px', fontWeight: '500' },

    }
  }

});

export default theme;