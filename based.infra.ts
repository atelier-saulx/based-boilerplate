export default {
  main: {
    env: {
      machine: 't3.small',
      max: 1,
      min: 1,
      services: {
        '@based/env-config-db': {
          distChecksum:
            'be70ae44e7ce616f7c3c775ffb9fbc85b9be7155-e-b-mb7beef38040423fcf49c6ae7945836b4a0d8409d',
          instances: {
            '0': {
              port: 4001,
            },
          },
        },
        '@based/env-db': {
          distChecksum:
            'c224d3240a528435edd9011df5db5e71fe806a19-e-b-mb7beef38040423fcf49c6ae7945836b4a0d8409d',
          instances: {
            '0': {
              port: 4002,
            },
          },
        },
        '@based/env-db-registry': {
          distChecksum:
            '29ab751e96a91cb9add444ca3457ce1c575696de-e-b-mb7beef38040423fcf49c6ae7945836b4a0d8409d',
          instances: {
            '0': {
              port: 4003,
            },
          },
        },
        '@based/env-db-sub-manager': {
          distChecksum:
            '15bcbdd7ca7b7052a4ce507a9d278d771e9c4444-e-b-mb7beef38040423fcf49c6ae7945836b4a0d8409d',
          instances: {
            '0': {
              port: 4004,
            },
          },
        },
        '@based/env-events-hub': {
          distChecksum:
            '150c7e891120aff636bd35906aa547ebfa32eb41-e-a-m1294494b1fea4c19a3125f23b7efff8643de712b-e-a-m1294494b1fea4c19a3125f23b7efff8643de712b',
          instances: {
            '0': {
              port: 4005,
            },
          },
        },
        '@based/env-hub-discovery': {
          distChecksum:
            '32a794bcdf0fbddb166264b2d380e27c0ea5c4e2-e-a-m1294494b1fea4c19a3125f23b7efff8643de712b-e-a-m1294494b1fea4c19a3125f23b7efff8643de712b',
          instances: {
            '0': {
              port: 80,
            },
          },
        },
        '@based/env-jobs': {
          distChecksum:
            'd97522ee8b4ead396a3c6c12a95b0499feb0c3e6-e-a-m1294494b1fea4c19a3125f23b7efff8643de712b-e-a-m1294494b1fea4c19a3125f23b7efff8643de712b',
          instances: {
            '0': {
              port: 4006,
            },
          },
        },
        '@based/env-metrics-db': {
          distChecksum:
            '72f3d3927635b8c9282302fba7a7b8266b0d18a3-e-b-mb7beef38040423fcf49c6ae7945836b4a0d8409d',
          instances: {
            '0': {
              port: 4007,
            },
          },
        },
        '@based/env-registry': {
          distChecksum:
            '408d215c9ea89dfc80141bc8fa21162ca37be82b-e-d-mff42f7b7391e1db0aa312a478abc3ee55bca7a5a-e-a-m1294494b1fea4c19a3125f23b7efff8643de712b-e-a-m1294494b1fea4c19a3125f23b7efff8643de712b',
          instances: {
            '0': {
              port: 4000,
            },
          },
        },
      },
    },
    envHub: {
      domains: [],
      machine: 't3.micro',
      max: 1,
      min: 1,
      services: {
        '@based/env-hub': {
          distChecksum:
            'ad11a9c1d9246feecc9d7b5ec2e94c889704ba75-e-a-m1294494b1fea4c19a3125f23b7efff8643de712b-e-a-m1294494b1fea4c19a3125f23b7efff8643de712b',
          instances: {
            '0': {
              port: 80,
            },
          },
        },
      },
    },
  },
}
