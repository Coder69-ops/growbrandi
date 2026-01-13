import { ComponentType, lazy } from 'react';

/**
 * A wrapper around React.lazy that attempts to refresh the page once if the import fails.
 * This handles cases where a user has an old version of the app cached and tries to load
 * a chunk that no longer exists on the server after a new deployment.
 */
export const lazyWithRetry = <T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
) => {
    return lazy(async () => {
        const pageHasAlreadyBeenForceRefreshed = JSON.parse(
            window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
        );

        try {
            const component = await factory();
            window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
            return component;
        } catch (error: any) {
            // Check if it's a chunk load error or network error related to fetching the script
            const isChunkError =
                error.name === 'ChunkLoadError' ||
                error.message?.includes('Failed to fetch dynamically imported module') ||
                error.message?.includes('Importing a module script failed');

            if (isChunkError && !pageHasAlreadyBeenForceRefreshed) {
                // Assuming that the user is not on the latest version of the application.
                // Let's refresh the page immediately to get the new index.html.
                window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
                window.location.reload();

                // Return a never-resolving promise to prevent the error boundary from showing 
                // while the reload happens
                return new Promise(() => { });
            }

            // The page has already been reloaded or it's a different error.
            throw error;
        }
    });
};
