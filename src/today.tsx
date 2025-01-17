import { ActionPanel, Action, List, Icon } from "@raycast/api";
import { getTodayItems, MarchItem } from "./api/client";
import { useCallback, useEffect, useState } from "react";

export default function Command() {
  const [items, setItems] = useState<MarchItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchItems = useCallback(async () => {
    try {
      const todayItems = await getTodayItems();
      // Ensure we have an array, even if empty
      setItems(Array.isArray(todayItems) ? todayItems : []);
    } catch (error) {
      console.error("Error fetching today's items:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <List isLoading={isLoading}>
      {!isLoading && items.length === 0 ? (
        <List.EmptyView
          icon={Icon.Calendar}
          title="No objects for today"
          description="All clear! No objects scheduled for today."
        />
      ) : (
        items.map((item) => (
          <List.Item
            key={item.id}
            icon={item.completed_at ? Icon.Checkmark : Icon.Circle}
            title={item.title}
            subtitle={item.notes || undefined}
            accessories={[
              {
                text: item.due_date,
              },
            ]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action.OpenInBrowser
                    title="Open in March"
                    url={`https://app.march.cat/items/${item.id}`}
                  />
                </ActionPanel.Section>
                <ActionPanel.Section>
                  <Action.CopyToClipboard
                    title="Copy Object Title"
                    content={item.title}
                    shortcut={{ modifiers: ["cmd"], key: "." }}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
