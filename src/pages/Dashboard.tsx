"use client";

import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, AlertCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const statusConfig = {
  'pending': { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
  'in-progress': { label: 'In Progress', color: 'bg-blue-500', icon: Clock },
  'completed': { label: 'Completed', color: 'bg-green-500', icon: CheckCircle2 },
  'failed': { label: 'Failed', color: 'bg-red-500', icon: AlertCircle },
};

const priorityConfig = {
  'low': { label: 'Low', color: 'bg-gray-500' },
  'medium': { label: 'Medium', color: 'bg-orange-500' },
  'high': { label: 'High', color: 'bg-red-500' },
};

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Update user database schema',
      description: 'Migrate the user database to support new authentication features',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2024-01-15T10:30:00',
    },
    {
      id: '2',
      title: 'Fix API rate limiting',
      description: 'Implement proper rate limiting for the bot API endpoints',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-01-14T14:20:00',
    },
    {
      id: '3',
      title: 'Add webhook support',
      description: 'Enable webhooks for real-time task updates',
      status: 'completed',
      priority: 'high',
      createdAt: '2024-01-13T09:15:00',
    },
    {
      id: '4',
      title: 'Optimize database queries',
      description: 'Improve query performance for large datasets',
      status: 'failed',
      priority: 'medium',
      createdAt: '2024-01-12T16:45:00',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as TaskStatus,
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setTasks(tasks.map(task =>
      task.id === editingTask?.id
        ? { ...task, ...formData }
        : task
    ));

    toast.success('Task updated successfully');
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success('Task deleted');
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Clawdbot Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage and update your bot tasks
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTask ? 'Update the task details below' : 'Create a new task for the bot'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter task description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingTask(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdate}>
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.pending}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.inProgress}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.completed}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stats.failed}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Tasks
          </h2>
          <div className="space-y-4">
            {tasks.map((task) => {
              const StatusIcon = statusConfig[task.status].icon;
              const PriorityBadge = priorityConfig[task.priority];

              return (
                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {task.title}
                          </h3>
                          <Badge className={statusConfig[task.status].color}>
                            {statusConfig[task.status].label}
                          </Badge>
                          <Badge className={PriorityBadge.color}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          {task.description}
                        </p>
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(task)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(task.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;