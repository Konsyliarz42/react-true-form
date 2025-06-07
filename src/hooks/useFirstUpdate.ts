import React from "react";

/**
 * Returns `true` when the component has not been updated.
 */
export function useFirstUpdate(): boolean {
  const firstRender = React.useRef<boolean>(true);

  React.useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
}
