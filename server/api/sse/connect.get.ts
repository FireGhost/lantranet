export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event);

  const connectionId = useSSE.addConnection(eventStream);

  eventStream.onClosed(async () => {
    useSSE.removeConnection(connectionId);
    await eventStream.close();
  });

  setResponseHeader(event, "Content-Type", "text/event-stream");
  setResponseHeader(event, "Cache-Control", "no-cache");

  return await eventStream.send();
});
