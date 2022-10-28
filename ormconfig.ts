module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // username: process.env.DB_USER,
  // password: process.env.DB_PASSSWORD,
  // database: process.env.DB_NAME,
  entities: [
    process.env.NODE_ENV === 'dev'
      ? 'src/app/models/**/*.ts'
      : 'dist/src/app/models/**/*.js',
  ],
  migrations: [
    process.env.NODE_ENV === 'dev'
      ? 'src/database/migrations/**/*.ts'
      : 'dist/src/database/migrations/**/*.js',
  ],
  cli: {
    migrationsDir:
      process.env.NODE_ENV === 'dev'
        ? 'src/database/migrations'
        : 'dist/src/database/migrations',
  },
  extra:
    process.env.NODE_ENV === 'prod'
      ? {
          ssl: {
            rejectUnauthorized: true,
          },
        }
      : null,
};
