import { KBarResults, useKBar, useMatches } from "kbar";
import { groupNameStyle } from "./styles";
import { ResultItem } from "./result-item";
import { useMemo } from "react";

export function RenderResults() {
  const { actions, rootActionId } = useKBar((state) => ({
    search: state.searchQuery,
    actions: state.actions,
    rootActionId: state.currentRootActionId,
  }));

  const allActions = useMemo(() => {
    return Object.values(actions);
  }, [actions]);

  return (
    <KBarResults
      items={allActions}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId}
          />
        )
      }
    />
  );
}
