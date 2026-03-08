'use client';

import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Link, Image, Eraser, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface RichEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: number;
}

export function RichEditor({ value, onChange, placeholder = 'Start writing...', height = 400 }: RichEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            // Only update innerHTML if it doesn't match the current value to avoid cursor jumping
            // but we need to initialize it the first time it loads with existing content
            if (!editorRef.current.innerHTML || value === '') {
                editorRef.current.innerHTML = value;
            }
        }
    }, [value]);

    const execCmd = (command: string, arg?: string) => {
        document.execCommand(command, false, arg);
        if (editorRef.current) {
            editorRef.current.focus();
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const insertLink = () => {
        const url = prompt('Enter the link URL:');
        if (url) {
            execCmd('createLink', url);
        }
    };

    const insertImage = () => {
        const url = prompt('Enter the image URL:');
        if (url) {
            execCmd('insertImage', url);
        }
    };

    const ToolbarButton = ({ icon: Icon, onClick, title }: { icon: any, onClick: () => void, title: string }) => (
        <button
            type="button"
            onClick={(e) => { e.preventDefault(); onClick(); }}
            title={title}
            className="p-1.5 text-slate-500 hover:text-structura-blue hover:bg-blue-50 rounded transition-colors"
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className="flex flex-col border border-slate-200 rounded-lg overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
                <ToolbarButton icon={Bold} title="Bold" onClick={() => execCmd('bold')} />
                <ToolbarButton icon={Italic} title="Italic" onClick={() => execCmd('italic')} />
                <ToolbarButton icon={Underline} title="Underline" onClick={() => execCmd('underline')} />
                <ToolbarButton icon={Strikethrough} title="Strikethrough" onClick={() => execCmd('strikeThrough')} />
                <div className="w-px h-5 bg-slate-300 mx-1"></div>

                <ToolbarButton icon={AlignLeft} title="Align Left" onClick={() => execCmd('justifyLeft')} />
                <ToolbarButton icon={AlignCenter} title="Align Center" onClick={() => execCmd('justifyCenter')} />
                <ToolbarButton icon={AlignRight} title="Align Right" onClick={() => execCmd('justifyRight')} />
                <div className="w-px h-5 bg-slate-300 mx-1"></div>

                <ToolbarButton icon={List} title="Bullet List" onClick={() => execCmd('insertUnorderedList')} />
                <ToolbarButton icon={ListOrdered} title="Numbered List" onClick={() => execCmd('insertOrderedList')} />
                <div className="w-px h-5 bg-slate-300 mx-1"></div>

                <ToolbarButton icon={Link} title="Insert Link" onClick={insertLink} />
                <ToolbarButton icon={Image} title="Insert Image" onClick={insertImage} />
                <div className="w-px h-5 bg-slate-300 mx-1"></div>

                <ToolbarButton icon={Eraser} title="Remove Formatting" onClick={() => execCmd('removeFormat')} />
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                className="p-4 outline-none prose prose-sm max-w-none overflow-y-auto"
                style={{ minHeight: height, maxHeight: height * 1.5 }}
                contentEditable
                onInput={handleInput}
                onBlur={handleInput}
                data-placeholder={placeholder}
            />

            <style jsx>{`
                div[contentEditable]:empty::before {
                    content: attr(data-placeholder);
                    color: #94a3b8; /* slate-400 */
                    cursor: text;
                    pointer-events: none;
                    display: block; /* For Firefox */
                }
            `}</style>
        </div>
    );
}
