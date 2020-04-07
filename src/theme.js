import theme from '@theme-ui/preset-dark'

export default {
  ...theme,
  fonts: {
    body: 'Jura,system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading:  'Jura,system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    monospace: 'Menlo, monospace'
  },
  variants:{
    badge: {
      color: 'white',
      bg: 'red',
      px: 2,
    },
  },
  styles: {
    ...theme,
  },
 
}