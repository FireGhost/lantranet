// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxt/ui", "nuxt-auth-utils", "@nuxt/eslint"],
  css: ["~/assets/css/main.css"],
  devtools: {
    enabled: true,
  },
  typescript: {
    typeCheck: true,
  },
});
