import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import { searchObjects, MarchItem } from "./api/client";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [items, setItems] = useState<MarchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function performSearch() {
      if (!searchText.trim()) {
        setItems([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await searchObjects(searchText);
        setItems(results);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Failed to search objects"));
      } finally {
        setIsLoading(false);
      }
    }

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search objects..."
      throttle
    >
      {error ? (
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title="Failed to search objects"
          description={error.message}
        />
      ) : items.length === 0 && searchText ? (
        <List.EmptyView
          icon={Icon.MagnifyingGlass}
          title="No matching objects found"
          description="Try searching with different keywords"
        />
      ) : (
        items.map((item) => (
          <List.Item
            key={item.id}
            title={item.title}
            subtitle={item.notes || undefined}
            accessories={[
              {
                icon: item.completed_at ? Icon.Checkmark : undefined,
                text: [
                  item.due_date,
                  item.created_at ? new Date(item.created_at).toLocaleDateString() : undefined,
                ]
                  .filter(Boolean)
                  .join(" • "),
              },
            ]}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser
                  title="Open in March"
                  url={`https://app.march.cat/items/${item.id}`}
                />
                <Action.CopyToClipboard
                  title="Copy Object Title"
                  content={item.title}
                  shortcut={{ modifiers: ["cmd"], key: "." }}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
