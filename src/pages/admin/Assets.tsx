import React from 'react';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AssetExplorer } from '../../components/admin/assets/AssetExplorer';

const Assets = () => {
    return (
        <AdminPageLayout
            title="Asset Library"
            description="Manage your images, documents, and other media files"
            fullWidth
            noPadding
        >
            <div className="h-full bg-slate-100/50 dark:bg-slate-900/50 p-6">
                <AssetExplorer />
            </div>
        </AdminPageLayout>
    );
};

export default Assets;
