'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/os/ui/Card';
import { StatusBadge } from '@/components/os/ui/StatusBadge';
import api from '@/lib/axios';
import { formatDate } from '@/lib/utils';

export default function EmployeeDashboard() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/projects/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (taskId: string) => {
        if (!confirm("Mark task as completed?")) return;
        try {
            await api.patch(`/projects/tasks/${taskId}/status`, { status: "COMPLETED" });
            fetchTasks();
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        }
    };

    const pendingCount = tasks.filter(t => t.status === 'PENDING').length;
    const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Dashboard"
                description="Manage your assigned tasks."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Pending</p>
                            <p className="text-lg font-bold text-structura-black">{pendingCount}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Completed</p>
                            <p className="text-lg font-bold text-structura-black">{completedCount}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Assigned Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? <p>Loading...</p> : tasks.length === 0 ? <p className="text-slate-500">No tasks assigned.</p> : (
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <div key={task._id} className="border p-4 rounded-lg flex justify-between items-center bg-white">
                                    <div>
                                        <h3 className="font-semibold text-structura-black">{task.name}</h3>
                                        <p className="text-sm text-slate-500 mb-1">{task.description}</p>
                                        <div className="flex gap-4 text-xs text-slate-400">
                                            <span>Project: {task.projectId?.name || 'Unknown'}</span>
                                            <span>Due: {formatDate(task.deadline)}</span>
                                            <span className="font-medium text-slate-600">Est. Payout: ${task.salary}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={task.status} />
                                        {task.status !== 'COMPLETED' && (
                                            <Button size="sm" onClick={() => handleComplete(task._id)}>
                                                Mark Done
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
