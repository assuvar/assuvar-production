import { useState } from 'react';
import { Button } from '@/components/os/ui/Button';
import { X } from 'lucide-react';
import api from '@/lib/axios';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddEmployeeModal({ isOpen, onClose, onSuccess }: AddEmployeeModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        employeeId: '',
        designation: '',
        department: 'Engineering',
        employeeType: 'Permanent'
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Explicitly sending defaults for fields hidden from UI
            const payload = {
                ...formData,
                // employeeType is now in formData, so we don't hardcode it
                payrollConfig: {
                    paymentType: 'TASK',
                    rate: 0,
                    currency: 'USD'
                }
            };
            await api.post('/employees', payload);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Failed to add employee";
            alert(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold mb-4 font-display text-structura-black">Add Employee</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                            required
                            className="w-full border rounded px-3 py-2 text-sm"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
                            <input
                                required
                                className="w-full border rounded px-3 py-2 text-sm"
                                value={formData.employeeId}
                                onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                required
                                type="email"
                                className="w-full border rounded px-3 py-2 text-sm"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                            <input
                                required
                                className="w-full border rounded px-3 py-2 text-sm"
                                value={formData.designation}
                                onChange={e => setFormData({ ...formData, designation: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                            <select
                                className="w-full border rounded px-3 py-2 text-sm"
                                value={formData.employeeType}
                                onChange={e => setFormData({ ...formData, employeeType: e.target.value })}
                            >
                                <option value="Permanent">Permanent</option>
                                <option value="Apprentice">Apprentice</option>
                                <option value="Freelancer">Freelancer</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Employee'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
