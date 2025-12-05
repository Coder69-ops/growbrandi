import React from 'react';
import { useTranslation } from 'react-i18next';
import ServicePage from './ServicePage';

// 1. Brand Growth Page
export const BrandGrowthPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ServicePage
      title={t('service_pages.brand_growth.title')}
      description={t('service_pages.brand_growth.description')}
      features={t('service_pages.brand_growth.features', { returnObjects: true }) as string[]}
      benefits={t('service_pages.brand_growth.benefits', { returnObjects: true }) as string[]}
      technologies={t('service_pages.brand_growth.technologies', { returnObjects: true }) as string[]}
      process={t('service_pages.brand_growth.process', { returnObjects: true }) as string[]}
      pricing={t('service_pages.brand_growth.pricing', { returnObjects: true }) as any}
    />
  );
};

// 2. Social Media Content Page
export const SocialMediaContentPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ServicePage
      title={t('service_pages.social_media_content.title')}
      description={t('service_pages.social_media_content.description')}
      features={t('service_pages.social_media_content.features', { returnObjects: true }) as string[]}
      benefits={t('service_pages.social_media_content.benefits', { returnObjects: true }) as string[]}
      technologies={t('service_pages.social_media_content.technologies', { returnObjects: true }) as string[]}
      process={t('service_pages.social_media_content.process', { returnObjects: true }) as string[]}
      pricing={t('service_pages.social_media_content.pricing', { returnObjects: true }) as any}
    />
  );
};

// 3. UI/UX Design Page
export const UIUXDesignPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ServicePage
      title={t('service_pages.ui_ux_design.title')}
      description={t('service_pages.ui_ux_design.description')}
      features={t('service_pages.ui_ux_design.features', { returnObjects: true }) as string[]}
      benefits={t('service_pages.ui_ux_design.benefits', { returnObjects: true }) as string[]}
      technologies={t('service_pages.ui_ux_design.technologies', { returnObjects: true }) as string[]}
      process={t('service_pages.ui_ux_design.process', { returnObjects: true }) as string[]}
      pricing={t('service_pages.ui_ux_design.pricing', { returnObjects: true }) as any}
    />
  );
};

// 4. Web Development Page
export const WebDevelopmentPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ServicePage
      title={t('service_pages.web_development.title')}
      description={t('service_pages.web_development.description')}
      features={t('service_pages.web_development.features', { returnObjects: true }) as string[]}
      benefits={t('service_pages.web_development.benefits', { returnObjects: true }) as string[]}
      technologies={t('service_pages.web_development.technologies', { returnObjects: true }) as string[]}
      process={t('service_pages.web_development.process', { returnObjects: true }) as string[]}
      pricing={t('service_pages.web_development.pricing', { returnObjects: true }) as any}
    />
  );
};

// 5. Virtual Assistance Page
export const VirtualAssistancePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ServicePage
      title={t('service_pages.virtual_assistance.title')}
      description={t('service_pages.virtual_assistance.description')}
      features={t('service_pages.virtual_assistance.features', { returnObjects: true }) as string[]}
      benefits={t('service_pages.virtual_assistance.benefits', { returnObjects: true }) as string[]}
      technologies={t('service_pages.virtual_assistance.technologies', { returnObjects: true }) as string[]}
      process={t('service_pages.virtual_assistance.process', { returnObjects: true }) as string[]}
      pricing={t('service_pages.virtual_assistance.pricing', { returnObjects: true }) as any}
    />
  );
};

// 6. Customer Support Page
export const CustomerSupportPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ServicePage
      title={t('service_pages.customer_support.title')}
      description={t('service_pages.customer_support.description')}
      features={t('service_pages.customer_support.features', { returnObjects: true }) as string[]}
      benefits={t('service_pages.customer_support.benefits', { returnObjects: true }) as string[]}
      technologies={t('service_pages.customer_support.technologies', { returnObjects: true }) as string[]}
      process={t('service_pages.customer_support.process', { returnObjects: true }) as string[]}
      pricing={t('service_pages.customer_support.pricing', { returnObjects: true }) as any}
    />
  );
};