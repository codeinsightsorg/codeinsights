import {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { CommandBarMethods } from "../../shared/types/search-dialog.types";
import {
  Action,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarSearch,
  useKBar,
  useRegisterActions,
} from "kbar";
import { useSuggestionsListStore } from "./state";
import { animatorStyle, searchStyle } from "./styles";
import { RenderResults } from "./render-results";

export const CommandBar = forwardRef<CommandBarMethods>((props, ref) => {
  const { query } = useKBar();
  const getRepos = useSuggestionsListStore((state) => state.getSuggestions);
  const setCurrentSuggestion = useSuggestionsListStore(
    (state) => state.setCurrentSuggestion
  );

  useImperativeHandle(ref, () => ({
    toggle() {
      query.toggle();
    },
  }));
  const [actions, setActions] = useState<Action[]>([]);
  const suggestions = useSuggestionsListStore((state) => state.suggestions);
  const currentSuggestion = useSuggestionsListStore((state) => state.current);

  useEffect(() => {
    const mappedSuggestions: Action[] = suggestions.map((suggestion) => {
      if (suggestion.type === "npm") {
        return {
          id: suggestion.name,
          name: suggestion.name,
          subtitle: suggestion.description,
          perform: (action) => {
            setCurrentSuggestion(suggestion);
          },
        };
      }
      return {
        id: suggestion.url,
        name: suggestion.url,
        subtitle: suggestion.name,
        perform: (action) => {
          setCurrentSuggestion(suggestion);
        },
      };
    });
    setActions(mappedSuggestions);
  }, [suggestions]);

  useRegisterActions(actions, [suggestions]);

  const onSearchInput = async (event: FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    await getRepos(target.value);
  };

  return (
    <KBarPortal>
      <KBarPositioner>
        <KBarAnimator style={animatorStyle}>
          <KBarSearch
            onInput={onSearchInput}
            style={searchStyle}
            defaultPlaceholder="Search for an npm package or a github repo"
          />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
});
