"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useId, useState } from "react";

interface SignInFormData {
   email: string;
   password: string;
}

interface SignInProps {
   onSuccess?: () => void;
   onSignUpClick?: () => void;
   onForgotPasswordClick?: () => void;
}

export function SignIn({ onSuccess, onSignUpClick, onForgotPasswordClick }: SignInProps) {
   const emailId = useId();
   const passwordId = useId();

   const [formData, setFormData] = useState<SignInFormData>({
      email: "",
      password: "",
   });
   const [showPassword, setShowPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState<Partial<SignInFormData>>({});

   const validateForm = (): boolean => {
      const newErrors: Partial<SignInFormData> = {};

      if (!formData.email) {
         newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
         newErrors.email = "Please enter a valid email address";
      }

      if (!formData.password) {
         newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
         newErrors.password = "Password must be at least 6 characters";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);
      setErrors({});

      try {
         const result = await signIn.email({
            email: formData.email,
            password: formData.password,
         });

         if (result.error) {
            setErrors({ email: "Invalid email or password" });
         } else {
            onSuccess?.();
         }
      } catch (error) {
         console.error("Sign in error:", error);
         setErrors({ email: "An error occurred. Please try again." });
      } finally {
         setIsLoading(false);
      }
   };

   const handleInputChange = (field: keyof SignInFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
         setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
   };

   return (
      <div className="w-full max-w-md mx-auto">
         <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-8">
               <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-brand-accent-600 bg-clip-text text-transparent">
                  Welcome back
               </CardTitle>
               <CardDescription className="text-muted-foreground">
                  Sign in to your account to continue
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor={emailId} className="text-sm font-medium">
                        Email address
                     </Label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                           id={emailId}
                           type="email"
                           placeholder="Enter your email"
                           value={formData.email}
                           onChange={handleInputChange("email")}
                           className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                           disabled={isLoading}
                        />
                     </div>
                     {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor={passwordId} className="text-sm font-medium">
                        Password
                     </Label>
                     <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                           id={passwordId}
                           type={showPassword ? "text" : "password"}
                           placeholder="Enter your password"
                           value={formData.password}
                           onChange={handleInputChange("password")}
                           className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                           disabled={isLoading}
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                           {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                     </div>
                     {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>

                  <Button
                     type="submit"
                     className="w-full mt-6 h-11 bg-gradient-to-r from-primary to-brand-primary-600 hover:from-primary/90 hover:to-brand-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                     disabled={isLoading}
                  >
                     {isLoading ? (
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                           Signing in...
                        </div>
                     ) : (
                        <div className="flex items-center gap-2">
                           Sign in
                           <ArrowRight className="h-4 w-4" />
                        </div>
                     )}
                  </Button>
               </form>

               <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                     Don't have an account?{" "}
                     <button
                        type="button"
                        onClick={onSignUpClick}
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                     >
                        Sign up
                     </button>
                  </p>
               </div>

               <div className="mt-4 text-center">
                  <button
                     type="button"
                     onClick={onForgotPasswordClick}
                     className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                     Forgot your password?
                  </button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
