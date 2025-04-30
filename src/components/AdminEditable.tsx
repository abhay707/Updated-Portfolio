
import React, { useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "./AuthProvider";

interface AdminEditableProps {
  children: React.ReactNode;
  onSave: () => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const AdminEditable = ({ 
  children, 
  onSave, 
  onCancel, 
  isEditing, 
  setIsEditing 
}: AdminEditableProps) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return <>{children}</>;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative group">
      {children}
      
      {!isEditing && user && (
        <Button
          onClick={() => setIsEditing(true)}
          size="icon"
          variant="outline"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}

      {isEditing && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <Button
            onClick={handleSave}
            size="icon"
            variant="outline"
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            onClick={onCancel}
            size="icon"
            variant="outline"
            disabled={isSaving}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminEditable;
