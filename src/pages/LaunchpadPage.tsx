import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, BookOpen, MessageCircle, LifeBuoy } from 'lucide-react';

export const LaunchpadPage = () => {
  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hey, Jesus 👋</h1>
        <p className="text-muted-foreground">
          Let's scale your service offering with voice and automation
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subaccounts</p>
                <p className="text-2xl font-bold">1/1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Get Started Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Get Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Documentation</CardTitle>
              </div>
              <CardDescription>
                Explore our documentation, guides, API references and cook books.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Get Familiar
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Examples</CardTitle>
              </div>
              <CardDescription>
                Get inspired from examples, tutorials and how-tos along with product updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Get Inspired
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">Community</CardTitle>
              </div>
              <CardDescription>
                Join our friendly community, get help from people just like you and get in touch with us easier.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Join Skool Group
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Need Help Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded">
                  <MessageCircle className="h-5 w-5 text-red-600" />
                </div>
                <CardTitle className="text-lg">Talk to an expert</CardTitle>
              </div>
              <CardDescription>
                Need help? Have a question? Talk to a trained human directly through our chat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Open The Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded">
                  <LifeBuoy className="h-5 w-5 text-pink-600" />
                </div>
                <CardTitle className="text-lg">Give feedback</CardTitle>
              </div>
              <CardDescription>
                Missing a feature? Have a suggestion on how we can make life easier? Visit our roadmap.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Pave Our Path
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded">
                  <LifeBuoy className="h-5 w-5 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Submit a ticket</CardTitle>
              </div>
              <CardDescription>
                Notice a bug? Having trouble with a feature or functionality? Submit a ticket to our dev team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Open Help Center
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-right">
        <p className="text-xs text-muted-foreground">
          Activar Windows<br />
          Ve a Configuración para activar Windows.
        </p>
      </div>
    </div>
  );
};