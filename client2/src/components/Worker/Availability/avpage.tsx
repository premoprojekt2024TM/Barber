import { useEffect } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { useTodos } from "./todo-store";
import { ColumnMemo } from "./column";
import { TaskButtonsRow } from "./task-buttons-row";
import { AlertCircle } from "lucide-react";
import Sidebar from "../sidebar";

export default function AvailabilityPageWithSidebar() {
  const orderTask = useTodos((store) => store.moveTaskBetweenCategories);
  const fetchAvailability = useTodos((store) => store.fetchAvailability);
  const loading = useTodos((store) => store.loading);
  const error = useTodos((store) => store.error);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  function handleOnDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId === "done") {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    orderTask(
      draggableId,
      source.droppableId as any,
      destination.droppableId as any,
      destination.index,
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden">
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Kezeld az időpontjaidat</h1>
          <TaskButtonsRow />
          {loading && !error && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          )}
          {error && (
            <div className="my-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-center">
              <AlertCircle className="mr-2" size={20} />
              <span>{error}</span>
            </div>
          )}
          {!loading && !error && (
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ColumnMemo variant="monday" />
                <ColumnMemo variant="tuesday" />
                <ColumnMemo variant="wednesday" />
                <ColumnMemo variant="thursday" />
                <ColumnMemo variant="friday" />
                <ColumnMemo variant="saturday" />
                <ColumnMemo variant="sunday" />
                <ColumnMemo variant="done" />
              </div>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );
}
