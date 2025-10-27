import type { OrderStatusModel } from "~~/prisma/generated/prisma/models";

export const getOrderStatusesSorted = async () => {
  const { data: orderStatusesSorted } = await useFetch<OrderStatusModel[]>(
    "/api/buvette/status",
    {
      transform: (data) => data.sort((a, b) => a.weight - b.weight),
      default: () => [],
    },
  );
  return orderStatusesSorted;
};

export const useFindNextStatus = (
  currentStatus: OrderStatusModel | null,
  orderStatusesSorted: OrderStatusModel[],
): OrderStatusModel | undefined => {
  if (!currentStatus) {
    return orderStatusesSorted.at(0);
  }

  const currentIndex = orderStatusesSorted.findIndex(
    (orderStatusToFind) => orderStatusToFind.id === currentStatus.id,
  );
  return orderStatusesSorted.at(currentIndex + 1);
};
