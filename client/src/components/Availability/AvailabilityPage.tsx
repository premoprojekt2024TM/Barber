import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useTodos } from "./todoStore";
import {
  Box,
  Button,
  CssBaseline,
  Grid,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { ColumnMemo } from "./column";
import AppTheme from "../../shared-theme/AppTheme";
import { useEffect, useState } from "react";

const TaskButtonsRow = () => {
  const todos = useTodos((store) => store.todos);
  const createAvailability = useTodos((store) => store.createAvailability);
  const loading = useTodos((store) => store.loading);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"save" | "create">("save");

  const handleListTasks = () => {
    const taskList = Object.keys(todos).map((day) => {
      const tasks = todos[day];
      const timeSlots = tasks.map((task) => task.title);
      return `${day.charAt(0).toUpperCase() + day.slice(1)}: [${timeSlots.join(", ")}]`;
    });

    alert(taskList.join("\n"));
  };

  const handleCreateAvailability = async () => {
    try {
      await createAvailability();
      setCreateSuccess(true);
    } catch (error) {
      setActionError("Failed to create availability");
    }
  };

  const handleConfirmAction = () => {
    setConfirmDialogOpen(false);
    if (actionType === "save") {
      handleCreateAvailability();
    }
  };

  const openConfirmDialog = (type: "save" | "create") => {
    setActionType(type);
    setConfirmDialogOpen(true);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="primary" onClick={handleListTasks}>
            List All Tasks
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => openConfirmDialog("save")}
            disabled={loading}
          >
            Elküldöm
          </Button>
        </Stack>
      </Stack>

      {/* Success Notifications */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={6000}
        onClose={() => setSaveSuccess(false)}
      >
        <Alert onClose={() => setSaveSuccess(false)} severity="success">
          Availability saved successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={createSuccess}
        autoHideDuration={6000}
        onClose={() => setCreateSuccess(false)}
      >
        <Alert onClose={() => setCreateSuccess(false)} severity="success">
          Availability created successfully!
        </Alert>
      </Snackbar>

      {/* Error Notification */}
      <Snackbar
        open={!!actionError}
        autoHideDuration={6000}
        onClose={() => setActionError(null)}
      >
        <Alert onClose={() => setActionError(null)} severity="error">
          {actionError}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>
          {actionType === "save" ? "Save Availability" : "Create Availability"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType === "save"
              ? "Are you sure you want to save your current availability?"
              : "Are you sure you want to create these time slots as your availability?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmAction} autoFocus color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const AddPage = () => {
  const orderTask = useTodos((store) => store.moveTaskBetweenCategories);
  const fetchAvailability = useTodos((store) => store.fetchAvailability);
  const loading = useTodos((store) => store.loading);
  const error = useTodos((store) => store.error);

  useEffect(() => {
    // Fetch availability data when component mounts
    fetchAvailability();
  }, [fetchAvailability]);

  function handleOnDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    orderTask(
      draggableId,
      source.droppableId,
      destination.droppableId,
      destination.index,
    );
  }

  return (
    <AppTheme>
      <CssBaseline />
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Kezeld az időpontjaidat
            </Typography>

            <TaskButtonsRow />

            {loading && !error && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {error && (
              <Box sx={{ my: 4 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}

            {!loading && !error && (
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} lg={4}>
                    <ColumnMemo variant="monday" />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <ColumnMemo variant="tuesday" />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <ColumnMemo variant="wednesday" />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <ColumnMemo variant="thursday" />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <ColumnMemo variant="friday" />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <ColumnMemo variant="saturday" />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <ColumnMemo variant="sunday" />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <ColumnMemo variant="done" />
                  </Grid>
                </Grid>
              </DragDropContext>
            )}
          </Box>
        </Grid>
      </Grid>
    </AppTheme>
  );
};

export default AddPage;
