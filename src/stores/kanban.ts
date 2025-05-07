import { defineStore } from 'pinia'

// Define types for Task, Step, and KanbanColumn
interface Task {
  id: number;
  type: string;
  name: string;
  description: string;
  status_id: number;
  is_archived: boolean;
  step_name: string;
  assigner: any; // Replace `any` with the actual type of assigner if available
  priority: number;
}

interface Step {
  id: number;
  type: string;
  name: string;
  description: string;
  status_id: number;
  is_archived: boolean;
  step_name: string | null;
  assigner: any; // Replace `any` with the actual type of assigner if available
}

type KanbanItem = Task | Step;

interface KanbanColumn {
  id: number | string;
  title: string;
  items: KanbanItem[];
}

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    kanbanColumns: [] as KanbanColumn[], // Typing the state with KanbanColumn[]
  }),
  actions: {
    updateKanbanColumns(columns: KanbanColumn[]) {
      this.kanbanColumns = columns;
    },

    updateItemStatus(itemId: number, newStatusId: number, itemType: string) {
      // Tìm item trong kanbanColumns và cập nhật status
      for (let column of this.kanbanColumns) {
        const itemIndex = column.items.findIndex(
          (item: KanbanItem) => item.id === itemId && item.type === itemType
        );
        if (itemIndex !== -1) {
          column.items[itemIndex].status_id = newStatusId;
          break;
        }
      }
    },

    addItemToColumn(item: KanbanItem, columnId: number | string) {
      const column = this.kanbanColumns.find((c) => c.id === columnId);
      if (column) {
        column.items.push(item);
      }
    },

    removeItemFromColumn(itemId: number, columnId: number | string) {
      const column = this.kanbanColumns.find((c) => c.id === columnId);
      if (column) {
        column.items = column.items.filter((item) => item.id !== itemId);
      }
    },
  },
});
