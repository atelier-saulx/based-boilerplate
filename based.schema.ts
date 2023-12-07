export default {
  languages: ['en'],
  types: {
    file: {
      prefix: 'fi',
    },
    folder: {
      fields: {
        name: {
          type: 'string',
        },
        items2: {
          type: 'array',
          items: {
            type: 'string',
          },
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
