import React from 'react';
import { Helmet } from 'react-helmet-async';
import ProjectsPreview from './ProjectsPreview';

export const PortfolioPage: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Portfolio | GrowBrandi - Digital Growth Agency</title>
                <meta name="description" content="Explore our portfolio of award-winning projects. We build digital empires with growth, content, and tech." />
            </Helmet>
            <ProjectsPreview />
        </>
    );
};

export default PortfolioPage;
