// Adapted from @sanity/form-builder/src/sanity/utils/gradientPatchAdapter.ts
import assert from 'assert'
import {arrayToJSONMatchPath} from '@sanity/mutator'

type Patch = Record<string, any>

type GradientPatch = Record<string, any>

export function toGradient(patches: Patch[]): GradientPatch[] {
  return patches.map(toGradientPatch)
}

function toGradientPatch(patch: Patch): GradientPatch {
  const matchPath = arrayToJSONMatchPath(patch.path || [])
  if (patch.type === 'insert') {
    const {position, items} = patch
    return {
      insert: {
        [position]: matchPath,
        items: items
      }
    }
  }

  if (patch.type === 'unset') {
    return {
      unset: [matchPath]
    }
  }

  assert(patch.type, `Missing patch type in patch ${JSON.stringify(patch)}`)
  if (matchPath) {
    return {
      [patch.type]: {
        [matchPath]: patch.value
      }
    }
  }
  return {
    [patch.type]: patch.value
  }
}
