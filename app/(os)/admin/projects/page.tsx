'use client';

import Link from "next/link";
import { Plus, Search, Filter, Briefcase, Clock } from "lucide-react";
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Card } from "@/components/os/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/os/ui/Table";
import { StatusBadge } from "@/components/os/ui/StatusBadge";
import { useEffect, useState } from "react";
import api from '@/lib/axios';
import { formatDate } from '@/lib/utils';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Projects"
                description="Track delivery milestones."
            >
                {/* Manual creation button disabled as it should come from Sale. Or enable search/select sale? 
                    Prompt says "linked to Sale". UI Rules: "Auto-created or manual button... linked to sale".
                    Keeping it sourced from Sale Details is safer for data integrity in Phase 1.
                */}
            </PageHeader>

            <Card className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Project Name</TableHead>
                            <TableHead>Sale Ref</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-4">Loading...</TableCell></TableRow>
                        ) : projects.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-4">No projects found.</TableCell></TableRow>
                        ) : (
                            projects.map((project) => (
                                <TableRow key={project._id} className="cursor-pointer hover:bg-slate-50">
                                    <TableCell className="font-medium text-structura-black">
                                        <Link href={`/admin/projects/${project._id}`} className="hover:text-structura-blue">
                                            {project.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {project.saleId?.clientReference || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={project.status} />
                                    </TableCell>
                                    <TableCell>
                                        {project.endDate ? formatDate(project.endDate) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/projects/${project._id}`}>
                                            <Button variant="ghost" size="sm">Manage</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
