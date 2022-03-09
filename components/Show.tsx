import React, { useEffect, useMemo } from "react";
import { reduceFilter } from "../helpers";
import ShowElse from "./ShowElse";
function Show({
  when,
  children,
}: {
  when: boolean;
  children: React.ReactNode;
}) {
  const [childrenArr, showElse] = useMemo(
    () =>
      reduceFilter(
        React.Children.toArray(children),
        (child: React.ReactNode) =>
          React.isValidElement(child) && child?.type !== ShowElse
      ),
    [children]
  );

  if (!when) {
    if (showElse) {
      return <>{showElse}</>;
    }
    return null;
  }

  return <>{childrenArr}</>;
}

export default Show;
