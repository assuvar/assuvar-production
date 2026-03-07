'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Upload, ChevronRight, LayoutGrid, List, ArrowLeft, FolderOpen } from "lucide-react";
import { FileExplorer } from "@/components/os/documents/FileExplorer";
import { UploadDialog } from "@/components/os/documents/UploadDialog";

export default function DocumentsPage() {
    return (
        <Suspense fallback={<div>Loading Documents...</div>}>
            <DocumentsContent />
        </Suspense>
    );
}

function DocumentsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const currentFolder = searchParams.get('folder');
    const currentSubFolder = searchParams.get('sub');

    const [uploadOpen, setUploadOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const updateUrl = (folder: string | null, sub: string | null = null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (folder) params.set('folder', folder);
        else params.delete('folder');

        if (sub) params.set('sub', sub);
        else params.delete('sub');

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleUploadSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleFolderClick = (folder: string) => {
        updateUrl(folder, null);
    };

    const handleSubFolderClick = (sub: string | null) => {
        updateUrl(currentFolder, sub);
    };

    const goBack = () => {
        if (currentSubFolder) {
            updateUrl(currentFolder, null);
        } else {
            updateUrl(null, null);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <PageHeader
                title={currentFolder ? (currentSubFolder ? `${currentFolder} / ${currentSubFolder}` : currentFolder) : "Documents"}
                description={currentFolder ? `Viewing ${currentSubFolder || ''} documents in ${currentFolder}` : "Securely manage organization files and assets."}
            >
                <div className="flex gap-3">
                    {currentFolder && (
                        <Button variant="outline" size="sm" onClick={goBack} className="h-9 px-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Folders
                        </Button>
                    )}
                    <Button onClick={() => setUploadOpen(true)} className="h-9 px-5 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                        <Upload className="mr-2 h-4 w-4" />
                        {currentFolder ? 'Upload to this Folder' : 'Upload File'}
                    </Button>
                </div>
            </PageHeader>

            {currentFolder && (
                <div className="flex items-center gap-2 mb-2">
                    <button
                        onClick={() => updateUrl(null, null)}
                        className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-1"
                    >
                        Documents
                        <ChevronRight className="h-3 w-3" />
                    </button>
                    {currentSubFolder ? (
                        <>
                            <button
                                onClick={() => updateUrl(currentFolder, null)}
                                className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-1"
                            >
                                {currentFolder}
                                <ChevronRight className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{currentSubFolder}</span>
                        </>
                    ) : (
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{currentFolder}</span>
                    )}
                </div>
            )}

            <FileExplorer
                key={`${currentFolder}-${currentSubFolder}-${refreshTrigger}`}
                currentFolder={currentFolder}
                currentSubFolder={currentSubFolder}
                onFolderClick={handleFolderClick}
                onSubFolderClick={handleSubFolderClick}
            />

            <UploadDialog
                open={uploadOpen}
                onOpenChange={setUploadOpen}
                onUploadSuccess={handleUploadSuccess}
                defaultCategory={currentFolder}
                defaultSubCategory={currentSubFolder}
            />
        </div>
    );
}
