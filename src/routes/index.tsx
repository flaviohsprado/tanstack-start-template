import { Authenticated } from "@/components/auth/Authenticated";
import { SignIn } from "@/components/auth/SignIn";
import { SignUp } from "@/components/auth/SignUp";
import { useSession } from "@/lib/auth-client";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
   component: RouteComponent,
});

function RouteComponent() {
   const { data: session } = useSession();
   const [signin, setSignin] = useState(false);
   const navigate = useNavigate();

   const handleSuccess = () => {
      navigate({ to: "/" });
   };

   const handleSignInClick = () => {
      setSignin(!signin);
   };

   if (session?.user) {
      return <Authenticated email={session.user.email} username={session.user.name} />;
   }

   return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-accent-50 to-brand-primary-50 p-4">
         <div className="w-full max-w-md">
            {signin ? (
               <SignIn onSuccess={handleSuccess} onSignUpClick={handleSignInClick} />
            ) : (
               <SignUp onSuccess={handleSuccess} onSignInClick={handleSignInClick} />
            )}
         </div>
      </div>
   );
}
