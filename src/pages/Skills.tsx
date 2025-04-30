
import React, { useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import AdminPanel from '@/components/AdminPanel';
import AdminEditable from '@/components/AdminEditable';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  icon_url: string | null;
  level: number;
  category: string;
  user_id: string;
}

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id' | 'user_id'>>({
    name: '',
    icon_url: '',
    level: 75,
    category: 'Frontend Development'
  });

  // Group skills by category
  const skillCategories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryOrder = [
    'Frontend Development',
    'Backend Development',
    'Database',
    'DevOps & Tools'
  ];

  // Sort categories based on predefined order
  const sortedCategories = Object.keys(skillCategories).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*');
      
      if (error) throw error;
      
      setSkills(data as Skill[]);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!user) return;
    
    try {
      if (newSkill.level < 0 || newSkill.level > 100) {
        toast.error('Skill level must be between 0 and 100');
        return;
      }
      
      const { data, error } = await supabase
        .from('skills')
        .insert({
          ...newSkill,
          user_id: user.id
        })
        .select();
      
      if (error) throw error;
      
      setSkills([...skills, data[0] as Skill]);
      setIsDialogOpen(false);
      resetNewSkill();
      toast.success('Skill added successfully');
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setSkills(skills.filter(skill => skill.id !== id));
      toast.success('Skill deleted successfully');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    }
  };

  const resetNewSkill = () => {
    setNewSkill({
      name: '',
      icon_url: '',
      level: 75,
      category: 'Frontend Development'
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

  // Animated Skill Item Component
  const AnimatedSkillItem = ({ skill }: { skill: Skill }) => {
    const progressRef = useRef<HTMLDivElement>(null);
    const isInViewport = useInViewport(progressRef);
    const [isEditing, setIsEditing] = useState(false);
    const [editedSkill, setEditedSkill] = useState(skill);
    
    const handleSave = async () => {
      try {
        if (editedSkill.level < 0 || editedSkill.level > 100) {
          toast.error('Skill level must be between 0 and 100');
          return Promise.reject();
        }
        
        const { error } = await supabase
          .from('skills')
          .update(editedSkill)
          .eq('id', skill.id);

        if (error) throw error;
        
        // Update the skills in the parent component
        setSkills(skills.map(s => s.id === skill.id ? editedSkill : s));
        toast.success('Skill updated successfully');
        return Promise.resolve();
      } catch (error) {
        console.error('Error updating skill:', error);
        toast.error('Failed to update skill');
        return Promise.reject(error);
      }
    };

    const handleCancel = () => {
      setEditedSkill(skill);
      setIsEditing(false);
    };

    if (isEditing) {
      return (
        <AdminEditable
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        >
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="grid gap-2 mb-3">
              <Label htmlFor={`name-${skill.id}`}>Name</Label>
              <Input
                id={`name-${skill.id}`}
                value={editedSkill.name}
                onChange={(e) => setEditedSkill({...editedSkill, name: e.target.value})}
              />
              
              <Label htmlFor={`icon-${skill.id}`}>Icon URL</Label>
              <Input
                id={`icon-${skill.id}`}
                value={editedSkill.icon_url || ''}
                onChange={(e) => setEditedSkill({...editedSkill, icon_url: e.target.value})}
              />
              
              <Label htmlFor={`level-${skill.id}`}>Skill Level ({editedSkill.level}%)</Label>
              <Input
                id={`level-${skill.id}`}
                type="range"
                min="0"
                max="100"
                value={editedSkill.level}
                onChange={(e) => setEditedSkill({...editedSkill, level: parseInt(e.target.value)})}
              />
              
              <Label htmlFor={`category-${skill.id}`}>Category</Label>
              <Input
                id={`category-${skill.id}`}
                value={editedSkill.category}
                onChange={(e) => setEditedSkill({...editedSkill, category: e.target.value})}
              />
            </div>
            
            {user && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDeleteSkill(skill.id)}
              >
                <Trash className="w-4 h-4 mr-1" /> Delete
              </Button>
            )}
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
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            {skill.icon_url && (
              <img src={skill.icon_url} alt={skill.name} className="w-8 h-8 mr-3" />
            )}
            <h3 className="font-medium">{skill.name}</h3>
          </div>
          <div ref={progressRef}>
            <Progress value={isInViewport ? skill.level : 0} className="h-2" />
          </div>
          <div className="mt-1 text-right text-sm text-gray-600 dark:text-gray-400">
            {skill.level}%
          </div>
        </div>
      </AdminEditable>
    );
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">My Skills</h1>
            <div className="w-20 h-1 bg-purple mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Here's an overview of my technical skills and areas of expertise. I'm constantly learning and evolving to stay current with the latest technologies.
            </p>
          </div>

          {user && (
            <AdminPanel 
              section="skills" 
              onAdd={() => setIsDialogOpen(true)}
            />
          )}
          
          {isLoading ? (
            <div className="text-center py-10">Loading skills...</div>
          ) : (
            <>
              {/* Technical Skills */}
              {sortedCategories.length === 0 ? (
                <div className="text-center py-10">No skills found</div>
              ) : (
                sortedCategories.map((category) => (
                  <div key={category} className="mb-16">
                    <h2 className="text-2xl font-bold mb-8 flex items-center">
                      <span className="w-8 h-1 bg-purple mr-3"></span>
                      {category}
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {skillCategories[category].map((skill) => (
                        <AnimatedSkillItem key={skill.id} skill={skill} />
                      ))}
                    </div>
                  </div>
                ))
              )}
              
              {/* Learning Now - Static section */}
              <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-4">Currently Learning</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {['Next.js', 'Svelte', 'Rust', 'Machine Learning'].map((tech) => (
                    <div key={tech} className="bg-white dark:bg-gray-700 py-2 px-4 rounded-full text-sm font-medium">
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input 
                id="name" 
                value={newSkill.name} 
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="icon_url">Icon URL</Label>
              <Input 
                id="icon_url" 
                value={newSkill.icon_url || ''} 
                onChange={(e) => setNewSkill({...newSkill, icon_url: e.target.value})} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                value={newSkill.category} 
                onChange={(e) => setNewSkill({...newSkill, category: e.target.value})} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="level">Skill Level ({newSkill.level}%)</Label>
              <Input 
                id="level" 
                type="range"
                min="0"
                max="100"
                value={newSkill.level} 
                onChange={(e) => setNewSkill({...newSkill, level: parseInt(e.target.value)})} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSkill}>Add Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Skills;
