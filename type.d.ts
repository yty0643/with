declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    DATABASE_URL: string
    DIRECT_URL: string
    COOLSMS_API_KEY: string
    COOLSMS_API_SECRET: string
    W_CALL_CENTER: string
  }
}
