import path from 'path';
import merge from 'lodash/merge';

// Default configuations applied to all environments
const defaultConfig = {
  env: process.env.NODE_ENV,
  get envs() {
    return {
      test: process.env.NODE_ENV === 'test',
      development: process.env.NODE_ENV === 'development',
      production: process.env.NODE_ENV === 'production',
    };
  },

  name: require('../../package.json').name,
  version: require('../../package.json').version,
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 8080,
  ip: process.env.IP || '0.0.0.0',
  apiPrefix: '', // Could be /api/resource or /api/v2/resource
  userRoles: ['guest', 'user', 'admin'],

  /**
   * MongoDB configuration options
   */
  mongo: {
    seed: true,
    options: {
      db: {
        safe: true,
      },
    },
  },

  /**
   * Security configuation options regarding sessions, authentication and hashing
   */
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'H1fpxRVir4FS6gT97NCteVSxqmEBEo9a',
    sessionExpiration: process.env.SESSION_EXPIRATION || 60 * 60 * 2, // 2 hours
    saltRounds: process.env.SALT_ROUNDS || 12,
  },
  api: {
    auth: {
      base: process.env.AUTH_BASE || 'https://here2there-auth.herokuapp.com',
      user: process.env.AUTH_USER || '/user',
    },
    force: {
      base: process.env.FORCE_BASE || 'https://here2there-force.herokuapp.com',
      auth: process.env.FORCE_AUTH || '/authenticate',
    },
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY || 't)X8aderv\\T_(NgfjO}x<]~1q)3T-h2I(}ZM#hhrD[a<}gi@w+Vshzlt\\MWBK*#-U@-"JU!xgB_6SH3GFP}f6kb%%)HE~2Zgjo)cH^!PHkN|UmD{B?GB<Qz43bNe)<%)h_-O`^9U3UC0Cm5}9LAmv5!6)AW\\7>Q~"B]E59c5}+m(Y#ut!0Is2E:%mF<[4bR!xxe}[)s87)}pKRIH6wHY(FN2uLFXyPF>\\aq1*Cen~XD4VLlTjogkUI#nGzsbIZ8C',
    algorithm: 'aes256',
  },
};

// Environment specific overrides
const environmentConfigs = {
  development: {
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost/development',
    },
    security: {
      saltRounds: 4,
    },
  },
  test: {
    port: 5678,
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost/test',
    },
    security: {
      saltRounds: 4,
    },
  },
  production: {
    mongo: {
      seed: false,
      uri: process.env.MONGODB_URI,
    },
  },
};

// Recursively merge configurations
export default merge(defaultConfig, environmentConfigs[process.env.NODE_ENV] || {});
