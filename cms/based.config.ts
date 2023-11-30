import { BasedFunctionConfig } from '@based/functions'

const config: BasedFunctionConfig = {
  type: 'app',
  name: 'cms',
  public: true,
  main: './App.tsx',
  path: '/cms',
  favicon: './favicon.ico',
}
export default config
