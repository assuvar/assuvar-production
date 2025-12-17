import { useState, useEffect } from 'react';
import { Button } from '@/components/os/ui/Button';
import { X } from 'lucide-react';
import api from '@/lib/axios';

interface AddAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddAssignmentModal({ isOpen, onClose, onSuccess }: AddAssignmentModalProps) {
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        employeeId: '',
        name: '', // Task Name
        paymentType: 'TASK',
        amount: '' as string | number,
        deadline: ''
    });

    // Fetch employees for dropdown
    useEffect(() => {
        if (isOpen) {
            api.get('/employees').then(res => setEmployees(res.data)).catch(console.error);
        }
    }, [isOpen]);

    // Auto-fill when employee selected
    const handleEmployeeChange = (empId: string) => {
        const emp = employees.find(e => e._id === empId);
        if (emp) {
            setFormData(prev => ({
                ...prev,
                employeeId: empId,
                paymentType: emp.payrollConfig?.paymentType || 'TASK',
                amount: emp.payrollConfig?.rate || ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/payroll/assignments', {
                ...formData,
                amount: Number(formData.amount)
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Failed to assign work");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold mb-4 font-display text-structura-black">Assign Work / Task</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee</label>
                        <select
                            required
                            className="w-full border rounded px-3 py-2 text-sm"
                            value={formData.employeeId}
                            onChange={e => handleEmployeeChange(e.target.value)}
                        >
                            <option value="">-- Choose Employee --</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.fullName} ({emp.employeeId}) - {emp.employeeType}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Work / Task Name</label>
                        <input
                            required
                            placeholder="e.g. Design Homepage"
                            className="w-full border rounded px-3 py-2 text-sm"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Type</label>
                            <select
                                className="w-full border rounded px-3 py-2 text-sm"
                                value={formData.paymentType}
                                onChange={e => setFormData({ ...formData, paymentType: e.target.value })}
                            >
                                <option value="HOURLY">Hourly</option>
                                <option value="TASK">Per Task</option>
                                <option value="PROJECT">Project Based</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Amount / Rate ($)</label>
                            <input
                                type="number"
                                required
                                className="w-full border rounded px-3 py-2 text-sm"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Deadline (Optional)</label>
                        <input
                            type="date"
                            className="w-full border rounded px-3 py-2 text-sm"
                            value={formData.deadline}
                            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Assigning...' : 'Assign Work'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
