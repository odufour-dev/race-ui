import React, { useEffect } from 'react';
import './SynchronizationBar.css';

export default function SynchronizationBar({ hasUnsavedChanges, isSaving, handleSave }) {
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (hasUnsavedChanges && !isSaving) {
                    handleSave();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasUnsavedChanges, isSaving, handleSave]);

    return (
        <div className="sync-bar-container">
            <div 
                className={`sync-status ${hasUnsavedChanges ? 'sync-status-unsaved' : 'sync-status-saved'}`}
                aria-live="polite"
            >
                <span>{hasUnsavedChanges ? '●' : '✓'}</span>
                {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
            </div>

            <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isSaving}
                className={`sync-button ${
                    hasUnsavedChanges ? 'sync-button-active' : 'sync-button-disabled'
                } ${isSaving ? 'animate-pulse' : ''}`}
            >
                {isSaving ? 'Saving...' : 'Save (Ctrl+S)'}
            </button>
        </div>
    );
}