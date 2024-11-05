//apps/web/tailwind.config.js
const baseConfig = require('../../tailwind.config')

module.exports = {
  content: [
    ...(baseConfig?.content || []),
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{vue,ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  ...baseConfig,
}
