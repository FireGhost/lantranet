import type { EventStream } from "h3";

const activeConnections: Map<number, EventStream> = new Map();
let currentConnectionId = 0;

export const useSSE = {
  addConnection: (stream: EventStream) => {
    currentConnectionId++;
    activeConnections.set(currentConnectionId, stream);
    return currentConnectionId;
  },

  removeConnection: (connectionId: number) => {
    activeConnections.delete(connectionId);
  },

  broadcastDataUpdated: () => {
    for (const stream of activeConnections) {
      stream[1].push({
        event: "data-updated",
        data: "1",
      });
    }
  },
};
