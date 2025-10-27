import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";

export const useApi = (
  apiPath: NitroFetchRequest,
  options: {
    fetchOptions?: NitroFetchOptions<NitroFetchRequest>;
    successString?: string;
    errorString?: string;
    onSuccess?: Function;
    onError?: Function;
  },
) => {
  const toast = useToast();

  return $fetch(apiPath, options.fetchOptions).then(
    (success) => {
      if (options.successString !== undefined) {
        toast.add({ title: options.successString });
      }
      if (options.onSuccess !== undefined) {
        options.onSuccess(success);
      }
    },
    (error) => {
      toast.add({
        title: options.errorString ?? "Error",
        description: error.data.message,
        color: "error",
      });
      if (options.onError !== undefined) {
        options.onError(error);
      }
    },
  );
};
