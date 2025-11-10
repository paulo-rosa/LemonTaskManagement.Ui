import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import TaskItem from '../TaskItem/TaskItem';
import './TaskList.scss';

const TaskList: React.FC = observer(() => {
  const { taskStore } = useStore();

  if (taskStore.loading) {
    return (
      <Box className="task-list__loading">
        <CircularProgress />
      </Box>
    );
  }

  if (taskStore.error) {
    return (
      <Alert severity="error" className="task-list__error">
        {taskStore.error}
      </Alert>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list__header">
        <Typography variant="h4" className="task-list__title">
          Task List
        </Typography>
        <Chip
          label={`${taskStore.taskCount} tasks`}
          color="primary"
          variant="outlined"
        />
      </div>

      {taskStore.tasks.length === 0 ? (
        <Card>
          <CardContent>
            <Typography className="task-list__empty">
              No tasks yet. Create your first task!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <div className="task-list__items">
          {taskStore.tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
});

export default TaskList;
