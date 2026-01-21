import { Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderPageProps {
  title: string;
  description: string;
  onNavigate?: (route: string) => void;
}

export function PlaceholderPage({ title, description, onNavigate }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <Construction className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <p className="text-muted-foreground mt-1">{description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This page is currently under development. The feature will integrate functionality from both
                the O'Key marketplace and ImmoLink property management systems.
              </p>
              {onNavigate && (
                <div className="flex gap-2">
                  <Button onClick={() => onNavigate('marketplace')} variant="outline">
                    Back to Marketplace
                  </Button>
                  <Button onClick={() => onNavigate('owner-dashboard')} variant="outline">
                    Owner Dashboard
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
