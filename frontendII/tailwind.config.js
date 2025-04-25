/** @type {import('tailwindcss').Config} */

// const colors = require('tailwindcss/colors');
import colors from 'tailwindcss/colors'
  

export default {
  darkMode: 'selector', 
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      lineHeight:{
        '0' : '0'
      }, 
      colors: {
        tag: {
          red: colors.red['600'],
          orange: colors.orange['600'],
          yellow: colors.yellow['400'],
          green: colors.green['600'],
          cyan: colors.cyan['500'],
          blue: colors.blue['600'],
          purple: colors.purple['600'],
          pink: colors.pink['600'],
        }, 
        background: {
          primary: {
            DEFAULT: colors.neutral['100'],
            dark: colors.neutral['900']
          }, 
          secondary: {
            DEFAULT: colors.neutral['200'],
            // DEFAULT:`rgba(${parseInt(colors.neutral['200'].slice(1, 3), 16)}, 
            //   ${parseInt(colors.neutral['200'].slice(3,5), 16)}, 
            //   ${parseInt(colors.neutral['200'].slice(5,7), 16)},  
            //   0.8)`,  
            dark: colors.neutral['800']
          },
          input: {
            DEFAULT: colors.neutral['500'], 
            dark: colors.neutral['700']
          } 
        },
        primary: {
          DEFAULT: colors.neutral['800'],
          dark: colors.neutral['200'],
        },
        secondary: {
          DEFAULT: colors.neutral['700'],
          dark: colors.neutral['400'],
        },
        button:{
          DEFAULT:colors.sky['400'],
          dark :  colors.sky['500'],
        } 
      },
    },
    plugins: [],
  }
}

