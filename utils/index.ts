import type { NitroFetchOptions } from "nitropack";

const TIMEOUT_DURATION = 50_000; // 50,000 milliseconds = 50 seconds

export async function fetchWithTimeout<T>(
  url: string,
  fetchOptions: NitroFetchOptions<any, any> = {}
): Promise<T> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
    throw new Error("Request timed out");
  }, TIMEOUT_DURATION);

  const res = await $fetch<T>(url, {
    ...fetchOptions,
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  return res;
}
