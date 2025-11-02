import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge, BookOpen, Trophy } from "lucide-react";
import PageTransition from '@/components/PageTransition';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  credentialURL: string;
  description: string;
  category: "technical" | "professional" | "academic";
}

const Certificates = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const certificatesRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const certificates: Certificate[] = [
    {
      id: 1,
      title: "Algorithms on Strings",
      issuer: "Coursera",
      date: "Feb 2024",
      credentialId: "J9JUVWG9VAVA",
      credentialURL:
        "https://www.coursera.org/account/accomplishments/verify/J9JUVWG9VAVA",
      description:
        "Full-stack web development using React, Node.js, and MongoDB",
      category: "technical",
    },
    {
      id: 2,
      title: "Python for Data Science",
      issuer: "Coursera",
      date: "Jan 2023",
      credentialId: "123abc456def",
      credentialURL: "https://coursera.org/verify/123abc456def",
      description:
        "Data analysis using Python libraries like Pandas, NumPy, and Matplotlib",
      category: "technical",
    },
    {
      id: 3,
      title: "Project Management Professional (PMP)",
      issuer: "PMI",
      date: "August 2022",
      credentialId: "PMP-123456",
      credentialURL: "https://pmi.org/certifications/verify/PMP-123456",
      description: "Globally recognized project management certification",
      category: "professional",
    },
    {
      id: 4,
      title: "Bachelor of Science in Computer Science",
      issuer: "Lovely Professional University",
      date: "2022 - 2026",
      credentialId: "LPU-CS-2026",
      credentialURL: "",
      description:
        "Four-year undergraduate program focused on computer science fundamentals, software engineering and algorithms",
      category: "academic",
    },
  ];

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

  const filteredCertificates =
    selectedCategory === "all"
      ? certificates
      : certificates.filter((cert) => cert.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical":
        return <Badge className="h-5 w-5" />;
      case "professional":
        return <Trophy className="h-5 w-5" />;
      case "academic":
        return <BookOpen className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <PageTransition background="particles" color="#33C3F0">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">My Certificates</h1>
            <div className="w-20 h-1 bg-purple mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Professional certifications and academic achievements that
              highlight my expertise and continuous learning
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <Tabs
              defaultValue="all"
              className="w-full max-w-3xl"
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <div className="flex justify-center">
                <TabsList>
                  <TabsTrigger value="all" className="px-6">
                    All
                  </TabsTrigger>
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

              <div
                ref={certificatesRef}
                className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredCertificates.map((cert, index) => (
                  <Card
                    key={cert.id}
                    className={`transform transition-all duration-500 hover:shadow-lg ${
                      isInView
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                      animationDelay: `${index * 100}ms`,
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {cert.description}
                      </p>

                      {cert.credentialId && (
                        <p className="text-xs mt-2 text-muted-foreground">
                          Credential ID: {cert.credentialId}
                        </p>
                      )}
                    </CardContent>
                    {cert.credentialURL && (
                      <CardFooter className="pt-0">
                        <a
                          href={cert.credentialURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple hover:underline inline-flex items-center"
                        >
                          View Certificate
                        </a>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Certificates;
