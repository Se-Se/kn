/**
 *
 *  为后端生成APQ的预编译缓存.
 *
 */
const { readFile, writeFile } = require('fs/promises')
const { join } = require('path')
const { print } = require('graphql')
const { createHash } = require('crypto')
const { addTypenameToDocument } = require('@apollo/client/utilities')

const sha256 = (src) => createHash('sha256').update(src).digest('hex')

const schemaGenerated = join(__dirname, '../schema/generated')
const generated = join(__dirname, '../src/generated')

function generatedGoCache(hashes) {
  return `package generated

var PrebuiltCache = map[string]string{
  ${Object.entries(hashes).map(([key, value]) => `"${key}": \`${value}\`,`).join('\n  ')}
}
`
}

async function main() {
  const content = await readFile(join(generated, 'graphql.tsx'), 'utf8')
  const re = /^export const (\w+)Document = (.*)as unknown as DocumentNode;$/gim
  const hashes = {}

  for (const i of content.matchAll(re)) {
    const [, , value] = i
    const documentNode = addTypenameToDocument(JSON.parse(value))
    const doc = print(documentNode)
    const hash = sha256(doc)

    hashes[hash] = doc
  }

  await writeFile(join(schemaGenerated, 'frontend_hash_query.json'), JSON.stringify(hashes, null, 2))
  await writeFile(join(schemaGenerated, 'frontend_prebuilt_cache.go'), generatedGoCache(hashes))
}

main().catch(e => console.error(e))
