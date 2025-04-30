
import React, { useEffect, useRef, useState } from 'react';
import { Briefcase, School, Calendar, Plus, Trash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import AdminPanel from '@/components/AdminPanel';
import AdminEditable from '@/components/AdminEditable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  date_range: string;
  description: string[];
  type: 'work' | 'education';
  user_id: string;
}

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const [newExperience, setNewExperience] = useState<Omit<ExperienceItem, 'id' | 'user_id'>>({
    title: '',
    organization: '',
    date_range: '',
    description: [''],
    type: 'work'
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('date_range', { ascending: false });
      
      if (error) throw error;
      
      setExperiences(data as ExperienceItem[]);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast.error('Failed to load experiences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExperience = async () => {
    if (!user) return;
    
    try {
      if (newExperience.description.some(item => !item.trim())) {
        toast.error('Description items cannot be empty');
        return;
      }
      
      const { data, error } = await supabase
        .from('experiences')
        .insert({
          ...newExperience,
          user_id: user.id
        })
        .select();
      
      if (error) throw error;
      
      setExperiences([...experiences, data[0] as ExperienceItem]);
      setIsDialogOpen(false);
      resetNewExperience();
      toast.success('Experience added successfully');
    } catch (error) {
      console.error('Error adding experience:', error);
      toast.error('Failed to add experience');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setExperiences(experiences.filter(exp => exp.id !== id));
      toast.success('Experience deleted successfully');
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  const resetNewExperience = () => {
    setNewExperience({
      title: '',
      organization: '',
      date_range: '',
      description: [''],
      type: 'work'
    });
  };

  // Custom hook to detect if element is in viewport
  function useInViewport(ref: React.RefObject<Element>) {
    const [isIntersecting, setIntersecting] = React.useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIntersecting(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      
      const currentRef = ref.current;
      if (currentRef) {
        observer.observe(currentRef);
      }
      
      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, [ref]);
    
    return isIntersecting;
  }
  
  const TimelineItemComponent = ({ item, index }: { item: ExperienceItem; index: number }) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const isInViewport = useInViewport(itemRef);
    const [isEditing, setIsEditing] = useState(false);
    const [editedItem, setEditedItem] = useState(item);
    
    const handleSave = async () => {
      try {
        if (editedItem.description.some(item => !item.trim())) {
          toast.error('Description items cannot be empty');
          return Promise.reject();
        }
        
        const { error } = await supabase
          .from('experiences')
          .update(editedItem)
          .eq('id', item.id);

        if (error) throw error;
        
        // Update the experiences in the parent component
        setExperiences(experiences.map(exp => exp.id === item.id ? editedItem : exp));
        toast.success('Experience updated successfully');
        return Promise.resolve();
      } catch (error) {
        console.error('Error updating experience:', error);
        toast.error('Failed to update experience');
        return Promise.reject(error);
      }
    };

    const handleCancel = () => {
      setEditedItem(item);
      setIsEditing(false);
    };

    const updateDescription = (index: number, value: string) => {
      const newDescription = [...editedItem.description];
      newDescription[index] = value;
      setEditedItem({...editedItem, description: newDescription});
    };

    const addDescriptionItem = () => {
      setEditedItem({...editedItem, description: [...editedItem.description, '']});
    };

    const removeDescriptionItem = (index: number) => {
      const newDescription = [...editedItem.description];
      newDescription.splice(index, 1);
      if (newDescription.length === 0) newDescription.push('');
      setEditedItem({...editedItem, description: newDescription});
    };

    if (isEditing) {
      return (
        <AdminEditable
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        >
          <div ref={itemRef} className="timeline-item mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`title-${item.id}`}>Title</Label>
                <Input
                  id={`title-${item.id}`}
                  value={editedItem.title}
                  onChange={(e) => setEditedItem({...editedItem, title: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor={`organization-${item.id}`}>Organization</Label>
                <Input
                  id={`organization-${item.id}`}
                  value={editedItem.organization}
                  onChange={(e) => setEditedItem({...editedItem, organization: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor={`date_range-${item.id}`}>Date Range</Label>
                <Input
                  id={`date_range-${item.id}`}
                  value={editedItem.date_range}
                  onChange={(e) => setEditedItem({...editedItem, date_range: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor={`type-${item.id}`}>Type</Label>
                <select
                  id={`type-${item.id}`}
                  value={editedItem.type}
                  onChange={(e) => setEditedItem({...editedItem, type: e.target.value as 'work' | 'education'})}
                  className="w-full p-2 border rounded bg-background"
                >
                  <option value="work">Work</option>
                  <option value="education">Education</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label>Description</Label>
                {editedItem.description.map((desc, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={desc}
                      onChange={(e) => updateDescription(idx, e.target.value)}
                      placeholder="Description item"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => removeDescriptionItem(idx)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addDescriptionItem}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Description Item
                </Button>
              </div>
              
              {user && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteExperience(item.id)}
                >
                  <Trash className="w-4 h-4 mr-1" /> Delete
                </Button>
              )}
            </div>
          </div>
        </AdminEditable>
      );
    }
    
    return (
      <AdminEditable
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      >
        <div 
          ref={itemRef}
          className={`timeline-item ${isInViewport ? 'animate-fade-in' : 'opacity-0'}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="timeline-dot">
            <span className="absolute top-0 left-0 w-full h-full rounded-full bg-purple scale-0 transition-transform duration-500" 
              style={{ transform: isInViewport ? 'scale(1)' : 'scale(0)' }}
            />
          </div>
          
          <div className="timeline-content">
            <div className="flex gap-2 items-center mb-2">
              {item.type === 'work' ? (
                <Briefcase size={18} className="text-purple" />
              ) : (
                <School size={18} className="text-purple" />
              )}
              <h3 className="font-bold text-lg">{item.title}</h3>
            </div>
            
            <h4 className="font-medium text-purple mb-1">{item.organization}</h4>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              <Calendar size={14} className="mr-1" />
              <span>{item.date_range}</span>
            </div>
            
            <ul className="list-disc ml-4 space-y-1">
              {item.description.map((point, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AdminEditable>
    );
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Experience & Education</h1>
            <div className="w-20 h-1 bg-purple mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              My professional journey and educational background that have shaped my career as a Full Stack Developer.
            </p>
          </div>
          
          {user && (
            <AdminPanel 
              section="experiences" 
              onAdd={() => setIsDialogOpen(true)}
            />
          )}
          
          {isLoading ? (
            <div className="text-center py-10">Loading experience data...</div>
          ) : (
            <div className="relative mt-16 pl-6">
              {/* Main timeline line */}
              <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {experiences.length > 0 ? (
                  experiences.map((item, index) => (
                    <TimelineItemComponent key={item.id} item={item} index={index} />
                  ))
                ) : (
                  <div className="text-center py-10">No experience entries found</div>
                )}
              </div>
              
              {/* Timeline end */}
              {experiences.length > 0 && (
                <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2">
                  <div className="w-3 h-3 rounded-full bg-purple"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Experience</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={newExperience.title} 
                onChange={(e) => setNewExperience({...newExperience, title: e.target.value})} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="organization">Organization</Label>
              <Input 
                id="organization" 
                value={newExperience.organization} 
                onChange={(e) => setNewExperience({...newExperience, organization: e.target.value})} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date_range">Date Range</Label>
                <Input 
                  id="date_range" 
                  value={newExperience.date_range} 
                  placeholder="e.g., Jan 2020 - Present"
                  onChange={(e) => setNewExperience({...newExperience, date_range: e.target.value})} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={newExperience.type}
                  onChange={(e) => setNewExperience({...newExperience, type: e.target.value as 'work' | 'education'})}
                  className="w-full p-2 border rounded bg-background"
                >
                  <option value="work">Work</option>
                  <option value="education">Education</option>
                </select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Description Items</Label>
              {newExperience.description.map((desc, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={desc}
                    onChange={(e) => {
                      const newDesc = [...newExperience.description];
                      newDesc[idx] = e.target.value;
                      setNewExperience({...newExperience, description: newDesc});
                    }}
                    placeholder="Description item"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={() => {
                      const newDesc = [...newExperience.description];
                      newDesc.splice(idx, 1);
                      if (newDesc.length === 0) newDesc.push('');
                      setNewExperience({...newExperience, description: newDesc});
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setNewExperience({
                  ...newExperience, 
                  description: [...newExperience.description, '']
                })}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Description Item
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddExperience}>Add Experience</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Experience;
