const baseConfig = require('../../../tailwind.config')
const { createGlobPatternsForDependencies } = require('@nx/vue/tailwind')
const { join } = require('path')
const _ = require('lodash')

const a = _.mergeWith(baseConfig, {
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{vue,ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
})
module.exports = a
