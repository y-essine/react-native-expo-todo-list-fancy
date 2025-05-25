import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

export const getCategoryIcon = (category: string): IoniconsName => {
  const icons: Record<string, IoniconsName> = {
    work: "briefcase",
    dev: "code-slash",
    health: "fitness",
    personal: "person",
  };
  return icons[category] || "document-text";
};
