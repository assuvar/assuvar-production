import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/os/ui/Table";
import { Users, Briefcase } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/os/ui/Card";

interface EmployeeListProps {
    employees: any[];
}

export function EmployeeList({ employees }: EmployeeListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base text-structura-black flex items-center gap-2">
                    <Users className="h-4 w-4" /> Employee Directory
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Designation</TableHead>
                            <TableHead>Payment Mode</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center text-slate-500">No employees found.</TableCell></TableRow>
                        ) : (
                            employees.map((emp) => (
                                <TableRow key={emp._id}>
                                    <TableCell className="font-mono text-xs">{emp.employeeId}</TableCell>
                                    <TableCell className="font-medium text-structura-black">{emp.fullName}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${emp.employeeType === 'Permanent' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {emp.employeeType}
                                        </span>
                                    </TableCell>
                                    <TableCell>{emp.designation}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
                                            <Briefcase className="h-3 w-3" />
                                            {emp.payrollConfig?.paymentType || 'TASK'}
                                            {emp.payrollConfig?.rate ? ` ($${emp.payrollConfig.rate})` : ''}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
