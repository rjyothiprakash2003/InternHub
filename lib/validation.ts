import { z } from "zod";

const indianMobile = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number.");

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Professional name is required."),
    email: z.string().trim().email("Enter a valid email address."),
    mobile: indianMobile,
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8),
    college: z.string().trim().min(2, "College/University is required."),
    course: z.string().trim().min(2, "Course is required."),
    branch: z.string().trim().min(2, "Branch/Specialization is required."),
    graduationYear: z.coerce.number().int().min(2020).max(2035),
    city: z.string().trim().min(2, "City is required."),
    state: z.string().trim().min(2, "State is required."),
    terms: z.literal(true, { error: "You must accept the terms." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Professional name cannot be empty."),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  mobile: indianMobile,
  email: z.string().email(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  college: z.string().trim().min(2, "College cannot be empty."),
  collegeLocation: z.string().optional(),
  course: z.string().optional(),
  branch: z.string().optional(),
  currentYear: z.string().optional(),
  graduationYear: z.coerce.number().int().optional(),
  studentIdNumber: z.string().optional(),
  technicalSkills: z.string().optional(),
  softSkills: z.string().optional(),
  programmingLanguages: z.string().optional(),
  tools: z.string().optional(),
  preferredDomainId: z.string().optional(),
  preferredType: z.string().optional(),
  preferredDurationKey: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  emergencyName: z.string().optional(),
  emergencyRelation: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

export const applicationSchema = z.object({
  internshipId: z.string().min(1),
  domainId: z.string().min(1, "Select an approved domain."),
  durationKey: z.string().min(1, "Select an approved duration."),
  startDate: z.string().min(1, "Start date is required."),
  mode: z.enum(["ONLINE", "HYBRID", "OFFLINE"]),
  professionalName: z.string().trim().min(2, "Professional name cannot be empty."),
  email: z.string().email("Email must be valid."),
  mobile: indianMobile,
  dateOfBirth: z.string().optional(),
  college: z.string().trim().min(2, "College cannot be empty."),
  course: z.string().trim().min(1),
  branch: z.string().trim().min(1),
  graduationYear: z.coerce.number().int().optional(),
  learningGoals: z.string().optional(),
  motivation: z.string().min(20, "Tell us why you want to join this internship."),
  skillLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  declaredAccurate: z.literal(true, { error: "Declaration is required." }),
  couponCode: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  mobile: indianMobile.optional().or(z.literal("")),
  subject: z.string().trim().min(3),
  message: z.string().trim().min(10),
});

export const verifySchema = z.object({
  certificateId: z.string().trim().min(8),
});
