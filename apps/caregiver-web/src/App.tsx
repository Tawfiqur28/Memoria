import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Brain, Calendar, AlertTriangle, Plus, Mic, Volume2, X, Trash2, Clock, BookOpen, Star, Rocket, Check, Heart, ArrowLeft, Home, User } from 'lucide-react';

interface Contact {
  id: string;
  fullName: string;
  relationship: string;
  phoneNumber: string;
  photoUrl: string;
  memoryNote: string;
}

interface MemoryFact {
  id: string;
  text: string;
}

interface UploadedMemory {
  id: string;
  type: 'image' | 'text' | 'audio';
  title: string;
  content: string;
  fileUrl?: string;
  createdAt: string;
}

interface TriggerTopic {
  id: string;
  topicText: string;
}

interface HappyTopic {
  id: string;
  topicText: string;
}

interface DailyRoutine {
  id: string;
  timeOfDay: string;
  activity: string;
}

interface LegacyMessage {
  id: string;
  messageText: string;
  createdAt: string;
}

interface Patient {
  fullName: string;
  preferredName: string;
  age: number;
  language: 'en' | 'zh';
  photoUrl: string;
  isAlive: boolean;
}

type Language = 'en' | 'zh';

type TranslationKey =
  | 'patientInterface'
  | 'caregiverPortal'
  | 'goodMorning'
  | 'goodAfternoon'
  | 'goodEvening'
  | 'todaysSchedule'
  | 'memoryMoment'
  | 'topicsToAvoid'
  | 'talkToMe'
  | 'legacyMessagesAvailable'
  | 'listenNow'
  | 'memoriaDashboard'
  | 'caringFor'
  | 'contacts'
  | 'memory'
  | 'triggers'
  | 'routines'
  | 'legacy'
  | 'addContact'
  | 'addFact'
  | 'addTopic'
  | 'addRoutine'
  | 'addMessage'
  | 'testCall'
  | 'saveContact'
  | 'back'
  | 'next'
  | 'enterMemoryFact'
  | 'enterTriggerTopic'
  | 'enterTime'
  | 'enterActivity'
  | 'enterLegacyMessage'
  | 'dangerZone'
  | 'markPatientAsDeceased'
  | 'thisEnablesLegacyMode'
  | 'confirmDeceased'
  | 'contactAdded'
  | 'contactDeleted'
  | 'memoryFactAdded'
  | 'memoryFactDeleted'
  | 'triggerTopicAdded'
  | 'triggerTopicRemoved'
  | 'routineAdded'
  | 'routineDeleted'
  | 'legacyMessageSaved'
  | 'noLegacyMessages'
  | 'patientMarkedDeceased'
  | 'readCallerInfo'
  | 'speaking'
  | 'decline'
  | 'answer'
  | 'connectedWith';

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    patientInterface: 'Patient Interface',
    caregiverPortal: 'Caregiver Portal',
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    todaysSchedule: "Today's Schedule",
    memoryMoment: 'Memory Moment',
    topicsToAvoid: 'Topics to Avoid',
    talkToMe: 'Talk to Me',
    legacyMessagesAvailable: 'Legacy Messages Available',
    listenNow: 'Listen Now',
    memoriaDashboard: 'Memoria Dashboard',
    caringFor: 'Caring for',
    contacts: 'Contacts',
    memory: 'Memory',
    triggers: 'Triggers',
    routines: 'Routines',
    legacy: 'Legacy',
    addContact: 'Add Contact',
    addFact: 'Add Fact',
    addTopic: 'Add Topic',
    addRoutine: 'Add Routine',
    addMessage: 'Add Message',
    testCall: 'Test Call',
    saveContact: 'Save Contact',
    back: 'Back',
    next: 'Next',
    enterMemoryFact: 'Enter memory fact',
    enterTriggerTopic: 'Enter trigger topic',
    enterTime: 'Enter time (e.g. 07:00)',
    enterActivity: 'Enter activity',
    enterLegacyMessage: 'Enter legacy message',
    dangerZone: 'Danger Zone',
    markPatientAsDeceased: 'Mark Patient as Deceased',
    thisEnablesLegacyMode: 'This enables Legacy Mode.',
    confirmDeceased: 'Confirm before enabling legacy mode.',
    contactAdded: 'Contact added',
    contactDeleted: 'Contact deleted',
    memoryFactAdded: 'Memory fact added',
    memoryFactDeleted: 'Memory fact deleted',
    triggerTopicAdded: 'Trigger topic added',
    triggerTopicRemoved: 'Trigger topic removed',
    routineAdded: 'Routine added',
    routineDeleted: 'Routine deleted',
    legacyMessageSaved: 'Legacy message saved',
    noLegacyMessages: 'No legacy messages',
    patientMarkedDeceased: 'Patient marked deceased',
    readCallerInfo: 'Read Caller Info',
    speaking: 'Speaking...',
    decline: 'Decline',
    answer: 'Answer',
    connectedWith: 'Connected with',
  },
  zh: {
    patientInterface: '患者界面',
    caregiverPortal: '护理员门户',
    goodMorning: '早上好',
    goodAfternoon: '下午好',
    goodEvening: '晚上好',
    todaysSchedule: '今日日程',
    memoryMoment: '记忆时刻',
    topicsToAvoid: '避免的话题',
    talkToMe: '和我说话',
    legacyMessagesAvailable: '遗产留言可用',
    listenNow: '立即收听',
    memoriaDashboard: 'Memoria 仪表板',
    caringFor: '护理',
    contacts: '联系人',
    memory: '记忆',
    triggers: '触发器',
    routines: '日常',
    legacy: '遗产',
    addContact: '添加联系人',
    addFact: '添加事实',
    addTopic: '添加话题',
    addRoutine: '添加日常',
    addMessage: '添加留言',
    testCall: '测试通话',
    saveContact: '保存联系人',
    back: '返回',
    next: '下一步',
    enterMemoryFact: '输入记忆事实',
    enterTriggerTopic: '输入触发话题',
    enterTime: '输入时间（例如 07:00）',
    enterActivity: '输入活动',
    enterLegacyMessage: '输入遗产留言',
    dangerZone: '危险区域',
    markPatientAsDeceased: '标记患者为已故',
    thisEnablesLegacyMode: '这将启用遗产模式。',
    confirmDeceased: '启用遗产模式前请确认。',
    contactAdded: '联系人已添加',
    contactDeleted: '联系人已删除',
    memoryFactAdded: '记忆事实已添加',
    memoryFactDeleted: '记忆事实已删除',
    triggerTopicAdded: '触发话题已添加',
    triggerTopicRemoved: '触发话题已移除',
    routineAdded: '日常已添加',
    routineDeleted: '日常已删除',
    legacyMessageSaved: '遗产留言已保存',
    noLegacyMessages: '没有遗产留言',
    patientMarkedDeceased: '患者已标记为已故',
    readCallerInfo: '阅读来电信息',
    speaking: '正在说话...',
    decline: '拒绝',
    answer: '接听',
    connectedWith: '已连接',
  },
};

class StorageService {
  private prefix = 'memoria_';

  getProfileCreated(): boolean {
    return localStorage.getItem(this.prefix + 'profileCreated') === 'true';
  }

  setProfileCreated(value: boolean) {
    localStorage.setItem(this.prefix + 'profileCreated', String(value));
  }

  getPatient(): Patient {
    const stored = localStorage.getItem(this.prefix + 'patient');
    if (stored) return JSON.parse(stored);
    return {
      fullName: 'Margaret Chen',
      preferredName: 'Margaret',
      age: 78,
      language: 'en',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      isAlive: true,
    };
  }

  setPatient(patient: Patient) {
    localStorage.setItem(this.prefix + 'patient', JSON.stringify(patient));
  }

  getContacts(): Contact[] {
    const stored = localStorage.getItem(this.prefix + 'contacts');
    return stored ? JSON.parse(stored) : [];
  }

  setContacts(contacts: Contact[]) {
    localStorage.setItem(this.prefix + 'contacts', JSON.stringify(contacts));
  }

  getMemoryFacts(): MemoryFact[] {
    const stored = localStorage.getItem(this.prefix + 'memoryFacts');
    return stored ? JSON.parse(stored) : [];
  }

  setMemoryFacts(facts: MemoryFact[]) {
    localStorage.setItem(this.prefix + 'memoryFacts', JSON.stringify(facts));
  }

  getUploadedMemories(): UploadedMemory[] {
    const stored = localStorage.getItem(this.prefix + 'uploadedMemories');
    return stored ? JSON.parse(stored) : [];
  }

  setUploadedMemories(memories: UploadedMemory[]) {
    localStorage.setItem(this.prefix + 'uploadedMemories', JSON.stringify(memories));
  }

  getTriggerTopics(): TriggerTopic[] {
    const stored = localStorage.getItem(this.prefix + 'triggerTopics');
    return stored ? JSON.parse(stored) : [
      { id: '1', topicText: 'Financial stress' },
      { id: '2', topicText: 'Hospital visits' },
      { id: '3', topicText: 'Growing older' },
    ];
  }

  setTriggerTopics(topics: TriggerTopic[]) {
    localStorage.setItem(this.prefix + 'triggerTopics', JSON.stringify(topics));
  }

  getHappyTopics(): HappyTopic[] {
    const stored = localStorage.getItem(this.prefix + 'happyTopics');
    return stored ? JSON.parse(stored) : [
      { id: '1', topicText: 'Grandchildren' },
      { id: '2', topicText: 'Gardening' },
      { id: '3', topicText: 'Cricket' },
      { id: '4', topicText: 'Cooking' },
      { id: '5', topicText: 'Music' },
      { id: '6', topicText: 'Old friends' },
      { id: '7', topicText: 'Travel memories' },
    ];
  }

  setHappyTopics(topics: HappyTopic[]) {
    localStorage.setItem(this.prefix + 'happyTopics', JSON.stringify(topics));
  }

  getDailyRoutines(): DailyRoutine[] {
    const stored = localStorage.getItem(this.prefix + 'dailyRoutines');
    return stored ? JSON.parse(stored) : [
      { id: '1', timeOfDay: '07:00', activity: 'Wake up' },
      { id: '2', timeOfDay: '08:00', activity: 'Breakfast' },
      { id: '3', timeOfDay: '10:00', activity: 'Reading' },
      { id: '4', timeOfDay: '13:00', activity: 'Lunch' },
      { id: '5', timeOfDay: '15:00', activity: 'Garden walk' },
      { id: '6', timeOfDay: '21:00', activity: 'Bedtime' },
    ];
  }

  setDailyRoutines(routines: DailyRoutine[]) {
    localStorage.setItem(this.prefix + 'dailyRoutines', JSON.stringify(routines));
  }

  getLegacyMessages(): LegacyMessage[] {
    const stored = localStorage.getItem(this.prefix + 'legacyMessages');
    return stored ? JSON.parse(stored) : [];
  }

  setLegacyMessages(messages: LegacyMessage[]) {
    localStorage.setItem(this.prefix + 'legacyMessages', JSON.stringify(messages));
  }

  saveProfile(patient: Patient) {
    this.setPatient(patient);
    this.setProfileCreated(true);
  }
}

const storage = new StorageService();

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className={`fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-2xl px-6 py-3 font-semibold text-white shadow-xl ${type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}
    >
      {message}
    </motion.div>
  );
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }> = [];
    const colors = ['#a855f7', '#14b8a6', '#ec4899', '#f97316', '#38bdf8'];
    for (let i = 0; i < 80; i += 1) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animationFrame = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle, idx) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = particle.color + '33';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });
      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}

function useSpeechCleanup() {
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
}

function useVoiceAssistant(patientName: string, language: Language) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [response, setResponse] = useState('');

  const langCode = language === 'en' ? 'en-US' : 'zh-CN';

  useSpeechCleanup();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `${translations[language].goodMorning}, ${patientName || 'friend'}!`;
    if (hour < 17) return `${translations[language].goodAfternoon}, ${patientName || 'friend'}!`;
    return `${translations[language].goodEvening}, ${patientName || 'friend'}!`;
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
    setResponse(text);
  };

  const processCommand = (command: string) => {
    const lower = command.toLowerCase();
    if (language === 'en') {
      if (lower.includes('time')) return `It is ${format(new Date(), 'h:mm a')}`;
      if (lower.includes('remember')) return 'I will keep your memories ready for you.';
      if (lower.includes('hello') || lower.includes('hi')) return getGreeting();
      return 'Ask me about your agenda, memories, or a safe conversation topic.';
    }
    if (lower.includes('时间')) return `现在是 ${format(new Date(), 'h:mm a')}`;
    if (lower.includes('记得')) return '我会为您保存记忆。';
    if (lower.includes('你好')) return getGreeting();
    return '请问您想听今天的安排还是记忆？';
  };

  const listen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(language === 'en' ? 'Speech recognition not supported.' : '语音识别不受支持。');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = langCode;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const reply = processCommand(transcript);
      speak(reply);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return { listen, isListening, isSpeaking, response, getGreeting };
}

function ProfileModal({ onComplete, onClose, language, isCreating }: { onComplete?: () => void; onClose: () => void; language: Language; isCreating?: boolean }) {
  const [patient, setPatient] = useState<Patient>(storage.getPatient());
  const [isEditing, setIsEditing] = useState(isCreating || false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = {
    en: {
      createTitle: 'Create Memoria Profile',
      viewTitle: 'Patient Profile',
      instructions: 'Enter patient details to get started.',
      fullName: 'Full Name',
      preferredName: 'Preferred Name',
      age: 'Age',
      language: 'Language',
      photoUrl: 'Photo',
      status: 'Status',
      alive: 'Alive',
      deceased: 'Deceased',
      edit: 'Edit Profile',
      save: 'Save Changes',
      saveProfile: 'Save Profile',
      cancel: 'Cancel',
      close: 'Close',
      uploadPhoto: '📷 Upload Photo',
      changePhoto: '📷 Change Photo',
    },
    zh: {
      createTitle: '创建 Memoria 资料',
      viewTitle: '患者资料',
      instructions: '输入患者信息以开始使用。',
      fullName: '全名',
      preferredName: '昵称',
      age: '年龄',
      language: '语言',
      photoUrl: '照片',
      status: '状态',
      alive: '在世',
      deceased: '已故',
      edit: '编辑资料',
      save: '保存修改',
      saveProfile: '保存资料',
      cancel: '取消',
      close: '关闭',
      uploadPhoto: '📷 上传照片',
      changePhoto: '📷 更改照片',
    }
  }[language];

  const handlePhotoUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPatient({ ...patient, photoUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!patient.fullName || !patient.preferredName || !patient.age) return;
    if (isCreating) {
      storage.saveProfile(patient);
      onComplete?.();
    } else {
      storage.setPatient(patient);
      setIsEditing(false);
    }
  };

  if (isCreating) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-xl rounded-3xl bg-gray-900 p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-3">{t.createTitle}</h2>
          <p className="text-gray-400 mb-6">{t.instructions}</p>
          <div className="grid gap-4">
            <input value={patient.fullName} onChange={e => setPatient({ ...patient, fullName: e.target.value })} placeholder={t.fullName} className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white" />
            <input value={patient.preferredName} onChange={e => setPatient({ ...patient, preferredName: e.target.value })} placeholder={t.preferredName} className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white" />
            <div className="grid gap-4 md:grid-cols-2">
              <input type="number" value={patient.age || ''} onChange={e => setPatient({ ...patient, age: parseInt(e.target.value, 10) || 0 })} placeholder={t.age} className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white" />
              <select value={patient.language} onChange={e => setPatient({ ...patient, language: e.target.value as Language })} className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white">
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </div>
            <div>
              <button onClick={() => fileInputRef.current?.click()} className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white hover:bg-gray-700 transition-all">
                {patient.photoUrl ? t.changePhoto : t.uploadPhoto}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={e => handlePhotoUpload(e.target.files?.[0])} />
              {patient.photoUrl && (
                <img src={patient.photoUrl} alt="Preview" className="mt-3 w-32 h-32 rounded-2xl object-cover mx-auto border border-gray-700" />
              )}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={handleSave} className="flex-1 rounded-2xl bg-purple-600 px-4 py-3 text-white hover:bg-purple-700">{t.saveProfile}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-gray-900 rounded-3xl max-w-md w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-purple-600 to-teal-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{t.viewTitle}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {patient.photoUrl && !isEditing && (
            <div className="flex justify-center">
              <img src={patient.photoUrl} alt={patient.preferredName} className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-500" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t.fullName}</label>
            {isEditing ? (
              <input
                type="text"
                value={patient.fullName}
                onChange={e => setPatient({ ...patient, fullName: e.target.value })}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-white"
              />
            ) : (
              <p className="text-white text-lg">{patient.fullName || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t.preferredName}</label>
            {isEditing ? (
              <input
                type="text"
                value={patient.preferredName}
                onChange={e => setPatient({ ...patient, preferredName: e.target.value })}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-white"
              />
            ) : (
              <p className="text-white text-lg">{patient.preferredName || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t.age}</label>
            {isEditing ? (
              <input
                type="number"
                value={patient.age || ''}
                onChange={e => setPatient({ ...patient, age: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-white"
              />
            ) : (
              <p className="text-white text-lg">{patient.age || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t.language}</label>
            {isEditing ? (
              <select
                value={patient.language}
                onChange={e => setPatient({ ...patient, language: e.target.value as Language })}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-white"
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            ) : (
              <p className="text-white text-lg">{patient.language === 'en' ? 'English' : '中文'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{t.status}</label>
            <p className={`text-lg font-semibold ${patient.isAlive ? 'text-green-400' : 'text-gray-500'}`}>
              {patient.isAlive ? t.alive : t.deceased}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                  {t.save}
                </button>
                <button onClick={() => setIsEditing(false)} className="flex-1 rounded-xl bg-gray-700 px-4 py-2 text-white hover:bg-gray-600">
                  {t.cancel}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full rounded-xl bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                {t.edit}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LearnMoreModal({ onClose, language }: { onClose: () => void; language: Language }) {
  const content = {
    en: {
      title: 'How Memoria Works',
      subtitle: 'The AI that remembers everything',
      overview: 'Memoria is a gentle AI companion designed specifically for Alzheimer\'s patients and their caregivers. It combines memory preservation, caller identification, daily routine management, and legacy messaging into one simple interface.',
      features: [
        {
          title: '📞 Knows Every Caller',
          description: 'When someone calls, Memoria displays their photo, name, relationship, and a personal memory note. The AI reads this information aloud before the patient answers, reducing anxiety and confusion.',
          details: ['Face recognition', 'Voice explanation', 'Relationship context', 'Personal memory notes']
        },
        {
          title: '🧠 Living Memory',
          description: 'Stores life stories, happy moments, daily routines, and important people. Rotates memory facts daily to keep their identity alive and provides conversation starters for family and caregivers.',
          details: ['Life story storage', 'Daily memory rotation', 'Photo & audio uploads', 'Voice reminders']
        },
        {
          title: '💝 Immortal Legacy',
          description: 'Caregivers can record messages that continue to play after the patient passes. This provides ongoing comfort, guidance, and connection even when family is no longer physically present.',
          details: ['Pre-recorded messages', 'Post-death access', 'Voice of loved ones', 'Eternal connection']
        },
        {
          title: '🎤 Voice Assistant',
          description: 'AI-powered voice assistant that responds to questions, reads the daily schedule, shares memories, and provides companionship. Works entirely by voice - no typing needed for patients.',
          details: ['Speech recognition', 'Natural responses', 'Time & date', 'Memory recall']
        },
        {
          title: '📅 Daily Routine',
          description: 'Maintains a consistent daily schedule that appears on the patient interface. Reduces anxiety by showing what happens next and helps caregivers track activities.',
          details: ['Visual timeline', 'Customizable activities', 'Time reminders', 'Structure & routine']
        },
        {
          title: '⚠️ Trigger Topics',
          description: 'Caregivers can flag topics that cause distress. These appear as red warning badges on the patient interface, helping everyone avoid painful conversations.',
          details: ['Red warning badges', 'Custom topics', 'Protect patient wellbeing', 'Caregiver managed']
        }
      ],
      howToUse: {
        title: '🚀 How to Get Started',
        steps: [
          { step: 1, text: 'Create a profile for your loved one with their name, photo, and language preference' },
          { step: 2, text: 'Add important contacts (family, friends, doctors) with photos and memory notes' },
          { step: 3, text: 'Save life memories, happy moments, and facts about their life story' },
          { step: 4, text: 'Set up daily routines and mark topics to avoid' },
          { step: 5, text: 'Record legacy messages for post-death comfort' },
          { step: 6, text: 'Let your loved one use the voice assistant for daily support' }
        ]
      },
      whyMemoria: {
        title: '✨ Why Memoria?',
        points: [
          'Reduces anxiety from unrecognized phone calls',
          'Preserves precious memories forever',
          'Provides structure and routine for dementia patients',
          'Allows caregivers to manage everything from one portal',
          'Continues providing comfort even after passing',
          '100% private - all data stays on your device',
          'Free to use, no subscription required'
        ]
      },
      close: 'Close'
    },
    zh: {
      title: 'Memoria 工作原理',
      subtitle: '记住一切的AI',
      overview: 'Memoria 是一款专为阿尔茨海默病患者及其护理人员设计的温和AI伴侣。它将记忆保存、来电识别、日常行程管理和遗产留言整合到一个简单的界面中。',
      features: [
        {
          title: '📞 识别每一位来电者',
          description: '当有人来电时，Memoria会显示他们的照片、姓名、关系和个人记忆笔记。AI会在患者接听前朗读这些信息，减少焦虑和困惑。',
          details: ['面部识别', '语音解释', '关系背景', '个人记忆笔记']
        },
        {
          title: '🧠 活着的记忆',
          description: '存储生活故事、快乐时刻、日常行程和重要人物。每天轮换记忆事实，保持他们的身份认同，为家人和护理人员提供对话话题。',
          details: ['生活故事存储', '每日记忆轮换', '照片和音频上传', '语音提醒']
        },
        {
          title: '💝 永恒的遗产',
          description: '护理人员可以录制留言，在患者离世后继续播放。即使家人不再物理存在，也能提供持续的安慰、指导和支持。',
          details: ['预录留言', '离世后访问', '亲人的声音', '永恒的连接']
        },
        {
          title: '🎤 语音助手',
          description: 'AI驱动的语音助手，回答问题、阅读每日行程、分享记忆并提供陪伴。完全通过语音操作 - 患者无需打字。',
          details: ['语音识别', '自然回复', '时间和日期', '记忆回忆']
        },
        {
          title: '📅 日常行程',
          description: '在患者界面显示一致的日常行程。通过展示接下来要发生的事情来减少焦虑，并帮助护理人员跟踪活动。',
          details: ['可视化时间线', '可自定义活动', '时间提醒', '结构和常规']
        },
        {
          title: '⚠️ 避免的话题',
          description: '护理人员可以标记会引起痛苦的话题。这些话题会在患者界面上显示为红色警告标签，帮助所有人避免痛苦的对话。',
          details: ['红色警告标签', '自定义话题', '保护患者', '护理人员管理']
        }
      ],
      howToUse: {
        title: '🚀 如何开始使用',
        steps: [
          { step: 1, text: '为您的亲人创建个人资料，包括姓名、照片和语言偏好' },
          { step: 2, text: '添加重要联系人（家人、朋友、医生），附上照片和记忆笔记' },
          { step: 3, text: '保存生活记忆、快乐时刻和他们人生故事中的事实' },
          { step: 4, text: '设置日常行程并标记要避免的话题' },
          { step: 5, text: '录制离世后的遗产留言' },
          { step: 6, text: '让您的亲人使用语音助手获得日常支持' }
        ]
      },
      whyMemoria: {
        title: '✨ 为什么选择 Memoria？',
        points: [
          '减少未知来电带来的焦虑',
          '永远保存珍贵的记忆',
          '为失智症患者提供结构和常规',
          '护理人员从一个门户管理一切',
          '即使离世后也能继续提供安慰',
          '100%隐私 - 所有数据保存在您的设备上',
          '免费使用，无需订阅'
        ]
      },
      close: '关闭'
    }
  };

  const t = content[language];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 30 }}
        className="bg-gray-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-purple-600 to-teal-600 p-8 rounded-t-3xl sticky top-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">{t.title}</h2>
              <p className="text-purple-100 mt-1">{t.subtitle}</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"><X size={20} /></button>
          </div>
        </div>
        <div className="p-6 border-b border-gray-800 bg-gray-900/50">
          <p className="text-gray-300 text-lg leading-relaxed">{t.overview}</p>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Star className="text-yellow-500" size={28} />Core Features</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {t.features.map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700 hover:border-purple-500/50 transition-all">
                <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{feature.description}</p>
                <div className="flex flex-wrap gap-2">
                  {feature.details.map((detail, i) => (
                    <span key={i} className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full">{detail}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-gradient-to-r from-purple-900/20 to-teal-900/20">
          <h3 className="text-2xl font-bold text-white mb-5 flex items-center gap-2"><Rocket className="text-purple-400" size={28} />{t.howToUse.title}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.howToUse.steps.map((step) => (
              <div key={step.step} className="flex items-start gap-3 bg-gray-800/30 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">{step.step}</div>
                <p className="text-gray-300 text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-5 flex items-center gap-2"><Heart className="text-pink-500" size={28} />{t.whyMemoria.title}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {t.whyMemoria.points.map((point, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-300">
                <Check className="text-green-500" size={18} />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-gray-800 bg-gray-900/50 rounded-b-3xl">
          <button onClick={onClose} className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white py-3 rounded-xl font-semibold transition-all">{t.close}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============ NAVIGATION BAR ============
function NavigationBar({
  onBack,
  onHome,
  onProfile,
  currentView,
  language
}: {
  onBack: () => void;
  onHome: () => void;
  onProfile: () => void;
  currentView: 'landing' | 'patient' | 'caregiver';
  language: Language;
}) {
  const t = {
    en: { back: 'Back', home: 'Home', profile: 'Profile' },
    zh: { back: '返回', home: '首页', profile: '个人资料' }
  }[language];

  // Don't show navigation bar on landing page
  if (currentView === 'landing') return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="flex gap-3 bg-gray-900/95 backdrop-blur-lg rounded-2xl p-2 border border-gray-700 shadow-2xl shadow-purple-500/20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-all duration-200 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-medium hidden sm:inline">{t.back}</span>
        </button>

        <button
          onClick={onHome}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600 text-white transition-all duration-200 group shadow-lg shadow-purple-500/30"
        >
          <Home size={18} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium hidden sm:inline">{t.home}</span>
        </button>

        <button
          onClick={onProfile}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-all duration-200 group"
        >
          <User size={18} className="group-hover:scale-110 transition-transform" />
          <span className="font-medium hidden sm:inline">{t.profile}</span>
        </button>
      </div>
    </motion.div>
  );
}

function LandingPage({ onStart }: { onStart: () => void }) {
  const [language, setLanguage] = useState<Language>('en');
  const [showLearnMore, setShowLearnMore] = useState(false);
  const copy = {
    en: {
      title: 'Memoria',
      subtitle: 'The companion that keeps your loved one connected to memory.',
      description: 'A gentle AI assistant for caregivers and patients with Alzheimer’s.',
      start: 'Start Now',
      learnMore: 'Learn More',
    },
    zh: {
      title: 'Memoria',
      subtitle: '让您的亲人随时与记忆相连。',
      description: '为护理者和患者提供温柔的 AI 助手。',
      start: '开始',
      learnMore: '了解更多',
    },
  } as const;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <ParticleBackground />
      <div className="relative z-10 flex min-h-screen flex-col justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-teal-300">Caregiver & Memory Assistant</p>
          <h1 className="text-5xl font-bold sm:text-6xl">{copy[language].title}</h1>
          <p className="mt-6 text-xl text-gray-300">{copy[language].subtitle}</p>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">{copy[language].description}</p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button onClick={onStart} className="rounded-full bg-gradient-to-r from-purple-600 to-teal-500 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-purple-500/20 hover:brightness-110">{copy[language].start}</button>
            <button onClick={() => setShowLearnMore(true)} className="rounded-full bg-white/10 px-8 py-4 text-lg font-semibold text-white hover:bg-white/20 transition-all border border-white/20">{copy[language].learnMore}</button>
          </div>
          <div className="mt-6 text-sm text-gray-500">Language: <button onClick={() => setLanguage('en')} className={language === 'en' ? 'font-bold text-white' : 'text-gray-400'}>EN</button> / <button onClick={() => setLanguage('zh')} className={language === 'zh' ? 'font-bold text-white' : 'text-gray-400'}>中文</button></div>
        </div>
      </div>
      <AnimatePresence>{showLearnMore && <LearnMoreModal onClose={() => setShowLearnMore(false)} language={language} />}</AnimatePresence>
    </div>
  );
}

// ============ MEMORY PAGE (Step 3 of Onboarding) ============
function MemoryPage({ onNext, onBack, language }: { onNext: () => void; onBack: () => void; language: Language }) {
  const [step] = useState(3); // Step 3 for memories
  const [career, setCareer] = useState('');
  const [home, setHome] = useState('');
  const [favoriteMemory, setFavoriteMemory] = useState('');
  const [triggerTopics, setTriggerTopics] = useState<TriggerTopic[]>(storage.getTriggerTopics());
  const [happyTopics, setHappyTopics] = useState<HappyTopic[]>(storage.getHappyTopics());
  const [newTrigger, setNewTrigger] = useState('');
  const [newHappy, setNewHappy] = useState('');

  const t = {
    en: {
      identity: 'Identity',
      people: 'People',
      memories: 'Memories',
      routine: 'Routine',
      lifeStory: 'LIFE STORY',
      career: 'Career',
      home: 'Home',
      favoriteMemory: 'Favourite memory',
      topicsToAvoid: 'TOPICS TO AVOID',
      happyTopics: 'HAPPY TOPICS TO BRING UP',
      back: 'Back',
      continue: 'Continue →',
      careerPlaceholder: 'e.g. "School teacher for 30 years in Dhaka"',
      homePlaceholder: 'e.g. "Grew up in Chittagong, moved to Dhaka in 1985"',
      favoriteMemoryPlaceholder: 'e.g. "Loved cooking hilsa fish on rainy Sundays"',
      addTrigger: 'Add a topic to avoid...',
      addHappy: 'Add a happy topic...',
      add: 'Add',
    },
    zh: {
      identity: '身份',
      people: '家人',
      memories: '记忆',
      routine: '日常',
      lifeStory: '人生故事',
      career: '职业',
      home: '家乡',
      favoriteMemory: '最喜欢的记忆',
      topicsToAvoid: '要避免的话题',
      happyTopics: '可以提起的快乐话题',
      back: '返回',
      continue: '继续 →',
      careerPlaceholder: '例如："在达卡担任30年教师"',
      homePlaceholder: '例如："在吉大港长大，1985年迁居达卡"',
      favoriteMemoryPlaceholder: '例如："喜欢在下雨的周日烹饪希鲁鱼"',
      addTrigger: '添加要避免的话题...',
      addHappy: '添加快乐话题...',
      add: '添加',
    }
  }[language];

  const addTriggerTopic = () => {
    if (newTrigger.trim()) {
      setTriggerTopics([...triggerTopics, { id: Date.now().toString(), topicText: newTrigger.trim() }]);
      setNewTrigger('');
    }
  };

  const removeTriggerTopic = (id: string) => {
    setTriggerTopics(triggerTopics.filter(topic => topic.id !== id));
  };

  const addHappyTopic = () => {
    if (newHappy.trim()) {
      setHappyTopics([...happyTopics, { id: Date.now().toString(), topicText: newHappy.trim() }]);
      setNewHappy('');
    }
  };

  const removeHappyTopic = (id: string) => {
    setHappyTopics(happyTopics.filter(topic => topic.id !== id));
  };

  const handleContinue = () => {
    const memoryFacts: MemoryFact[] = [];
    if (career) memoryFacts.push({ id: Date.now().toString() + '_career', text: career });
    if (home) memoryFacts.push({ id: Date.now().toString() + '_home', text: home });
    if (favoriteMemory) memoryFacts.push({ id: Date.now().toString() + '_favorite', text: favoriteMemory });
    storage.setMemoryFacts(memoryFacts);
    storage.setTriggerTopics(triggerTopics);
    storage.setHappyTopics(happyTopics);
    onNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-3">
            {[
              { num: 1, label: t.identity },
              { num: 2, label: t.people },
              { num: 3, label: t.memories },
              { num: 4, label: t.routine }
            ].map(item => (
              <div key={item.num} className="text-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-all ${
                  step >= item.num ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-500'
                }`}>
                  {item.num}
                </div>
                <p className={`text-xs mt-2 ${step >= item.num ? 'text-purple-400' : 'text-gray-600'}`}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-600 to-teal-600 transition-all duration-500" style={{ width: '75%' }} />
          </div>
        </div>

        {/* LIFE STORY Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-6 tracking-wide">{t.lifeStory}</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-purple-400 mb-2">{t.career}</h2>
            <input
              type="text"
              value={career}
              onChange={e => setCareer(e.target.value)}
              placeholder={t.careerPlaceholder}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-purple-400 mb-2">{t.home}</h2>
            <input
              type="text"
              value={home}
              onChange={e => setHome(e.target.value)}
              placeholder={t.homePlaceholder}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-purple-400 mb-2">{t.favoriteMemory}</h2>
            <input
              type="text"
              value={favoriteMemory}
              onChange={e => setFavoriteMemory(e.target.value)}
              placeholder={t.favoriteMemoryPlaceholder}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* TOPICS TO AVOID Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-red-400 mb-4 tracking-wide">{t.topicsToAvoid}</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {triggerTopics.map(topic => (
              <span
                key={topic.id}
                className="bg-red-900/40 text-red-300 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-red-500/30"
              >
                {topic.topicText}
                <button
                  onClick={() => removeTriggerTopic(topic.id)}
                  className="hover:text-red-200 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newTrigger}
              onChange={e => setNewTrigger(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addTriggerTopic()}
              placeholder={t.addTrigger}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={addTriggerTopic}
              className="px-4 py-2 bg-red-600/50 hover:bg-red-600 text-white rounded-xl transition-colors"
            >
              {t.add}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* HAPPY TOPICS TO BRING UP Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-green-400 mb-4 tracking-wide">{t.happyTopics}</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {happyTopics.map(topic => (
              <span
                key={topic.id}
                className="bg-green-900/40 text-green-300 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-green-500/30"
              >
                {topic.topicText}
                <button
                  onClick={() => removeHappyTopic(topic.id)}
                  className="hover:text-green-200 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newHappy}
              onChange={e => setNewHappy(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addHappyTopic()}
              placeholder={t.addHappy}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={addHappyTopic}
              className="px-4 py-2 bg-green-600/50 hover:bg-green-600 text-white rounded-xl transition-colors"
            >
              {t.add}
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-10 pt-4 border-t border-gray-800">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-800 rounded-xl text-white font-semibold hover:bg-gray-700 transition-all flex items-center gap-2"
          >
            ← {t.back}
          </button>
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-purple-600 rounded-xl text-white font-semibold hover:bg-purple-700 transition-all flex items-center gap-2"
          >
            {t.continue}
          </button>
        </div>
      </div>
    </div>
  );
}

function MemoryUpload({ showToast }: { showToast: (message: string, type: 'success' | 'error') => void }) {
  const [memories, setMemories] = useState<UploadedMemory[]>(storage.getUploadedMemories());
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'text' | 'image' | 'audio'>('text');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const saveMemory = () => {
    if (!title || (!content && type === 'text')) {
      showToast('Fill memory title and content.', 'error');
      return;
    }

    const next = [...memories, { id: Date.now().toString(), type, title, content, createdAt: new Date().toISOString() }];
    storage.setUploadedMemories(next);
    setMemories(next);
    setTitle('');
    setContent('');
    showToast('Memory saved.', 'success');
  };

  const deleteMemory = (id: string) => {
    const next = memories.filter(item => item.id !== id);
    storage.setUploadedMemories(next);
    setMemories(next);
    showToast('Memory removed.', 'success');
  };

  const handleFileChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setContent(file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6 mb-6">
      <div className="mb-4 flex items-center gap-3"><BookOpen className="text-purple-400" /><h2 className="text-xl font-semibold text-white">Memory Vault</h2></div>
      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white" />
        <select value={type} onChange={e => setType(e.target.value as 'text' | 'image' | 'audio')} className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white">
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="audio">Audio</option>
        </select>
        <button onClick={() => fileInputRef.current?.click()} className="rounded-2xl bg-purple-600 px-4 py-3 text-white hover:bg-purple-700">Upload</button>
      </div>
      {type === 'text' ? (
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} placeholder="Memory details..." className="w-full rounded-3xl border border-gray-700 bg-gray-800 px-4 py-3 text-white" />
      ) : (
        <input ref={fileInputRef} type="file" accept={type === 'image' ? 'image/*' : 'audio/*'} hidden onChange={e => handleFileChange(e.target.files?.[0])} />
      )}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button onClick={saveMemory} className="rounded-2xl bg-teal-600 px-5 py-3 text-white hover:bg-teal-700">Save</button>
        <button onClick={() => { setTitle(''); setContent(''); }} className="rounded-2xl bg-gray-700 px-5 py-3 text-white hover:bg-gray-600">Clear</button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {memories.map(memory => (
          <div key={memory.id} className="rounded-3xl border border-gray-700 bg-gray-800 p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-white font-semibold">{memory.title}</h3>
                <p className="text-gray-400 text-sm">{format(new Date(memory.createdAt), 'MMM d, yyyy')}</p>
              </div>
              <button onClick={() => deleteMemory(memory.id)} className="text-red-400 hover:text-red-200"><X size={18} /></button>
            </div>
            {memory.type === 'image' ? <div className="text-gray-400">Image file: {memory.content}</div> : null}
            {memory.type === 'audio' ? <div className="text-gray-400">Audio file: {memory.content}</div> : null}
            {memory.type === 'text' ? <p className="text-gray-300">{memory.content}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function RoutineInterface({ showToast }: { showToast: (message: string, type: 'success' | 'error') => void }) {
  const [routines, setRoutines] = useState<DailyRoutine[]>(storage.getDailyRoutines());

  const updateRoutine = (id: string, time: string) => {
    const next = routines.map(r => (r.id === id ? { ...r, timeOfDay: time } : r));
    storage.setDailyRoutines(next);
    setRoutines(next);
    showToast('Routine updated.', 'success');
  };

  return (
    <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6 mb-6">
      <div className="mb-4 flex items-center gap-3"><Clock className="text-purple-500" /><h2 className="text-xl font-semibold text-white">Daily Rhythm</h2></div>
      <div className="space-y-4">
        {routines.map(routine => (
          <div key={routine.id} className="flex flex-col gap-4 rounded-3xl bg-gray-800 p-4 border border-gray-700 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-white font-semibold">{routine.activity}</p>
              <p className="text-gray-400 text-sm">Every day at {routine.timeOfDay}</p>
            </div>
            <input type="time" value={routine.timeOfDay} onChange={e => updateRoutine(routine.id, e.target.value)} className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PatientInterface({ language, showToast }: { language: Language; showToast: (message: string, type: 'success' | 'error') => void }) {
  const patient = storage.getPatient();
  const memoryFacts = storage.getMemoryFacts();
  const triggerTopics = storage.getTriggerTopics();
  const legacyMessages = storage.getLegacyMessages();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { listen, isListening, isSpeaking, response, getGreeting } = useVoiceAssistant(patient.preferredName || 'friend', language);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getUpcomingRoutines = () => {
    const routines = storage.getDailyRoutines();
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    return routines
      .map(r => ({ ...r, mins: parseInt(r.timeOfDay.split(':')[0], 10) * 60 + parseInt(r.timeOfDay.split(':')[1], 10) }))
      .filter(r => r.mins >= now)
      .slice(0, 3);
  };

  const randomMemory = memoryFacts.length ? memoryFacts[Math.floor(Math.random() * memoryFacts.length)] : null;

  const playLegacy = () => {
    if (!legacyMessages.length) {
      showToast(translations[language].noLegacyMessages, 'error');
      return;
    }
    const message = legacyMessages[legacyMessages.length - 1];
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.messageText);
      utterance.lang = language === 'en' ? 'en-US' : 'zh-CN';
      window.speechSynthesis.speak(utterance);
    }
    showToast(translations[language].listenNow, 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pb-24">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-teal-600 p-6 text-center text-white shadow-xl shadow-purple-500/20 mb-6">
          {patient.photoUrl ? <img src={patient.photoUrl} alt={patient.preferredName} className="mx-auto mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-white" /> : null}
          <h1 className="text-3xl font-bold">{getGreeting()}</h1>
          <p className="mt-2 text-purple-100 text-lg">{format(currentTime, 'h:mm a')}</p>
        </div>

        {!patient.isAlive && legacyMessages.length > 0 && (
          <div className="mb-6 rounded-3xl border border-amber-500/40 bg-amber-600/10 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-amber-300 font-semibold">{translations[language].legacyMessagesAvailable}</p>
            <button onClick={playLegacy} className="rounded-2xl bg-amber-600 px-5 py-3 text-white hover:bg-amber-700">{translations[language].listenNow}</button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white mb-4"><Calendar className="text-purple-500" />{translations[language].todaysSchedule}</h2>
            {getUpcomingRoutines().map(routine => (
              <div key={routine.id} className="flex items-center justify-between rounded-3xl border-b border-gray-800 py-3 last:border-0">
                <span className="font-mono text-purple-400">{routine.timeOfDay}</span>
                <span className="text-white">{routine.activity}</span>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white mb-4"><Brain className="text-purple-400" />{translations[language].memoryMoment}</h2>
            <p className="text-gray-200 italic text-lg">{randomMemory ? `"${randomMemory.text}"` : language === 'en' ? 'Add memory facts to see them here.' : '添加记忆事实以在此查看。'}</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-900/20 p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-red-400 mb-4"><AlertTriangle className="text-red-400" />{translations[language].topicsToAvoid}</h2>
          <div className="flex flex-wrap gap-2">{triggerTopics.map(topic => (<span key={topic.id} className="rounded-full bg-red-900/40 px-4 py-2 text-sm text-red-200">{topic.topicText}</span>))}</div>
        </div>

        <button onClick={listen} className="mt-6 w-full rounded-3xl bg-purple-600 px-6 py-5 text-xl font-semibold text-white hover:bg-purple-700 transition-all flex items-center justify-center gap-3">
          {isListening ? <span className="animate-pulse">🎤 Listening...</span> : isSpeaking ? <span className="animate-pulse">🔊 {translations[language].speaking}</span> : <><Mic size={24} />{translations[language].talkToMe}</>}
        </button>

        {response ? <div className="mt-5 rounded-3xl bg-gray-900 p-5 text-center text-gray-200">{response}</div> : null}

        <MemoryUpload showToast={showToast} />
        <RoutineInterface showToast={showToast} />
      </div>
    </div>
  );
}

function CaregiverPortal({ onSimulateCall, language, showToast }: { onSimulateCall: (contact: Contact) => void; language: Language; showToast: (message: string, type: 'success' | 'error') => void }) {
  const [patient, setPatient] = useState(storage.getPatient());
  const [contacts, setContacts] = useState(storage.getContacts());
  const [memoryFacts, setMemoryFacts] = useState(storage.getMemoryFacts());
  const [triggerTopics, setTriggerTopics] = useState(storage.getTriggerTopics());
  const [dailyRoutines, setDailyRoutines] = useState(storage.getDailyRoutines());
  const [legacyMessages, setLegacyMessages] = useState(storage.getLegacyMessages());
  const [showAddContact, setShowAddContact] = useState(false);
  const [activeTab, setActiveTab] = useState<'contacts' | 'memory' | 'triggers' | 'routines' | 'legacy'>('contacts');
  const [newContact, setNewContact] = useState({ fullName: '', relationship: '', phoneNumber: '', memoryNote: '', photoUrl: '' });
  const t = translations[language];

  const refresh = () => {
    setContacts(storage.getContacts());
    setMemoryFacts(storage.getMemoryFacts());
    setTriggerTopics(storage.getTriggerTopics());
    setDailyRoutines(storage.getDailyRoutines());
    setLegacyMessages(storage.getLegacyMessages());
    setPatient(storage.getPatient());
  };

  const addContact = () => {
    if (!newContact.fullName || !newContact.relationship || !newContact.memoryNote) return;
    storage.setContacts([
      ...contacts,
      {
        ...newContact,
        id: Date.now().toString(),
        photoUrl: newContact.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(newContact.fullName)}&background=7c3aed&color=fff`,
      },
    ]);
    setNewContact({ fullName: '', relationship: '', phoneNumber: '', memoryNote: '', photoUrl: '' });
    setShowAddContact(false);
    refresh();
    showToast(t.contactAdded, 'success');
  };

  const addMemoryFact = () => {
    const text = prompt(t.enterMemoryFact);
    if (text) {
      storage.setMemoryFacts([...memoryFacts, { id: Date.now().toString(), text }]);
      refresh();
      showToast(t.memoryFactAdded, 'success');
    }
  };

  const addTriggerTopic = () => {
    const text = prompt(t.enterTriggerTopic);
    if (text) {
      storage.setTriggerTopics([...triggerTopics, { id: Date.now().toString(), topicText: text }]);
      refresh();
      showToast(t.triggerTopicAdded, 'success');
    }
  };

  const addRoutine = () => {
    const time = prompt(t.enterTime);
    const activity = prompt(t.enterActivity);
    if (time && activity) {
      storage.setDailyRoutines([...dailyRoutines, { id: Date.now().toString(), timeOfDay: time, activity }]);
      refresh();
      showToast(t.routineAdded, 'success');
    }
  };

  const addLegacyMessage = () => {
    const message = prompt(t.enterLegacyMessage);
    if (message) {
      storage.setLegacyMessages([...legacyMessages, { id: Date.now().toString(), messageText: message, createdAt: new Date().toISOString() }]);
      refresh();
      showToast(t.legacyMessageSaved, 'success');
    }
  };

  const deleteContact = (id: string) => {
    storage.setContacts(contacts.filter(item => item.id !== id));
    refresh();
    showToast(t.contactDeleted, 'success');
  };

  const deleteMemoryFact = (id: string) => {
    storage.setMemoryFacts(memoryFacts.filter(item => item.id !== id));
    refresh();
    showToast(t.memoryFactDeleted, 'success');
  };

  const deleteTriggerTopic = (id: string) => {
    storage.setTriggerTopics(triggerTopics.filter(item => item.id !== id));
    refresh();
    showToast(t.triggerTopicRemoved, 'success');
  };

  const deleteRoutine = (id: string) => {
    storage.setDailyRoutines(dailyRoutines.filter(item => item.id !== id));
    refresh();
    showToast(t.routineDeleted, 'success');
  };

  const markDeceased = () => {
    if (confirm(t.confirmDeceased)) {
      storage.setPatient({ ...patient, isAlive: false });
      refresh();
      showToast(t.patientMarkedDeceased, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pb-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-3xl p-6 mb-6 text-white shadow-xl shadow-purple-500/20">
          <h1 className="text-2xl font-bold">{t.memoriaDashboard}</h1>
          <p className="text-purple-100">{t.caringFor} {patient.fullName}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-2">
          {(['contacts','memory','triggers','routines','legacy'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-full px-5 py-2 font-semibold transition ${activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {t[tab]}
            </button>
          ))}
        </div>

        {activeTab === 'contacts' && (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{t.contacts} ({contacts.length})</h2>
              <button onClick={() => setShowAddContact(true)} className="rounded-2xl bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 flex items-center gap-2"><Plus size={18} />{t.addContact}</button>
            </div>
            <div className="grid gap-4">
              {contacts.map(contact => (
                <div key={contact.id} className="rounded-3xl border border-gray-800 bg-gray-900 p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <img src={contact.photoUrl} alt={contact.fullName} className="h-16 w-16 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold">{contact.fullName}</h3>
                      <p className="text-purple-400 text-sm">{contact.relationship}</p>
                      <p className="text-gray-400 text-sm italic">"{contact.memoryNote.substring(0, 60)}..."</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onSimulateCall(contact)} className="rounded-2xl bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700 text-sm">{t.testCall}</button>
                      <button onClick={() => deleteContact(contact.id)} className="rounded-2xl bg-red-600/20 px-3 py-2 text-red-400 hover:bg-red-500 hover:text-white"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'memory' && (
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{t.memory} ({memoryFacts.length})</h2>
              <button onClick={addMemoryFact} className="rounded-2xl bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 flex items-center gap-2"><Plus size={18} />{t.addFact}</button>
            </div>
            <div className="space-y-3">
              {memoryFacts.map(fact => (
                <div key={fact.id} className="rounded-3xl border border-gray-800 bg-gray-900 p-4 flex items-center justify-between">
                  <p className="text-gray-200">{fact.text}</p>
                  <button onClick={() => deleteMemoryFact(fact.id)} className="text-red-400 hover:text-red-200"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'triggers' && (
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{t.triggers} ({triggerTopics.length})</h2>
              <button onClick={addTriggerTopic} className="rounded-2xl bg-red-600 px-4 py-2 text-white hover:bg-red-700 flex items-center gap-2"><Plus size={18} />{t.addTopic}</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {triggerTopics.map(topic => (
                <span key={topic.id} className="rounded-full bg-red-900/30 px-4 py-2 text-sm text-red-200">{topic.topicText}</span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'routines' && (
          <div>
            <RoutineInterface showToast={showToast} />
            <div className="flex justify-end mt-4">
              <button onClick={addRoutine} className="rounded-2xl bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 flex items-center gap-2"><Plus size={18} />{t.addRoutine}</button>
            </div>
          </div>
        )}

        {activeTab === 'legacy' && (
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">{t.legacy} ({legacyMessages.length})</h2>
              <button onClick={addLegacyMessage} className="rounded-2xl bg-pink-600 px-4 py-2 text-white hover:bg-pink-700 flex items-center gap-2"><Plus size={18} />{t.addMessage}</button>
            </div>
            <div className="space-y-3">
              {legacyMessages.map(message => (
                <div key={message.id} className="rounded-3xl border border-gray-800 bg-gray-900 p-4">
                  <p className="text-gray-200">{message.messageText}</p>
                  <p className="text-gray-500 text-xs mt-2">{format(new Date(message.createdAt), 'MMM d, yyyy')}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl bg-red-900/20 border border-red-500/30 p-4">
              <p className="text-red-400 font-semibold mb-3">{t.dangerZone}</p>
              <button onClick={markDeceased} className="rounded-2xl bg-red-600 px-4 py-2 text-white hover:bg-red-700">{t.markPatientAsDeceased}</button>
              <p className="text-gray-400 text-sm mt-2">{t.thisEnablesLegacyMode}</p>
            </div>
          </div>
        )}

        {showAddContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setShowAddContact(false)}>
            <div className="w-full max-w-md rounded-3xl bg-gray-900 p-6" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-4">{t.addContact}</h2>
              <div className="space-y-3">
                <input value={newContact.fullName} onChange={e => setNewContact({ ...newContact, fullName: e.target.value })} placeholder="Full Name" className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white" />
                <input value={newContact.relationship} onChange={e => setNewContact({ ...newContact, relationship: e.target.value })} placeholder="Relationship" className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white" />
                <input value={newContact.phoneNumber} onChange={e => setNewContact({ ...newContact, phoneNumber: e.target.value })} placeholder="Phone Number" className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white" />
                <textarea value={newContact.memoryNote} onChange={e => setNewContact({ ...newContact, memoryNote: e.target.value })} placeholder="Memory Note" rows={3} className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white" />
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={addContact} className="flex-1 rounded-2xl bg-purple-600 px-4 py-3 text-white hover:bg-purple-700">Save</button>
                <button onClick={() => setShowAddContact(false)} className="flex-1 rounded-2xl bg-gray-700 px-4 py-3 text-white hover:bg-gray-600">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CallerOverlay({ contact, onClose, onAnswer, onDecline, language, showToast }: { contact: Contact; onClose: () => void; onAnswer: () => void; onDecline: () => void; language: Language; showToast: (message: string, type: 'success' | 'error') => void }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const t = translations[language];

  const speak = () => {
    if (!('speechSynthesis' in window)) return;
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${contact.fullName}, your ${contact.relationship}. ${contact.memoryNote}`);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md rounded-3xl bg-gradient-to-r from-purple-500 to-teal-500 p-[1px]">
        <div className="rounded-3xl bg-gray-900 p-6 text-center text-white">
          <img src={contact.photoUrl} alt={contact.fullName} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover ring-4 ring-purple-500" />
          <h2 className="text-2xl font-bold mb-2">{contact.fullName}</h2>
          <p className="text-purple-300 mb-4">{contact.relationship}</p>
          <p className="mb-6 text-gray-300 italic">"{contact.memoryNote}"</p>
          <button onClick={speak} className="mb-5 flex w-full items-center justify-center gap-2 rounded-3xl bg-purple-600 px-4 py-3 text-white hover:bg-purple-700">
            {isSpeaking ? t.speaking : <><Volume2 size={18} />{t.readCallerInfo}</>}
          </button>
          <div className="flex gap-3">
            <button onClick={() => { onDecline(); onClose(); }} className="flex-1 rounded-3xl bg-red-600 px-4 py-3 text-white hover:bg-red-700">{t.decline}</button>
            <button onClick={() => { onAnswer(); onClose(); showToast(`${t.connectedWith} ${contact.fullName}`, 'success'); }} className="flex-1 rounded-3xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700">{t.answer}</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function App() {
  const [profileCreated, setProfileCreated] = useState(storage.getProfileCreated());
  const [view, setView] = useState<'landing' | 'patient' | 'caregiver'>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeCall, setActiveCall] = useState<Contact | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  useEffect(() => {
    if (profileCreated && view === 'landing') {
      setView('patient');
    }
  }, [profileCreated, view]);

  const contactToCall = (contact: Contact) => setActiveCall(contact);

  const refreshProfile = () => {
    // Force re-render when profile is updated
    setShowProfileModal(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Language Toggle */}
      <div className="fixed left-4 top-4 z-40 flex gap-2 rounded-full bg-gray-900/90 p-1 border border-gray-700">
        <button onClick={() => setLanguage('en')} className={`rounded-full px-4 py-2 text-sm ${language === 'en' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>EN</button>
        <button onClick={() => setLanguage('zh')} className={`rounded-full px-4 py-2 text-sm ${language === 'zh' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>中文</button>
      </div>
      
      {/* View Toggle - only on non-landing pages */}
      {view !== 'landing' && (
        <div className="fixed right-4 top-4 z-40 flex gap-2 rounded-full bg-gray-900/90 p-1 border border-gray-700">
          <button onClick={() => setView('patient')} className={`rounded-full px-4 py-2 text-sm ${view === 'patient' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>{translations[language].patientInterface}</button>
          <button onClick={() => setView('caregiver')} className={`rounded-full px-4 py-2 text-sm ${view === 'caregiver' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>{translations[language].caregiverPortal}</button>
        </div>
      )}
      
      {/* Main Content */}
      {view === 'landing' ? <LandingPage onStart={() => setShowProfileModal(true)} /> : view === 'patient' ? <PatientInterface language={language} showToast={showToast} /> : <CaregiverPortal onSimulateCall={contactToCall} language={language} showToast={showToast} />}
      
      {/* Navigation Bar - only shown when not on landing page */}
      <NavigationBar
        onBack={() => {
          if (view === 'patient') setView('caregiver');
          else if (view === 'caregiver') setView('patient');
        }}
        onHome={() => setView('landing')}
        onProfile={() => setShowProfileModal(true)}
        currentView={view}
        language={language}
      />
      
      {/* Modals */}
      <AnimatePresence>
        {showProfileModal && !profileCreated && (
          <ProfileModal 
            onComplete={() => { setProfileCreated(true); setView('patient'); setShowProfileModal(false); }} 
            onClose={() => setShowProfileModal(false)}
            language={language}
            isCreating={!profileCreated}
          />
        )}
        {showProfileModal && profileCreated && (
          <ProfileModal 
            onClose={() => setShowProfileModal(false)}
            language={language}
            isCreating={false}
          />
        )}
      </AnimatePresence>
      
      {/* Caller Overlay */}
      <AnimatePresence>
        {activeCall && (
          <CallerOverlay 
            contact={activeCall} 
            onClose={() => setActiveCall(null)} 
            onAnswer={() => {}} 
            onDecline={() => {}} 
            language={language} 
            showToast={showToast} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
