import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  typescript: true,
  ignores: [
    'src/routeTree.gen.ts',
  ],
})
