export default defineEventHandler(async (event) => {
  const dataUpdatePaths = [
    '/api/animation',
    '/api/buvette',
    '/api/lan-days',
    '/api/users',
  ];

  const dataUpdateMethods = [
    'POST',
    'PUT',
    'DELETE',
  ];

  // If the api called is an udpate call and starting by one of the listed path, send an
  //   update notification to all the connected clients.
  if (dataUpdateMethods.includes(event.method) && dataUpdatePaths.some((path) => event.path.startsWith(path))) {
    useSSE.broadcastDataUpdated();
  }
});