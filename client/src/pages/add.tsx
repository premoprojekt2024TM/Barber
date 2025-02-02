import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useTodos } from '../components/Add/todoStore';
import { Box, CssBaseline, Grid } from '@mui/material';
import { ColumnMemo } from '../components/Add/column';
import AppTheme from '../shared-theme/AppTheme';  // You can remove this if not needed

const AddPage: React.FC = () => {
  const orderTask = useTodos((store) => store.moveTaskBetweenCategories);
  const resetOrderNumber = useTodos((store) => store.resetCounter);

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
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} lg={4}>
                    <ColumnMemo variant="planned" />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <ColumnMemo variant="ongoing" />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <ColumnMemo variant='done' />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={4}>
                    <ColumnMemo variant='archived' />
                  </Grid>
                </Grid>
              </DragDropContext>
            </Box>
          </Grid>

          {/* Left Side (Optional additional content) */}
          <Grid item xs={12} md={12}>
            {/* Additional content if necessary */}
          </Grid>
        </Grid>
    </AppTheme>
  );
};

export default AddPage;
