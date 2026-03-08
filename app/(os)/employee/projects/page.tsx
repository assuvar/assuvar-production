'use client';

import { PageHeader } from "@/components/os/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/Card";
import { Briefcase, Clock, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function EmployeeProjectsPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Employees only see their own tasks
                const res = await api.get('/projects/tasks');
                setTasks(res.data);
            } catch (error) {
                console.error("Failed to fetch tasks", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Assigned Projects"
                description="View projects and tasks assigned specifically to you."
            />

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-structura-blue"></div>
                </div>
            ) : tasks.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="p-12 text-center text-slate-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No projects or tasks assigned to you yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tasks.map((task) => (
                        <Card key={task._id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold">{task.name}</CardTitle>
                                {task.status === 'COMPLETED' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Clock className="w-5 h-5 text-amber-500" />
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-slate-600 line-clamp-2">{task.description}</p>

                                <div className="pt-4 border-t flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                                    <div className="text-slate-400">Project</div>
                                    <div className="text-structura-blue">{task.projectId?.name || 'Assuvar Project'}</div>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                                    <div className="text-slate-400">Deadline</div>
                                    <div className="text-slate-900">{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'TBD'}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
