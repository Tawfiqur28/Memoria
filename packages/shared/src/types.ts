export type MemoryContact = {
  id?: string;
  full_name: string;
  relationship: string;
  phone_number: string;
  photo_url: string;
  memory_notes: string[];
  shared_memories: string[];
  last_interaction_at?: string;
  city?: string;
};

export type LifeFact = {
  category: string;
  fact: string;
};

export type PatientProfile = {
  id: string;
  full_name: string;
  age: number;
  hometown?: string;
  spouse_name?: string;
  children?: string[];
  pets?: string[];
  hobbies?: string[];
  daily_routine?: Array<{ time: string; activity: string }>;
  trigger_topics?: string[];
};

export type MemoryGraph = {
  patient: PatientProfile;
  contacts: MemoryContact[];
  lifeFacts: LifeFact[];
};
