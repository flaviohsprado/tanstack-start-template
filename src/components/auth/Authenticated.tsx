import { authClient } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface AuthenticatedProps {
   username: string;
   email: string;
}

export function Authenticated({ username, email }: AuthenticatedProps) {
   const navigate = useNavigate();
   const { signOut } = authClient;

   const handleSignOut = () => {
      signOut();
      navigate({ to: "/" });

      toast.success("You have been signed out.");
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 to-brand-accent-50">
         <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
               <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-brand-accent-600 bg-clip-text text-transparent mb-4">
                  Welcome back, {username}!
               </h1>
               <p className="text-muted-foreground text-lg">You're successfully signed in to your account.</p>
            </div>

            <div className="max-w-2xl mx-auto">
               <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
                  <CardHeader className="text-center">
                     <CardTitle className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                           <Shield className="h-6 w-6 text-brand-accent-600" />
                           Account Dashboard
                        </div>

                        <Button variant="outline" size="sm" onClick={handleSignOut}>
                           Sign Out
                        </Button>
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-brand-primary-50 rounded-lg">
                           <h3 className="font-medium text-brand-primary-800">Profile</h3>
                           <p className="text-sm text-brand-primary-600">{email}</p>
                        </div>
                        <div className="p-4 bg-brand-accent-50 rounded-lg">
                           <h3 className="font-medium text-brand-accent-800">Status</h3>
                           <p className="text-sm text-brand-accent-600">Active Account</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
