import React, { useState, useEffect } from "react";
import { ExternalLink, Github, Trash, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import AdminPanel from "@/components/AdminPanel";
import AdminEditable from "@/components/AdminEditable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  tech_stack: string[];
  category: "frontend" | "backend" | "fullstack" | "other";
  github_url: string | null;
  demo_url: string | null;
  user_id: string;
}

interface SupabaseProject {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  featured: boolean | null;
}

const defaultImage = "https://images.unsplash.com/photo-1555066931-4365d14bab8c";

const ProjectCard: React.FC<{ project: Project, onDelete?: () => void, isEditable?: boolean }> = ({ 
  project, 
  onDelete,
  isEditable = false 
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: editedProject.title,
          description: editedProject.description,
          image_url: editedProject.image_url,
          github_url: editedProject.github_url,
          demo_url: editedProject.demo_url,
          tech_stack: editedProject.tech_stack
        })
        .eq('id', project.id);

      if (error) throw error;
      toast.success("Project updated successfully");
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
      return Promise.reject(error);
    }
  };

  const handleCancel = () => {
    setEditedProject(project);
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
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md group transition-shadow duration-300 p-4">
          <div className="mb-4">
            <Label>Title</Label>
            <Input 
              value={editedProject.title} 
              onChange={(e) => setEditedProject({...editedProject, title: e.target.value})} 
              className="mb-2"
            />
            
            <Label>Description</Label>
            <Textarea 
              value={editedProject.description} 
              onChange={(e) => setEditedProject({...editedProject, description: e.target.value})} 
              className="mb-2"
              rows={3}
            />
            
            <Label>Image URL</Label>
            <Input 
              value={editedProject.image_url || ''} 
              onChange={(e) => setEditedProject({...editedProject, image_url: e.target.value})} 
              className="mb-2"
            />
            
            <Label>GitHub URL</Label>
            <Input 
              value={editedProject.github_url || ''} 
              onChange={(e) => setEditedProject({...editedProject, github_url: e.target.value})} 
              className="mb-2"
            />
            
            <Label>Demo URL</Label>
            <Input 
              value={editedProject.demo_url || ''} 
              onChange={(e) => setEditedProject({...editedProject, demo_url: e.target.value})} 
              className="mb-2"
            />
            
            <Label>Category</Label>
            <select 
              value={editedProject.category} 
              onChange={(e) => setEditedProject({...editedProject, category: e.target.value as any})}
              className="w-full p-2 border rounded mb-2 bg-background"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Fullstack</option>
              <option value="other">Other</option>
            </select>
            
            <Label>Technologies (comma separated)</Label>
            <Input 
              value={editedProject.tech_stack?.join(', ') || ''} 
              onChange={(e) => setEditedProject({
                ...editedProject, 
                tech_stack: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean)
              })} 
              className="mb-2"
            />
          </div>

          {user && onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
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
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-shadow duration-300 animate-fade-in">
        <div className="h-56 overflow-hidden relative">
          <img
            src={project.image_url || defaultImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <div className="flex gap-2">
              {project.demo_url && (
                <Button size="sm" variant="secondary" asChild>
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-1 h-4 w-4" />
                    Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-2">
            {project.tech_stack?.map((tech) => (
              <span
                key={tech}
                className="bg-purple/10 text-purple px-2 py-1 rounded text-xs"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center text-gray-500">
            <span className="text-xs capitalize bg-gray-100 dark:bg-gray-700 py-1 px-2 rounded">
              {project.category}
            </span>
            {user && isEditable && onDelete && (
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </AdminEditable>
  );
};

const Projects = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'user_id'>>({
    title: '',
    description: '',
    image_url: '',
    tech_stack: [],
    category: 'frontend',
    github_url: '',
    demo_url: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) throw error;
      
      // Transform the data to match our Project interface
      const transformedData: Project[] = (data as SupabaseProject[]).map(project => ({
        ...project,
        category: (project.tech_stack && Array.isArray(project.tech_stack) && 
                 project.tech_stack.some(tech => 
                   ['react', 'vue', 'angular', 'html', 'css'].includes(tech.toLowerCase())
                 )) ? 'frontend' :
                 (project.tech_stack && Array.isArray(project.tech_stack) && 
                 project.tech_stack.some(tech => 
                   ['node', 'express', 'django', 'flask', 'php'].includes(tech.toLowerCase())
                 )) ? 'backend' :
                 (project.tech_stack && Array.isArray(project.tech_stack) && 
                 project.tech_stack.some(tech => 
                   ['react', 'vue', 'angular'].includes(tech.toLowerCase())) && 
                 project.tech_stack.some(tech => 
                   ['node', 'express', 'django', 'flask', 'php'].includes(tech.toLowerCase())
                 )) ? 'fullstack' : 'other'
      }));
      
      setProjects(transformedData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async () => {
    if (!user) return;
    
    try {
      const projectToAdd = {
        ...newProject,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert(projectToAdd)
        .select();
      
      if (error) throw error;
      
      // Transform the returned project data to match our Project interface
      const addedProject: Project = {
        ...(data[0] as SupabaseProject),
        category: newProject.category
      };
      
      setProjects([...projects, addedProject]);
      setIsDialogOpen(false);
      resetNewProject();
      toast.success('Project added successfully');
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to add project');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProjects(projects.filter(project => project.id !== id));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const resetNewProject = () => {
    setNewProject({
      title: '',
      description: '',
      image_url: '',
      tech_stack: [],
      category: 'frontend',
      github_url: '',
      demo_url: ''
    });
  };

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((project) => project.category === activeTab);

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">My Projects</h1>
            <div className="w-20 h-1 bg-purple mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Here are some of the projects I've worked on. Each project is
              unique and showcases different skills and technologies.
            </p>
          </div>

          {user && (
            <AdminPanel 
              section="projects" 
              onAdd={() => setIsDialogOpen(true)}
            />
          )}

          <Tabs
            defaultValue="all"
            className="mb-12"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="frontend">Frontend</TabsTrigger>
                <TabsTrigger value="backend">Backend</TabsTrigger>
                <TabsTrigger value="fullstack">Full Stack</TabsTrigger>
                <TabsTrigger value="other">Others</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="animate-fade-in">
              {isLoading ? (
                <div className="text-center py-10">Loading projects...</div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-10">No projects found</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onDelete={() => handleDeleteProject(project.id)}
                      isEditable={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {["frontend", "backend", "fullstack", "other"].map((category) => (
              <TabsContent key={category} value={category} className="animate-fade-in">
                {isLoading ? (
                  <div className="text-center py-10">Loading projects...</div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center py-10">No {category} projects found</div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        onDelete={() => handleDeleteProject(project.id)}
                        isEditable={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title</Label>
              <Input 
                id="title" 
                value={newProject.title} 
                onChange={(e) => setNewProject({...newProject, title: e.target.value})} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newProject.description} 
                onChange={(e) => setNewProject({...newProject, description: e.target.value})} 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input 
                  id="image_url" 
                  value={newProject.image_url || ''} 
                  onChange={(e) => setNewProject({...newProject, image_url: e.target.value})} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category"
                  value={newProject.category} 
                  onChange={(e) => setNewProject({...newProject, category: e.target.value as any})}
                  className="w-full p-2 border rounded bg-background"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Fullstack</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input 
                  id="github_url" 
                  value={newProject.github_url || ''} 
                  onChange={(e) => setNewProject({...newProject, github_url: e.target.value})} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="demo_url">Demo URL</Label>
                <Input 
                  id="demo_url" 
                  value={newProject.demo_url || ''} 
                  onChange={(e) => setNewProject({...newProject, demo_url: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tech_stack">Technologies (comma separated)</Label>
              <Input 
                id="tech_stack" 
                value={newProject.tech_stack?.join(', ') || ''} 
                onChange={(e) => setNewProject({
                  ...newProject, 
                  tech_stack: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean)
                })} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProject}>Add Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
