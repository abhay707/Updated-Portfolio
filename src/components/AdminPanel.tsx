
import React from 'react';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminPanelProps {
  section: 'projects' | 'skills' | 'experiences' | 'certificates';
  onAdd: () => void;
  children?: React.ReactNode;
}

const AdminPanel = ({ section, onAdd, children }: AdminPanelProps) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Admin Controls</h2>
        <Button onClick={onAdd}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New {section.charAt(0).toUpperCase() + section.slice(1, -1)}
        </Button>
      </div>
      {children}
    </div>
  );
};

export default AdminPanel;
