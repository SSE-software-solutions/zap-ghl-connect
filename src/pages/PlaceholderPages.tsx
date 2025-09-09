import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Users, BookOpen, Percent, HelpCircle, Puzzle, Settings } from 'lucide-react';

export const CommunityPage = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6" />
          <CardTitle>Community</CardTitle>
        </div>
        <CardDescription>Connect with other QuickZap users</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Join Community</Button>
      </CardContent>
    </Card>
  </div>
);

export const DocumentationPage = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6" />
          <CardTitle>Documentation</CardTitle>
        </div>
        <CardDescription>Learn how to use QuickZap effectively</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>View Docs</Button>
      </CardContent>
    </Card>
  </div>
);

export const AffiliatePage = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Percent className="h-6 w-6" />
          <CardTitle>Affiliate Program</CardTitle>
        </div>
        <CardDescription>Earn money by referring new users</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Get Started</Button>
      </CardContent>
    </Card>
  </div>
);

export const HelpPage = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <HelpCircle className="h-6 w-6" />
          <CardTitle>Help Center</CardTitle>
        </div>
        <CardDescription>Get help with QuickZap</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Contact Support</Button>
      </CardContent>
    </Card>
  </div>
);

export const IntegrationsPage = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Puzzle className="h-6 w-6" />
          <CardTitle>Integrations</CardTitle>
        </div>
        <CardDescription>Connect QuickZap with other tools</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Browse Integrations</Button>
      </CardContent>
    </Card>
  </div>
);

export const SettingsPage = () => (
  <div className="p-6">
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6" />
          <CardTitle>Settings</CardTitle>
        </div>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Button>Update Settings</Button>
      </CardContent>
    </Card>
  </div>
);

export const BrandingPage = () => {
  useEffect(() => {
    window.location.href = 'https://whop.com/joined/quickzap/tutoriales-jj8kntN8fIjX9e/app';
  }, []);
  return null;
};