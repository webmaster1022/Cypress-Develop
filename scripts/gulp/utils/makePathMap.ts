import fs from 'fs-extra'
import path from 'path'
import _ from 'lodash'

const ROOT_DIR = path.join(__dirname, '../../..')

/**
 * Builds
 */
export async function makePathMap () {
  const packages = await fs.readdir(path.join(ROOT_DIR, 'packages'))
  const dirs = await Promise.all(
    packages.map(async (p) => {
      try {
        await fs.stat(path.join(ROOT_DIR, `packages/${p}/package.json`))

        return p
      } catch (e) {
        return null
      }
    }),
  )

  await fs.writeFile(
    path.join(__dirname, '../monorepoPaths.ts'),
`/* eslint-disable */
// Auto-generated by makePathMap.ts
import path from 'path'
export const monorepoPaths = {
  root: path.join(__dirname, '../..'),
  pkgDir: path.join(__dirname, '../../packages'),
  toolingDir: path.join(__dirname, '../../system-tests'),
${dirs
.filter((f) => f)
.map((dir) => {
  return `  ${_.camelCase(
        `pkg-${dir}`,
  )}: path.join(__dirname, '../../packages/${dir}')`
}).join(',\n')}
} as const
`,
  )
}
