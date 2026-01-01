import { z } from "zod";

const currentYear = new Date().getFullYear();

export const personalInfoSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Name must be less than 100 characters"),
  phone: z.string()
    .trim()
    .regex(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  address: z.string().max(500, "Address must be less than 500 characters").optional().or(z.literal("")),
  city: z.string().max(50, "City must be less than 50 characters").optional().or(z.literal("")),
  state: z.string().max(50, "State must be less than 50 characters").optional().or(z.literal("")),
  pincode: z.string()
    .regex(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .optional()
    .or(z.literal("")),
});

export const academicInfoSchema = z.object({
  board10th: z.string().optional().or(z.literal("")),
  percentage10th: z.string()
    .refine((val) => {
      if (!val || val === "") return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 100;
    }, "Percentage must be between 0 and 100")
    .optional()
    .or(z.literal("")),
  year10th: z.string()
    .refine((val) => {
      if (!val || val === "") return true;
      const num = parseInt(val);
      return !isNaN(num) && num >= 1950 && num <= currentYear + 1;
    }, `Year must be between 1950 and ${currentYear + 1}`)
    .optional()
    .or(z.literal("")),
  board12th: z.string().optional().or(z.literal("")),
  percentage12th: z.string()
    .refine((val) => {
      if (!val || val === "") return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 100;
    }, "Percentage must be between 0 and 100")
    .optional()
    .or(z.literal("")),
  year12th: z.string()
    .refine((val) => {
      if (!val || val === "") return true;
      const num = parseInt(val);
      return !isNaN(num) && num >= 1950 && num <= currentYear + 1;
    }, `Year must be between 1950 and ${currentYear + 1}`)
    .optional()
    .or(z.literal("")),
  stream: z.string().optional().or(z.literal("")),
});

export const courseInfoSchema = z.object({
  courseName: z.string().min(1, "Course selection is required"),
  preferredCollege: z.string().optional().or(z.literal("")),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type AcademicInfoFormData = z.infer<typeof academicInfoSchema>;
export type CourseInfoFormData = z.infer<typeof courseInfoSchema>;
