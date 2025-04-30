
import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge, BookOpen, Trophy, Plus, Trash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
  category: 'technical' | 'professional' | 'academic';
  user_id: string;
}

const Certificates = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const certificatesRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();

  const [newCertificate, setNewCertificate] = useState<Omit<Certificate, 'id' | 'user_id'>>({
    title: '',
    issuer: '',
    date: '',
    credential_id: '',
    credential_url: '',
    description: '',
    category: 'technical'
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      }
    );

    const currentRef = certificatesRef.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      setCertificates(data as Certificate[]);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCertificate = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          ...newCertificate,
          user_id: user.id
        })
        .select();
      
      if (error) throw error;
      
      setCertificates([...certificates, data[0] as Certificate]);
      setIsDialogOpen(false);
      resetNewCertificate();
      toast.success('Certificate added successfully');
    } catch (error) {
      console.error('Error adding certificate:', error);
      toast.error('Failed to add certificate');
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCertificates(certificates.filter(cert => cert.id !== id));
      toast.success('Certificate deleted successfully');
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast.error('Failed to delete certificate');
    }
  };

  const resetNewCertificate = () => {
    setNewCertificate({
      title: '',
      issuer: '',
      date: '',
      credential_id: '',
      credential_url: '',
      description: '',
      category: 'technical'
    });
  };

  const filteredCertificates = selectedCategory === "all" 
    ? certificates 
    : certificates.filter(cert => cert.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'technical': return <Badge className="h-5 w-5" />;
      case 'professional': return <Trophy className="h-5 w-5" />;
      case 'academic': return <BookOpen className="h-5 w-5" />;
      default: return null;
    }
  };

  const CertificateCard = ({ cert, index }: { cert: Certificate, index: number }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCert, setEditedCert] = useState(cert);

    const handleSave = async () => {
      try {
        const { error } = await supabase
          .from('certificates')
          .update(editedCert)
          .eq('id', cert.id);

        if (error) throw error;
        
        // Update the certificates in the parent component
        setCertificates(certificates.map(c => c.id === cert.id ? editedCert : c));
        toast.success('Certificate updated successfully');
        return Promise.resolve();
      } catch (error) {
        console.error('Error updating certificate:', error);
        toast.error('Failed to update certificate');
        return Promise.reject(error);
      }
    };

    const handleCancel = () => {
      setEditedCert(cert);
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
          <Card className="h-full">
            <CardHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input
                    value={editedCert.title}
                    onChange={(e) => setEditedCert({...editedCert, title: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Issuer</Label>
                  <Input
                    value={editedCert.issuer}
                    onChange={(e) => setEditedCert({...editedCert, issuer: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input
                    value={editedCert.date}
                    onChange={(e) => setEditedCert({...editedCert, date: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <select
                    value={editedCert.category}
                    onChange={(e) => setEditedCert({...editedCert, category: e.target.value as any})}
                    className="w-full p-2 border rounded bg-background"
                  >
                    <option value="technical">Technical</option>
                    <option value="professional">Professional</option>
                    <option value="academic">Academic</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Credential ID</Label>
                  <Input
                    value={editedCert.credential_id || ''}
                    onChange={(e) => setEditedCert({...editedCert, credential_id: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Credential URL</Label>
                  <Input
                    value={editedCert.credential_url || ''}
                    onChange={(e) => setEditedCert({...editedCert, credential_url: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editedCert.description || ''}
                    onChange={(e) => setEditedCert({...editedCert, description: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            </CardHeader>
            <CardFooter>
              {user && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteCertificate(cert.id)}
                >
                  <Trash className="w-4 h-4 mr-1" /> Delete
                </Button>
              )}
            </CardFooter>
          </Card>
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
        <Card 
          className={`transform transition-all duration-500 hover:shadow-lg ${
            isInView 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
          style={{ 
            transitionDelay: `${index * 100}ms`,
            animationDelay: `${index * 100}ms` 
          }}
        >
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <div className="h-10 w-10 rounded-full bg-purple/10 flex items-center justify-center text-purple">
              {getCategoryIcon(cert.category)}
            </div>
            <div>
              <CardTitle className="text-xl">{cert.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {cert.issuer} • {cert.date}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {cert.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{cert.description}</p>
            )}
            
            {cert.credential_id && (
              <p className="text-xs mt-2 text-muted-foreground">
                Credential ID: {cert.credential_id}
              </p>
            )}
          </CardContent>
          {cert.credential_url && (
            <CardFooter className="pt-0">
              <a 
                href={cert.credential_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-purple hover:underline inline-flex items-center"
              >
                View Certificate
              </a>
            </CardFooter>
          )}
        </Card>
      </AdminEditable>
    );
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">My Certificates</h1>
          <div className="w-20 h-1 bg-purple mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Professional certifications and academic achievements that highlight my expertise and continuous learning
          </p>
        </div>

        {user && (
          <AdminPanel 
            section="certificates" 
            onAdd={() => setIsDialogOpen(true)}
          />
        )}

        <div className="flex justify-center mb-8">
          <Tabs defaultValue="all" className="w-full max-w-3xl"
            value={selectedCategory}
            onValueChange={setSelectedCategory}>
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="all" className="px-6">All</TabsTrigger>
                <TabsTrigger value="technical" className="px-6">
                  <Badge className="mr-2 h-4 w-4" />
                  Technical
                </TabsTrigger>
                <TabsTrigger value="professional" className="px-6">
                  <Trophy className="mr-2 h-4 w-4" />
                  Professional
                </TabsTrigger>
                <TabsTrigger value="academic" className="px-6">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Academic
                </TabsTrigger>
              </TabsList>
            </div>

            {isLoading ? (
              <div className="text-center py-10">Loading certificates...</div>
            ) : (
              <div ref={certificatesRef} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCertificates.length === 0 ? (
                  <div className="text-center py-10 col-span-2">No certificates found</div>
                ) : (
                  filteredCertificates.map((cert, index) => (
                    <CertificateCard 
                      key={cert.id} 
                      cert={cert} 
                      index={index} 
                    />
                  ))
                )}
              </div>
            )}
          </Tabs>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Certificate</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Certificate Title</Label>
              <Input 
                id="title" 
                value={newCertificate.title} 
                onChange={(e) => setNewCertificate({...newCertificate, title: e.target.value})} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="issuer">Issuer</Label>
              <Input 
                id="issuer" 
                value={newCertificate.issuer} 
                onChange={(e) => setNewCertificate({...newCertificate, issuer: e.target.value})} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  value={newCertificate.date} 
                  placeholder="e.g., May 2023"
                  onChange={(e) => setNewCertificate({...newCertificate, date: e.target.value})} 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newCertificate.category}
                  onChange={(e) => setNewCertificate({...newCertificate, category: e.target.value as any})}
                  className="w-full p-2 border rounded bg-background"
                >
                  <option value="technical">Technical</option>
                  <option value="professional">Professional</option>
                  <option value="academic">Academic</option>
                </select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="credential_id">Credential ID</Label>
              <Input 
                id="credential_id" 
                value={newCertificate.credential_id || ''} 
                onChange={(e) => setNewCertificate({...newCertificate, credential_id: e.target.value})} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="credential_url">Credential URL</Label>
              <Input 
                id="credential_url" 
                value={newCertificate.credential_url || ''} 
                onChange={(e) => setNewCertificate({...newCertificate, credential_url: e.target.value})} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newCertificate.description || ''} 
                onChange={(e) => setNewCertificate({...newCertificate, description: e.target.value})} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCertificate}>Add Certificate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Certificates;
