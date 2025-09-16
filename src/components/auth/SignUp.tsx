"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useId, useState } from "react";

interface SignUpFormData {
   name: string;
   email: string;
   password: string;
   confirmPassword: string;
}

interface SignUpProps {
   onSuccess?: () => void;
   onSignInClick?: () => void;
}

export function SignUp({ onSuccess, onSignInClick }: SignUpProps) {
   const nameId = useId();
   const emailId = useId();
   const passwordId = useId();
   const confirmPasswordId = useId();

   const [formData, setFormData] = useState<SignUpFormData>({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
   });
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState<Partial<SignUpFormData>>({});

   const validateForm = (): boolean => {
      const newErrors: Partial<SignUpFormData> = {};

      if (!formData.name.trim()) {
         newErrors.name = "Full name is required";
      } else if (formData.name.trim().length < 2) {
         newErrors.name = "Name must be at least 2 characters";
      }

      if (!formData.email) {
         newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
         newErrors.email = "Please enter a valid email address";
      }

      if (!formData.password) {
         newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
         newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
         newErrors.password = "Password must contain uppercase, lowercase, and number";
      }

      if (!formData.confirmPassword) {
         newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
         newErrors.confirmPassword = "Passwords do not match";
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
         const result = await signUp.email({
            email: formData.email,
            password: formData.password,
            name: formData.name,
         });

         if (result.error) {
            if (result.error.message?.includes("already exists")) {
               setErrors({ email: "An account with this email already exists" });
            } else {
               setErrors({ email: "Failed to create account. Please try again." });
            }
         } else {
            onSuccess?.();
         }
      } catch (error) {
         console.error("Sign up error:", error);
         setErrors({ email: "An error occurred. Please try again." });
      } finally {
         setIsLoading(false);
      }
   };

   const handleInputChange = (field: keyof SignUpFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
         setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
   };

   const getPasswordStrength = (password: string) => {
      if (password.length === 0) return { strength: 0, text: "" };
      if (password.length < 6) return { strength: 1, text: "Weak" };
      if (password.length < 8) return { strength: 2, text: "Fair" };
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return { strength: 2, text: "Fair" };
      return { strength: 3, text: "Strong" };
   };

   const passwordStrength = getPasswordStrength(formData.password);

   return (
      <div className="w-full max-w-md mx-auto">
         <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-8">
               <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-brand-accent-600 bg-clip-text text-transparent">
                  Create your account
               </CardTitle>
               <CardDescription className="text-muted-foreground">
                  Join us today and get started
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor={nameId} className="text-sm font-medium">
                        Full name
                     </Label>
                     <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                           id={nameId}
                           type="text"
                           placeholder="Enter your full name"
                           value={formData.name}
                           onChange={handleInputChange("name")}
                           className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                           disabled={isLoading}
                        />
                     </div>
                     {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

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
                           placeholder="Create a password"
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

                     {/* Password strength indicator */}
                     {formData.password && (
                        <div className="space-y-2">
                           <div className="flex gap-1">
                              {[1, 2, 3].map((level) => (
                                 <div
                                    key={level}
                                    className={`h-1 flex-1 rounded-full transition-colors ${
                                       level <= passwordStrength.strength
                                          ? level === 1
                                             ? "bg-red-500"
                                             : level === 2
                                               ? "bg-yellow-500"
                                               : "bg-green-500"
                                          : "bg-gray-200"
                                    }`}
                                 />
                              ))}
                           </div>
                           <p className="text-xs text-muted-foreground">
                              Password strength: {passwordStrength.text}
                           </p>
                        </div>
                     )}

                     {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor={confirmPasswordId} className="text-sm font-medium">
                        Confirm password
                     </Label>
                     <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                           id={confirmPasswordId}
                           type={showConfirmPassword ? "text" : "password"}
                           placeholder="Confirm your password"
                           value={formData.confirmPassword}
                           onChange={handleInputChange("confirmPassword")}
                           className={`pl-10 pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                           disabled={isLoading}
                        />
                        <button
                           type="button"
                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                           {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                           ) : (
                              <Eye className="h-4 w-4" />
                           )}
                        </button>
                     </div>
                     {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                     )}
                  </div>

                  <Button
                     type="submit"
                     className="w-full mt-6 h-11 bg-gradient-to-r from-brand-accent-600 to-brand-accent-700 hover:from-brand-accent-700 hover:to-brand-accent-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                     disabled={isLoading}
                  >
                     {isLoading ? (
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                           Creating account...
                        </div>
                     ) : (
                        <div className="flex items-center gap-2">
                           Create account
                           <ArrowRight className="h-4 w-4" />
                        </div>
                     )}
                  </Button>
               </form>

               <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                     Already have an account?{" "}
                     <button
                        type="button"
                        onClick={onSignInClick}
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                     >
                        Sign in
                     </button>
                  </p>
               </div>

               <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                     By creating an account, you agree to our{" "}
                     <button type="button" className="text-primary hover:underline">
                        Terms of Service
                     </button>{" "}
                     and{" "}
                     <button type="button" className="text-primary hover:underline">
                        Privacy Policy
                     </button>
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
