import { TypedTypePolicies } from 'generated/apollo-helpers'

const MergeObject = (existing: any, incoming: any) => {
  // console.log('MergeObject', existing, incoming)
  // const result = deepmerge(existing, incoming)
  // console.log('MergeObject Result', result)
  return {
    ...existing,
    ...incoming,
  }
}

export const typePolicies: TypedTypePolicies = {
  Analysis: {
    fields: {
      report: {
        merge: MergeObject,
      },
    }
  },
  SysReport: {
    fields: {
      system: {
        merge: MergeObject,
      }
    }
  },
  Rule: {
    keyFields: ['id', 'ruleName']
  },
  Team: {
    fields: {
      manager: {
        merge: true
      }
    }
  },
  Mutation: {
    fields: {
      team: {
        merge: true
      },
    },
  },
  SystemSetting: {
    keyFields: []
  },
  SAMLSetting: {
    keyFields: []
  },
  Management: {
    keyFields: []
  },
  SensitiveDomain: {
    keyFields: ['domain', 'type', 'count'],
    merge: true,
  },
}
