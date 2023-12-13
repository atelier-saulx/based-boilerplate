export default {
  languages: ['en'],
  types: {
    file: {
      prefix: 'fi',
      fields: {
        index: {
          type: 'number',
        },
        tempOrder: {
          type: 'string',
        },
      },
    },
    folder: {
      fields: {
        tempOrder: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        index: {
          type: 'number',
        },
      },
      prefix: 'di',
    },
    user: {
      prefix: 'us',
      fields: {
        currentToken: { type: 'string' },
        profileImg: { type: 'url' },
      },
    },
  },
}
