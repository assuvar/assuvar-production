'use client';

import { useState, useEffect, use } from 'react';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/os/ui/Card';
import { StatusBadge } from '@/components/os/ui/StatusBadge';
import api from '@/lib/axios';
import { formatDate } from '@/lib/utils';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Assign Task Form State
    const [showAssign, setShowAssign] = useState(false);
    const [taskForm, setTaskForm] = useState({
        name: '',
        description: '',
        deadline: '',
        salary: '',
        employeeEmail: '' // We need ID, but form usually takes name/email. I'll ask for Email and look up ID or just ID if simple. 
        // Prompt step 8 script found admin ID. 
        // Real user needs to select Employee. 
        // I don't have a "Get Employees" API implemented explicitly in the prompt list. 
        // Prompt lists APIs: Lead, Quote, Sale, Payment, Project, Task, Payroll. 
        // Does NOT list "Get Users/Employees". 
        // But `authRoutes` has `register`. 
        // If I can't fetch employees, I can't build a dropdown. 
        // I will use a simple text input for "Employee ID" for integration Phase 1 strictness, 
        // OR better, try to fetch users if I can? 
        // No "Get Users" route in backend. 
        // "Logic: Employee has login". 
        // Workaround: I'll assume the admin knows the Employee ID for Phase 1 or use the Admin's ID for testing. 
        // I'll add a helper Text Input for Employee ID.
    });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // Fetch projects and find
            const projRes = await api.get('/projects');
            const foundProj = projRes.data.find((p: any) => p._id === id);
            setProject(foundProj);

            // Fetch tasks and filter
            const tasksRes = await api.get('/projects/tasks');
            const foundTasks = tasksRes.data.filter((t: any) => t.projectId?._id === id || t.projectId === id);
            setTasks(foundTasks);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // We need Employee ID. 
            // Since we don't have a user search API, I will just take the input as Employee ID.
            await api.post('/projects/tasks', {
                projectId: id,
                employeeId: taskForm.employeeEmail, // Using this field for ID
                name: taskForm.name,
                description: taskForm.description,
                deadline: taskForm.deadline,
                salary: Number(taskForm.salary)
            });
            setShowAssign(false);
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Failed to assign task. Check Employee ID.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <div className="space-y-6">
            <PageHeader
                title={project.name}
                description={`Status: ${project.status}`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Tasks</CardTitle>
                            <Button size="sm" variant="outline" onClick={() => setShowAssign(!showAssign)}>
                                {showAssign ? 'Cancel' : 'Assign Task'}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {showAssign && (
                                <form onSubmit={handleAssignTask} className="mb-6 p-4 border rounded bg-slate-50 space-y-3">
                                    <input
                                        placeholder="Task Name" className="w-full border p-2 rounded" required
                                        value={taskForm.name} onChange={e => setTaskForm({ ...taskForm, name: e.target.value })}
                                    />
                                    <input
                                        placeholder="Employee ID (Copy from DB)" className="w-full border p-2 rounded" required
                                        value={taskForm.employeeEmail} onChange={e => setTaskForm({ ...taskForm, employeeEmail: e.target.value })}
                                    />
                                    <input
                                        placeholder="Description" className="w-full border p-2 rounded"
                                        value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="date" className="w-full border p-2 rounded" required
                                            value={taskForm.deadline} onChange={e => setTaskForm({ ...taskForm, deadline: e.target.value })}
                                        />
                                        <input
                                            type="number" placeholder="Salary" className="w-full border p-2 rounded" required
                                            value={taskForm.salary} onChange={e => setTaskForm({ ...taskForm, salary: e.target.value })}
                                        />
                                    </div>
                                    <Button type="submit">Assign</Button>
                                </form>
                            )}

                            {tasks.length === 0 ? <p className="text-slate-500">No tasks assigned.</p> : (
                                <div className="space-y-4">
                                    {tasks.map(task => (
                                        <div key={task._id} className="border p-3 rounded flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{task.name}</p>
                                                <p className="text-sm text-slate-500">Assigned: {task.employeeId?.name || task.employeeId}</p>
                                                <p className="text-xs text-slate-400">Due: {formatDate(task.deadline)}</p>
                                            </div>
                                            <div className="text-right">
                                                <StatusBadge status={task.status} />
                                                <p className="text-sm font-bold mt-1">${task.salary}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
