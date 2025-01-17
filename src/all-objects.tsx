import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import { getAllItems, MarchItem } from "./api/client";

export default function Command() {
  const [items, setItems] = useState<MarchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const allItems = await getAllItems();
        setItems(allItems);
      } catch (e) {
        setError(e instanceof Error ? e : new Error("Failed to fetch items"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchItems();
  }, []);

  if (error) {
    return (
      <List>
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title="Failed to load objects"
          description={error.message}
        />
      </List>
    );
  }

  return (
    <List isLoading={isLoading}>
      {items.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.List}
          title="No objects found"
          description="You don't have any objects yet."
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
