export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession();

  const pathNoAuthRequired = ["/login", "/register", "/"];

  if (!loggedIn.value && pathNoAuthRequired.indexOf(to.path) === -1) {
    return navigateTo("/login");
  }
});
