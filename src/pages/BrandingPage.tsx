import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

export const BrandingPage = () => {
  const [brandSettings, setBrandSettings] = useState({
    companyName: 'QuickZap AI',
    brandColor: '#006ba4',
    customCSS: `/* Example:
.agency-logo-container .agency-logo {
  background-image: url(...);
  background-size: contain;
  background-position: center;
  ...
}*/`,
    documentationUrl: 'https://docs.example.com',
    theme: 'light' as 'light' | 'dark',
    logoUrl: ''
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setBrandSettings(prev => ({
          ...prev,
          logoUrl: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
      
      toast({
        title: 'Logo uploaded',
        description: 'Your logo has been uploaded successfully',
      });
    }
  };

  const handleSaveSettings = () => {
    // In a real app, you'd save to a server
    toast({
      title: 'Settings saved',
      description: 'Your branding settings have been saved successfully',
    });
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Branding</h1>
        <div className="flex items-center gap-4">
          <Button variant="link" className="text-primary p-0 h-auto">
            Brand
          </Button>
          <Button variant="ghost" className="text-muted-foreground p-0 h-auto">
            Domain
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>White Label Settings</CardTitle>
              <CardDescription>
                Customize your brand appearance and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Logo */}
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {brandSettings.logoUrl ? (
                      <img src={brandSettings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      'SCALE UP'
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </span>
                      </Button>
                    </Label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: PNG or JPG, max 5MB, optimal size 200×50px
                </p>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={brandSettings.companyName}
                  onChange={(e) => setBrandSettings(prev => ({
                    ...prev,
                    companyName: e.target.value
                  }))}
                />
              </div>

              {/* Brand Color */}
              <div className="space-y-2">
                <Label htmlFor="brand-color">Brand Color Hex Code</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="brand-color"
                    value={brandSettings.brandColor}
                    onChange={(e) => setBrandSettings(prev => ({
                      ...prev,
                      brandColor: e.target.value
                    }))}
                    className="flex-1"
                  />
                  <div 
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: brandSettings.brandColor }}
                  />
                </div>
              </div>

              {/* Custom CSS */}
              <div className="space-y-2">
                <Label htmlFor="custom-css">Custom CSS</Label>
                <p className="text-xs text-muted-foreground">
                  Customize the platform with CSS (Applies instantly after Save Settings)
                </p>
                <Textarea
                  id="custom-css"
                  value={brandSettings.customCSS}
                  onChange={(e) => setBrandSettings(prev => ({
                    ...prev,
                    customCSS: e.target.value
                  }))}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              {/* Documentation URL */}
              <div className="space-y-2">
                <Label htmlFor="docs-url">Documentation URL</Label>
                <Input
                  id="docs-url"
                  value={brandSettings.documentationUrl}
                  onChange={(e) => setBrandSettings(prev => ({
                    ...prev,
                    documentationUrl: e.target.value
                  }))}
                />
              </div>

              {/* Theme Selection */}
              <div className="space-y-2">
                <Label>Theme</Label>
                <p className="text-xs text-muted-foreground">
                  Choose a default theme
                </p>
                <RadioGroup
                  value={brandSettings.theme}
                  onValueChange={(value: 'light' | 'dark') => 
                    setBrandSettings(prev => ({ ...prev, theme: value }))
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light Theme</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">Dark Theme</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Save Button */}
              <Button onClick={handleSaveSettings} className="w-full">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-background">
                {/* Preview Header */}
                <div className="flex items-center gap-3 mb-4 pb-2 border-b">
                  <div className="w-8 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {brandSettings.logoUrl ? (
                      <img src={brandSettings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      'SCALE UP'
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search for anything..."
                        className="w-full px-3 py-1 text-sm border rounded"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Navigation */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-orange-500">🏠</span>
                    <span>Home</span>
                  </div>
                  <div className="text-xs text-muted-foreground pl-6">
                    Welcome to {brandSettings.companyName}
                  </div>
                </div>

                {/* Apply Custom CSS Preview */}
                <style>
                  {brandSettings.customCSS}
                </style>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};