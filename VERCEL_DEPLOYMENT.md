# Vercel Deployment Guide for GrowBrandi App

## Environment Variables Setup

In your Vercel project dashboard, add the following environment variable:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: `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`
   - **Environment**: Production, Preview, Development (select all)

## Alternative Environment Variable (Backup)

You can also add this for additional compatibility:
   - **Name**: `VITE_OPENROUTER_API_KEY`
   - **Value**: `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`
   - **Environment**: Production, Preview, Development (select all)

## Build Configuration

The app is configured with:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: 18.x (recommended)

## Key Fixes Applied

1. **Removed problematic headers** from OpenRouter API calls that were causing 400 errors
2. **Added CSS file** to fix 404 resource loading error
3. **Improved environment variable handling** for both development and production
4. **Added robust API key fallback** system
5. **Created vercel.json** for optimal deployment configuration

## Testing

After deployment:
1. Test the chat interface
2. Test all AI use cases (Project Estimator, Service Recommender, etc.)
3. Verify mobile responsiveness
4. Check console for any remaining errors

## Troubleshooting

If you still see errors:
1. Verify the environment variable is set correctly in Vercel dashboard
2. Check that the API key is valid and has sufficient credits
3. Redeploy the application after setting environment variables
4. Monitor Vercel function logs for detailed error messages

## Performance Notes

- The app includes Framer Motion animations optimized for mobile
- GrowBrandi branding has been applied throughout
- All AI services use the same optimized OpenRouter configuration
- Build warnings about chunk sizes are normal and don't affect functionality