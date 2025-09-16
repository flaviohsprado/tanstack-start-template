import z from "zod";

export const ImageItemSchema = z.object({
   url: z.string(),
   path: z.string(),
});
export type ImageItem = z.infer<typeof ImageItemSchema>;

export const SignUpFormSchema = z.object({
   name: z.string().min(1, { message: "Nome é obrigatório" }),
   email: z.email({ message: "Email inválido" }),
   password: z.string().min(1, { message: "Senha é obrigatória" }),
});
export type SignUpFormData = z.infer<typeof SignUpFormSchema>;

export const SignInFormSchema = z.object({
   email: z.email({ message: "Email inválido" }),
   password: z.string().min(1, { message: "Senha é obrigatória" }),
});
export type SignInFormData = z.infer<typeof SignInFormSchema>;

export const PasswordFormSchema = z
   .object({
      currentPassword: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
      newPassword: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
      confirmNewPassword: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
   })
   .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "As senhas não coincidem",
      path: ["confirmNewPassword"],
   });
export type PasswordFormData = z.infer<typeof PasswordFormSchema>;

export const AddressFormSchema = z.object({
   street: z.string().min(1, { message: "Endereço é obrigatório" }),
   number: z.string().min(1, { message: "Número é obrigatório" }),
   complement: z.string().optional(),
   city: z.string().min(1, { message: "Cidade é obrigatória" }),
   state: z.string().min(1, { message: "Estado é obrigatório" }),
   zipCode: z.string().optional(),
   neighborhood: z.string().min(1, { message: "Bairro é obrigatório" }),
});
export type AddressFormData = z.infer<typeof AddressFormSchema>;

export const UserFormSchema = z.object({
   image: z.string().optional(),
   name: z.string().min(1, { message: "Nome é obrigatório" }),
   email: z.string().optional(),
   phone: z.string().optional(),
   password: z.string().min(1, { message: "Senha é obrigatória" }),
});
export const UserUpdateFormSchema = UserFormSchema.partial();
export type UserFormData = z.infer<typeof UserFormSchema>;
export type UserUpdateFormData = z.infer<typeof UserUpdateFormSchema>;
