'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface ClockTimePickerProps {
    value: string; // HH:mm (24hr internally)
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function ClockTimePicker({ value, onChange, placeholder = "e.g., 2:30 PM", className }: ClockTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [pickerMode, setPickerMode] = useState<'hours' | 'minutes'>('hours');
    const [tempTime, setTempTime] = useState({ hour: 12, min: 0, period: 'AM' });
    const [inputValue, setInputValue] = useState("");
    const popoverRef = useRef<HTMLDivElement>(null);

    const formatDisplayTime = (val: string) => {
        if (!val) return '';
        const [h, m] = val.split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
    };

    useEffect(() => {
        if (value) {
            const [h, m] = value.split(':').map(Number);
            setTempTime({
                hour: h % 12 || 12,
                min: m || 0,
                period: h >= 12 ? 'PM' : 'AM'
            });
            setInputValue(formatDisplayTime(value));
        } else {
            setInputValue("");
        }
    }, [value, isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setPickerMode('hours');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const parseInputTime = (str: string) => {
        const match = str.toLowerCase().trim().match(/^(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?$/);
        if (!match) return null;
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2] || '0', 10);
        const period = match[3];

        if (h > 23 || m > 59) return null;

        if (period === 'pm' && h < 12) h += 12;
        if (period === 'am' && h === 12) h = 0;

        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        if (!inputValue.trim()) {
            onChange('');
            setInputValue('');
            return;
        }
        const parsed = parseInputTime(inputValue);
        if (parsed) {
            onChange(parsed);
        } else {
            setInputValue(value ? formatDisplayTime(value) : "");
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleInputBlur();
            setIsOpen(false);
        }
    };

    const handleConfirm = () => {
        let h24 = tempTime.hour;
        if (tempTime.period === 'PM' && h24 !== 12) h24 += 12;
        if (tempTime.period === 'AM' && h24 === 12) h24 = 0;

        const hStr = h24.toString().padStart(2, '0');
        const mStr = tempTime.min.toString().padStart(2, '0');
        onChange(`${hStr}:${mStr}`);
        setIsOpen(false);
        setPickerMode('hours');
    };

    const getNumbers = () => {
        if (pickerMode === 'hours') {
            return [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        } else {
            return [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        }
    };

    const handleNumberClick = (num: number) => {
        if (pickerMode === 'hours') {
            setTempTime(prev => ({ ...prev, hour: num }));
            setTimeout(() => setPickerMode('minutes'), 300);
        } else {
            setTempTime(prev => ({ ...prev, min: num }));
        }
    };

    const numbers = getNumbers();
    const radius = 75; // reduced
    const center = { x: 100, y: 100 }; // reduced

    return (
        <div className="relative inline-block w-full" ref={popoverRef}>
            <div
                className={cn("flex items-center w-full border rounded-lg p-2 bg-white h-10 ring-offset-white focus-within:ring-2 focus-within:ring-structura-blue/50", className, isOpen && "ring-2 ring-structura-blue/50 border-structura-blue")}
            >
                <input
                    type="text"
                    className="flex-grow text-sm outline-none bg-transparent w-full"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                />
                <Clock
                    className="w-4 h-4 text-slate-400 ml-2 cursor-pointer hover:text-structura-blue"
                    onClick={() => setIsOpen(!isOpen)}
                />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 bg-white rounded-xl shadow-xl border border-structura-border p-4 w-[240px]">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                        <div className="flex gap-1 text-2xl font-light text-slate-700">
                            <span
                                className={cn("cursor-pointer px-1.5 rounded-lg transition-colors", pickerMode === 'hours' ? "bg-blue-50 text-structura-blue font-semibold" : "hover:bg-slate-100")}
                                onClick={() => setPickerMode('hours')}
                            >
                                {tempTime.hour.toString().padStart(2, '0')}
                            </span>
                            <span className="text-slate-300">:</span>
                            <span
                                className={cn("cursor-pointer px-1.5 rounded-lg transition-colors", pickerMode === 'minutes' ? "bg-blue-50 text-structura-blue font-semibold" : "hover:bg-slate-100")}
                                onClick={() => setPickerMode('minutes')}
                            >
                                {tempTime.min.toString().padStart(2, '0')}
                            </span>
                        </div>
                        <div className="flex flex-col text-[10px] font-bold border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                            <button
                                className={cn("px-2 py-1.5 transition-colors", tempTime.period === 'AM' ? "bg-structura-blue text-white" : "bg-white text-slate-500 hover:bg-slate-50")}
                                onClick={() => setTempTime(p => ({ ...p, period: 'AM' }))}
                            >AM</button>
                            <button
                                className={cn("px-2 py-1.5 border-t border-slate-200 transition-colors", tempTime.period === 'PM' ? "bg-structura-blue text-white" : "bg-white text-slate-500 hover:bg-slate-50")}
                                onClick={() => setTempTime(p => ({ ...p, period: 'PM' }))}
                            >PM</button>
                        </div>
                    </div>

                    <div className="relative w-[200px] h-[200px] bg-slate-50/80 border border-slate-100 rounded-full mx-auto flex items-center justify-center">
                        <div className="absolute w-1.5 h-1.5 bg-structura-blue rounded-full z-10 shadow-sm"></div>

                        {/* Needle */}
                        {(() => {
                            const val = pickerMode === 'hours' ? tempTime.hour : tempTime.min;
                            const steps = pickerMode === 'hours' ? 12 : 60;
                            const deg = (val / steps) * 360;
                            return (
                                <div
                                    className="absolute bottom-1/2 left-1/2 w-0.5 bg-structura-blue origin-bottom transition-transform duration-300 pointer-events-none"
                                    style={{ height: '70px', transform: `translateX(-50%) rotate(${deg}deg)` }}
                                >
                                    <div className="absolute -top-3 -left-[11px] w-6 h-6 bg-structura-blue/20 rounded-full border border-structura-blue/30"></div>
                                </div>
                            );
                        })()}

                        {numbers.map((num, i) => {
                            const angle = (i * (360 / numbers.length) - 90) * (Math.PI / 180);
                            const x = center.x + radius * Math.cos(angle);
                            const y = center.y + radius * Math.sin(angle);
                            const isSelected = pickerMode === 'hours' ? tempTime.hour === num || (tempTime.hour === 12 && num === 12) : tempTime.min === num;

                            return (
                                <button
                                    key={num}
                                    className={cn(
                                        "absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full flex items-center justify-center text-[13px] transition-all z-20",
                                        isSelected
                                            ? "bg-structura-blue text-white font-bold shadow-md scale-110"
                                            : "text-slate-600 font-medium hover:bg-slate-200 hover:text-slate-900"
                                    )}
                                    style={{ left: `${x}px`, top: `${y}px` }}
                                    onClick={() => handleNumberClick(num)}
                                >
                                    {num.toString().padStart(pickerMode === 'minutes' ? 2 : 1, '0')}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-5 flex justify-end gap-2 pt-1">
                        <button
                            className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => { setIsOpen(false); setPickerMode('hours'); }}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-5 py-1.5 text-xs font-bold bg-structura-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm cursor-pointer"
                            onClick={handleConfirm}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
