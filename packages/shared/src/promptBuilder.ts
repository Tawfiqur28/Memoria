import { MemoryGraph } from "./types";

export function buildSystemPrompt(memoryGraph: MemoryGraph, now = new Date()): string {
  const { patient, contacts, lifeFacts } = memoryGraph;
  const triggerTopics = patient.trigger_topics?.length
    ? patient.trigger_topics.join(", ")
    : "none";

  const contactsJson = JSON.stringify(
    contacts.map((c) => ({
      name: c.full_name,
      relationship: c.relationship,
      phone: c.phone_number,
      notes: c.memory_notes,
      shared_memories: c.shared_memories,
      last_interaction_at: c.last_interaction_at,
    })),
  );

  const factsJson = JSON.stringify({
    hometown: patient.hometown,
    spouse: patient.spouse_name,
    children: patient.children ?? [],
    pets: patient.pets ?? [],
    hobbies: patient.hobbies ?? [],
    daily_routine: patient.daily_routine ?? [],
    additional_life_facts: lifeFacts,
  });

  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  return `You are a compassionate AI assistant for ${patient.full_name}, aged ${patient.age}. Speak warmly and simply. Never mention: ${triggerTopics}. Key people in their life: ${contactsJson}. Life facts: ${factsJson}. Today is ${date}. Current time: ${time}.`;
}
