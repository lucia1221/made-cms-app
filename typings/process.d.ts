declare namespace NodeJS {
  export interface ProcessEnv {
    APP_KEY: string;
    APP_URL: string;
    POSTMARK_TEMPLATE_PASSWORD_RESET: string;
    POSTMARK_TEMPLATE_USER_INVITATION: string;
    POSTMARK_TOKEN: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SECRET_KEY: string;
    SUPABASE_URL: string;
  }
}
