const baseConfig = require('../../../tailwind.config')
const { createGlobPatternsForDependencies } = require('@nx/vue/tailwind')
const { join } = require('path')

console.error(...createGlobPatternsForDependencies(__dirname))
console.error('hello')

module.exports = {
  content: [
    ...(baseConfig?.content || []),
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{vue,ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  ...baseConfig,
}
