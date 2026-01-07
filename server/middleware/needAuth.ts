export default defineEventHandler(async (event) => {
  const noAuthPaths = [
    "/api/login",
    "/api/register",
    "/api/sse/connect",
    "/api/settings-strings",
    "/api/_",
  ];

  // If the api call is another paths than the ones listed, check that the user is authenticated.
  if (
    event.path.startsWith("/api")
    && !noAuthPaths.some((path) => event.path.startsWith(path))
  ) {
    await requireUserSession(event);
  }
});
