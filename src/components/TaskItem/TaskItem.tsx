import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import type { Task } from '../../stores/task.store';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = observer(({ task }) => {
  const { taskStore } = useStore();

  const handleToggle = () => {
    taskStore.toggleTaskCompletion(task.id);
  };

  const handleDelete = () => {
    taskStore.deleteTask(task.id);
  };

  return (
    <Card className="task-item">
      <CardContent className="task-item__content">
        <Checkbox
          checked={task.completed}
          onChange={handleToggle}
          color="primary"
        />
        <div className="task-item__details">
          <Typography
            variant="h6"
            className={`task-item__title ${
              task.completed ? 'task-item__title--completed' : ''
            }`}
          >
            {task.title}
          </Typography>
          {task.description && (
            <Typography variant="body2" className="task-item__description">
              {task.description}
            </Typography>
          )}
        </div>
        <div className="task-item__actions">
          <IconButton
            onClick={handleDelete}
            color="error"
            aria-label="delete task"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
});

export default TaskItem;
