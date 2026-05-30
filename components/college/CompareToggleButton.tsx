"use client";

import { Button } from "@/components/ui/button";
import { useCompareStore, COMPARE_MAX } from "@/store/compareStore";

export default function CompareToggleButton({ collegeId }: { collegeId: string }) {
  const selectedIds = useCompareStore((state) => state.selectedIds);
  const addCollege = useCompareStore((state) => state.addCollege);
  const removeCollege = useCompareStore((state) => state.removeCollege);

  const isSelected = selectedIds.includes(collegeId);
  const isFull = selectedIds.length >= COMPARE_MAX && !isSelected;

  const handleToggle = () => {
    if (isSelected) {
      removeCollege(collegeId);
    } else if (!isFull) {
      addCollege(collegeId);
    }
  };

  return (
    <Button
      variant={isSelected ? "secondary" : "outline"}
      size="sm"
      disabled={isFull}
      onClick={handleToggle}
    >
      {isSelected ? "In compare" : isFull ? "Limit reached" : "Add to compare"}
    </Button>
  );
}
