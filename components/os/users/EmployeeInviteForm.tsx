'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/os/ui/Button";
import { Input } from "@/components/os/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/os/ui/Select";
import api from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EmployeeInviteForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        officialEmail: '',
        designation: '',
        countryCode: '+1', // Standard default
        mobileNumber: '',
        dateOfBirth: '',
        employeeId: '',
        joiningDate: ''
    });

    useEffect(() => {
        fetchNextId();
    }, []);

    const fetchNextId = async () => {
        try {
            const res = await api.get('/admin/next-employee-id');
            setFormData(prev => ({ ...prev, employeeId: res.data.nextId }));
        } catch (error) {
            console.error("Failed to fetch next ID", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCodeChange = (value: string) => {
        setFormData({ ...formData, countryCode: value });
    };

    const handleDesignationChange = (value: string) => {
        setFormData({ ...formData, designation: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submissionData = {
                ...formData,
                role: 'employee',
                mobileNumber: `${formData.countryCode}${formData.mobileNumber}`
            };
            const { countryCode, ...finalPayload } = submissionData;

            await api.post('/admin/invite', finalPayload);
            toast.success(`Invitation sent to ${formData.officialEmail}`);
            router.push('/admin/payroll');
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to send invitation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <Input name="fullName" placeholder="John Doe" required onChange={handleChange} value={formData.fullName} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Official Email</label>
                    <Input name="officialEmail" type="email" placeholder="john@company.com" required onChange={handleChange} value={formData.officialEmail} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Designation</label>
                    <Select value={formData.designation} onValueChange={handleDesignationChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Designation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Employee">Employee</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mobile Number</label>
                    <div className="flex items-center gap-0 w-full rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-600/20 focus-within:border-indigo-600 bg-slate-50 h-11 transition-all shadow-sm relative">
                        <Select value={formData.countryCode} onValueChange={handleCodeChange}>
                            <SelectTrigger className="w-[100px] border-none shadow-none focus:ring-0 bg-transparent h-full px-3 text-slate-700 font-medium">
                                <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="+1">🇺🇸 +1</SelectItem>
                                <SelectItem value="+44">🇬🇧 +44</SelectItem>
                                <SelectItem value="+91">🇮🇳 +91</SelectItem>
                                <SelectItem value="+971">🇦🇪 +971</SelectItem>
                                <SelectItem value="+61">🇦🇺 +61</SelectItem>
                                <SelectItem value="+65">🇸🇬 +65</SelectItem>
                                <SelectItem value="+49">🇩🇪 +49</SelectItem>
                                <SelectItem value="+33">🇫🇷 +33</SelectItem>
                                <SelectItem value="+81">🇯🇵 +81</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
                        <input
                            name="mobileNumber"
                            type="tel"
                            placeholder="Enter Mobile Number"
                            required
                            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                            value={formData.mobileNumber}
                            className="flex-1 bg-transparent border-none focus:ring-0 h-full px-4 text-slate-900 placeholder:text-slate-400 outline-none text-base"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                    <Input name="dateOfBirth" type="date" required onChange={handleChange} value={formData.dateOfBirth} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Employee ID (Auto-generated)</label>
                    <Input name="employeeId" placeholder="Generating..." disabled className="bg-slate-100 font-mono text-indigo-700 font-bold cursor-not-allowed opacity-80" value={formData.employeeId} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Joining Date</label>
                    <Input name="joiningDate" type="date" required onChange={handleChange} value={formData.joiningDate} />
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading} className="btn-fusion min-w-[140px]">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : 'Send Invitation'}
                </Button>
            </div>
        </form>
    );
}
