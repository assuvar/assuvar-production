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
        employeeId: ''
    });

    const [staffList, setStaffList] = useState<any[]>([]);
    const [projectNotes, setProjectNotes] = useState('');
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notesLoading, setNotesLoading] = useState(false);

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
                employeeId: taskForm.employeeId,
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
                            <CardTitle className="text-base">Project Overview & Notes</CardTitle>
                            <Button size="sm" variant="outline" onClick={() => isEditingNotes ? handleUpdateNotes() : setIsEditingNotes(true)} isLoading={notesLoading}>
                                {isEditingNotes ? 'Save Notes' : 'Edit'}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {isEditingNotes ? (
                                <textarea
                                    className="w-full h-32 p-3 border rounded-md bg-slate-50 text-sm"
                                    placeholder="Add internal notes for the delivery team here..."
                                    value={projectNotes}
                                    onChange={(e) => setProjectNotes(e.target.value)}
                                />
                            ) : (
                                <div className="p-4 bg-slate-50 border rounded-md whitespace-pre-wrap text-sm text-slate-700">
                                    {projectNotes || 'No notes added yet for this project.'}
                                </div>
                            )}
                        </CardContent>
                    </Card>

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
                                        placeholder="Task Name" className="w-full h-10 border p-2 rounded bg-white" required
                                        value={taskForm.name} onChange={e => setTaskForm({ ...taskForm, name: e.target.value })}
                                    />
                                    <select
                                        className="w-full h-10 border p-2 rounded bg-white" required
                                        value={taskForm.employeeId} onChange={e => setTaskForm({ ...taskForm, employeeId: e.target.value })}
                                    >
                                        <option value="">Select Employee to Assign</option>
                                        {staffList.map(item => (
                                            <option key={item.userId?._id || item._id} value={item.userId?._id || item._id}>
                                                {item.fullName || item.userId?.name} ({item.designation})
                                            </option>
                                        ))}
                                    </select>
                                    <textarea
                                        placeholder="Task Description" className="w-full border p-2 rounded bg-white min-h-[80px]"
                                        value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="date" className="w-full border p-2 rounded bg-white" required
                                            value={taskForm.deadline} onChange={e => setTaskForm({ ...taskForm, deadline: e.target.value })}
                                        />
                                        <input
                                            type="number" placeholder="Salary / Commission" className="w-full border p-2 rounded bg-white" required
                                            value={taskForm.salary} onChange={e => setTaskForm({ ...taskForm, salary: e.target.value })}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">Assign Task</Button>
                                </form>
                            )}

                            {tasks.length === 0 ? <p className="text-slate-500">No tasks assigned.</p> : (
                                <div className="space-y-4">
                                    {tasks.map(task => (
                                        <div key={task._id} className="border p-4 rounded-lg flex justify-between items-center hover:bg-slate-50 transition-colors">
                                            <div>
                                                <p className="font-bold text-slate-900">{task.name}</p>
                                                <p className="text-xs text-slate-500 font-medium">Assigned to: {task.employeeId?.name || 'Unknown'}</p>
                                                <p className="text-[11px] text-slate-400 mt-1">Due: {formatDate(task.deadline)}</p>
                                            </div>
                                            <div className="text-right">
                                                <StatusBadge status={task.status} />
                                                <p className="text-sm font-black text-structura-blue mt-1">${task.salary}</p>
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
