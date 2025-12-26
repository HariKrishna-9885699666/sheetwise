import { useState } from "react";
import { User, ChevronRight, Github, Linkedin, FileText, Phone, Mail, MapPin, GraduationCap, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ProfileModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 h-10 w-10 md:h-14 md:w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
      >
        <User className="h-4 w-4 md:h-6 md:w-6" />
      </Button>

      {/* Profile Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">My Profile</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <ChevronRight className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-semibold">Name:</strong>
                    <span className="ml-2 text-muted-foreground">Hari Krishna Anem</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-semibold">Phone:</strong>
                    <span className="ml-2 text-muted-foreground">+91 9885699666</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-semibold">City:</strong>
                    <span className="ml-2 text-muted-foreground">Hyderabad, India</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-semibold">Email:</strong>
                    <span className="ml-2 text-muted-foreground">anemharikrishna@gmail.com</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-semibold">Degree:</strong>
                    <span className="ml-2 text-muted-foreground">B.Tech (CSIT)</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Github className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-semibold">GitHub:</strong>
                    <a 
                      href="https://github.com/HariKrishna-9885699666/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:underline"
                    >
                      HariKrishna-9885699666
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Linkedin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-semibold">LinkedIn:</strong>
                    <a 
                      href="https://www.linkedin.com/in/anemharikrishna" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:underline"
                    >
                      anemharikrishna
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-semibold">Blog:</strong>
                    <a 
                      href="https://harikrishna.hashnode.dev/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:underline"
                    >
                      Hashnode
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <strong className="font-semibold">Portfolio:</strong>
                    <a 
                      href="https://harikrishna.netlify.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-primary hover:underline"
                    >
                      harikrishna.netlify.app
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
