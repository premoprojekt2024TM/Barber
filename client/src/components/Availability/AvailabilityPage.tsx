import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useTodos } from './todoStore';
import { Box, Button, CssBaseline, Grid } from '@mui/material';
import { ColumnMemo } from './column';
import AppTheme from '../../shared-theme/AppTheme';

const ListTasksButton = () => {
  const todos = useTodos((store) => store.todos);

  const handleListTasks = () => {
    const taskList = Object.keys(todos).map((day) => {
      const tasks = todos[day];
      const timeSlots = tasks.map((task) => task.title);
      return `${day.charAt(0).toUpperCase() + day.slice(1)}: [${timeSlots.join(', ')}]`;
    });

    alert(taskList.join('\n'));
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleListTasks}>
        List All Tasks
      </Button>
    </div>
  );
};




const AddPage = () => {
  const orderTask = useTodos((store) => store.moveTaskBetweenCategories);

  function handleOnDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    orderTask(
      draggableId,
      source.droppableId,
      destination.droppableId,
      destination.index
    );
  }

  return (
    <AppTheme>
      <CssBaseline /> 

      <Grid>
        <Grid>
          <Box sx={{}}>
            <ListTasksButton />
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
                  <ColumnMemo variant='done' />
                </Grid>
              </Grid>
            </DragDropContext>
          </Box>
        </Grid>

        <Grid item xs={12} md={12}>
        </Grid>
      </Grid>
    </AppTheme>
  );
};

export default AddPage;
