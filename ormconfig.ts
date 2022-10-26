module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // username: process.env.DB_USER,
  // password: process.env.DB_PASSSWORD,
  // database: process.env.DB_NAME,
  entities: ['dist/src/app/models/**/*.ts'],
  migrations: ['dist/src/database/migrations/**/*.ts'],
  cli: {
    migrationsDir: 'dist/src/database/migrations',
  },
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};
