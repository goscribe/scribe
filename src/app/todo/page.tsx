"use client";

import { useState } from "react";
import { CheckSquare, Plus, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  KanbanProvider, 
  KanbanBoard, 
  KanbanHeader, 
  KanbanCards, 
  KanbanCard 
} from "@/components/ui/shadcn-io/kanban";

// Define types for our todo items and columns
type TodoItem = {
  id: string;
  name: string;
  column: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: Date;
};

type TodoColumn = {
  id: string;
  name: string;
  color: string;
};

// Sample data
const initialColumns: TodoColumn[] = [
  { id: 'todo', name: 'To Do', color: 'bg-gray-100' },
  { id: 'in-progress', name: 'In Progress', color: 'bg-blue-100' },
  { id: 'done', name: 'Done', color: 'bg-green-100' },
];

const initialData: TodoItem[] = [
  {
    id: '1',
    name: 'Design new landing page',
    column: 'todo',
    description: 'Create wireframes and mockups for the new landing page',
    priority: 'high',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Implement user authentication',
    column: 'in-progress',
    description: 'Add login and signup functionality',
    priority: 'medium',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Write documentation',
    column: 'done',
    description: 'Document the API endpoints and usage',
    priority: 'low',
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Fix responsive design issues',
    column: 'todo',
    description: 'Address mobile layout problems',
    priority: 'medium',
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'Set up CI/CD pipeline',
    column: 'in-progress',
    description: 'Configure automated testing and deployment',
    priority: 'high',
    createdAt: new Date(),
  },
];

export default function TodoPage() {
  const [data, setData] = useState<TodoItem[]>(initialData);
  const [newTaskName, setNewTaskName] = useState('');

  const handleDataChange = (newData: TodoItem[]) => {
    setData(newData);
  };

  const addNewTask = () => {
    if (newTaskName.trim()) {
      const newTask: TodoItem = {
        id: Date.now().toString(),
        name: newTaskName.trim(),
        column: 'todo',
        description: '',
        priority: 'medium',
        createdAt: new Date(),
      };
      setData([...data, newTask]);
      setNewTaskName('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getColumnIcon = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return <CheckSquare className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'done':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <CheckSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <CheckSquare className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-semibold text-foreground">Todo Board</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Manage your tasks with drag and drop
            </p>
          </div>
          
          {/* Add new task */}
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Add new task..."
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNewTask()}
              className="w-64"
            />
            <Button onClick={addNewTask} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="h-[calc(100vh-200px)]">
        <KanbanProvider
          columns={initialColumns}
          data={data}
          onDataChange={handleDataChange}
          className="h-full"
        >
          {(column) => (
            <KanbanBoard id={column.id} className="h-full">
              <KanbanHeader className="flex items-center gap-2 p-3 border-b">
                {getColumnIcon(column.id)}
                <span className="font-medium">{column.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {data.filter(item => item.column === column.id).length}
                </span>
              </KanbanHeader>
              <KanbanCards id={column.id}>
                {(item) => (
                  <KanbanCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    column={item.column}
                  >
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(
                            item.priority || 'medium'
                          )}`}
                        >
                          {item.priority || 'medium'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </KanbanCard>
                )}
              </KanbanCards>
            </KanbanBoard>
          )}
        </KanbanProvider>
      </div>
    </div>
  );
}

