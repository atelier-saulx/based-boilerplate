export default {
  languages: ['en'],
  types: {
    file: {
      prefix: 'fi',
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
