// RTK Query throws "Cannot refetch a query that has not been started yet" when a
// screen refreshes a query that is paused (for example while the phone has no
// internet). That error closed the app. Refreshing a paused query now does nothing.
export const safeRefetch = (
  ...refetches: Array<(() => unknown) | undefined>
) => {
  refetches.forEach(refetch => {
    try {
      const result: any = refetch?.();
      result?.catch?.(() => undefined);
    } catch (error) {
      // nothing to refresh yet
    }
  });
};
