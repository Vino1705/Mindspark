'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';
import {ThemeToggle} from '@/components/theme-toggle';
import {useToast} from '@/hooks/use-toast';
import {deleteAllDrafts} from '@/lib/db';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SettingsPage() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const {toast} = useToast();

  useEffect(() => {
    setIsMounted(true);
    const demoMode = localStorage.getItem('contentspark-demo-mode') === 'true';
    setIsDemoMode(demoMode);
  }, []);

  const handleDemoModeToggle = (checked: boolean) => {
    setIsDemoMode(checked);
    localStorage.setItem('contentspark-demo-mode', String(checked));
    toast({
      title: 'Demo Mode Updated',
      description: `Offline demo mode has been ${
        checked ? 'enabled' : 'disabled'
      }.`,
    });
    // Force a reload to ensure all components re-evaluate the offline status
    window.location.reload();
  };

  const handleClearData = async () => {
    try {
      await deleteAllDrafts();
      localStorage.removeItem('contentspark-demo-mode');
      localStorage.removeItem('contentspark-theme');
      setIsDemoMode(false);
      toast({
        title: 'Data Cleared',
        description:
          'All local drafts and settings have been cleared. The page will now reload.',
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to clear local data.',
      });
    }
  };

  if (!isMounted) {
    return null; // or a skeleton loader
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle">Theme</Label>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Offline & Data</CardTitle>
          <CardDescription>
            Manage offline behavior and local data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="demo-mode">Force Offline/Demo Mode</Label>
              <p className="text-sm text-muted-foreground">
                Simulate offline behavior with mock AI responses.
              </p>
            </div>
            <Switch
              id="demo-mode"
              checked={isDemoMode}
              onCheckedChange={handleDemoModeToggle}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Clear Local Data</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete all saved drafts and settings.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Clear Data</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    all your saved drafts and reset your settings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>About ContentSpark</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Version 1.0.0</p>
          <p>Your AI partner for creating exceptional marketing content.</p>
          <p>Made with ❤️ by the ContentSpark Team.</p>
        </CardContent>
      </Card>
    </div>
  );
}
