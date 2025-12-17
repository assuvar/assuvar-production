import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/os/ui/Table";
import { ClipboardList, Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/os/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/os/ui/Card";
import { StatusBadge } from "@/components/os/ui/StatusBadge";

interface WorkAssignmentsTabProps {
    assignments: any[];
    onAddClick: () => void;
}

export function WorkAssignmentsTab({ assignments, onAddClick }: WorkAssignmentsTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button onClick={onAddClick}>
                    <Plus className="mr-2 h-4 w-4" /> New Assignment
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base text-structura-black flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" /> Work Assignments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Work / Task</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Assigned Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignments.length === 0 ? (
                                <TableRow><TableCell colSpan={6} className="text-center text-slate-500">No assignments found.</TableCell></TableRow>
                            ) : (
                                assignments.map((task) => (
                                    <TableRow key={task._id}>
                                        <TableCell className="font-medium text-structura-black">
                                            {task.employeeId?.name || 'Unknown'}
                                            <div className="text-xs text-slate-400">{task.employeeId?.employeeId}</div>
                                        </TableCell>
                                        <TableCell>{task.name}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                {task.paymentType || 'TASK'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{new Date(task.assignmentDate || task.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-bold">${task.salary}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={task.status} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
