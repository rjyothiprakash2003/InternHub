type ProfileLike = {
  name?: string | null;
  mobile?: string | null;
  dateOfBirth?: Date | string | null;
  city?: string | null;
  college?: string | null;
  course?: string | null;
  branch?: string | null;
  graduationYear?: number | null;
  technicalSkills?: string | null;
  programmingLanguages?: string | null;
  resumeUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
};

export type ProfileCompletion = {
  percent: number;
  missing: string[];
  stage: string;
};

export function computeProfileCompletion(
  userName: string,
  profile: ProfileLike | null,
): ProfileCompletion {
  const missing: string[] = [];
  let score = 0;

  const hasBasic =
    Boolean(userName) && Boolean(profile?.mobile) && Boolean(profile?.dateOfBirth) && Boolean(profile?.city);
  if (hasBasic) score += 20;
  else {
    if (!userName) missing.push("Full name");
    if (!profile?.mobile) missing.push("Mobile number");
    if (!profile?.dateOfBirth) missing.push("Date of birth");
    if (!profile?.city) missing.push("City");
  }

  const hasAcademic =
    Boolean(profile?.college) && Boolean(profile?.course) && Boolean(profile?.branch) && Boolean(profile?.graduationYear);
  if (hasAcademic) score += 20;
  else {
    if (!profile?.college) missing.push("College/University");
    if (!profile?.course) missing.push("Course");
    if (!profile?.branch) missing.push("Branch");
    if (!profile?.graduationYear) missing.push("Graduation year");
  }

  const skills = parseMaybeArray(profile?.technicalSkills);
  const langs = parseMaybeArray(profile?.programmingLanguages);
  if (skills.length > 0 || langs.length > 0) score += 20;
  else missing.push("Skills or programming languages");

  if (profile?.resumeUrl || profile?.linkedinUrl || profile?.githubUrl) score += 20;
  else missing.push("Resume or LinkedIn/GitHub");

  if (profile?.emergencyName && profile?.emergencyPhone) score += 20;
  else missing.push("Emergency contact");

  const stage =
    score >= 100
      ? "Complete"
      : score >= 80
        ? "Resume & Links"
        : score >= 60
          ? "Skills"
          : score >= 40
            ? "Academic Details"
            : "Basic Information";

  return { percent: score, missing, stage };
}

function parseMaybeArray(value?: string | null) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
}
