// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: [
    "@nuxt/ui",
    "nuxt-auth-utils",
    "@nuxt/eslint",
    "@nuxtjs/i18n",
  ],
  css: ["~/assets/css/main.css"],
  devtools: {
    enabled: true,
  },
  typescript: {
    typeCheck: true,
  },
  i18n: {
    defaultLocale: "en",
    strategy: "no_prefix",
    detectBrowserLanguage: false,
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "fr", name: "French", file: "fr.json" },
    ],
  },
});
