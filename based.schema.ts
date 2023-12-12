export default {
  languages: ['en'],
  types: {
    file: {
      prefix: 'fi',
      fields: {
        index: {
          type: 'number',
        },
      },
    },
    folder: {
      fields: {
        name: {
          type: 'string',
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
