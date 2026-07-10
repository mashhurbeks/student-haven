export type OnboardingData = Partial<{
  // Step 1
  firstName: string;
  lastName: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  phoneVerified: boolean;
  photo: string;
  // Step 2
  university: string;
  faculty: string;
  yearOfStudy: string;
  studentId: string;
  graduationYear: number;
  // Step 3
  city: string;
  districts: string[];
  moveInDate: string;
  stayDuration: "semester" | "1year" | "long";
  // Step 4
  budgetMin: number;
  budgetMax: number;
  splitUtilities: boolean;
  maxTotal: number;
  // Step 5
  aptShareMode: "entire" | "shared";
  roommatesCount: number;
  roomType: "private" | "shared";
  aptType: string;
  floor: string;
  furnished: "furnished" | "unfurnished" | "any";
  // Step 6
  amenities: string[];
  // Step 7
  maxDistance: number;
  transport: string[];
  maxCommute: number;
  // Step 8
  sleepSchedule: string;
  cleanliness: number;
  smoking: string;
  drinking: string;
  guests: string;
  noise: string;
  studyHabits: string;
  workSchedule: string;
  pets: string;
  cooking: string;
  personalityAxis: number; // 0 introvert - 100 extrovert
  languages: string[];
  hobbies: string[];
  // Step 9 - personality answers
  personality: Record<string, string>;
}>;

const KEY = "roomie_onboarding_data";

export function getOnboardingData(): OnboardingData {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveOnboardingData(data: OnboardingData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearOnboardingData() {
  localStorage.removeItem(KEY);
}
