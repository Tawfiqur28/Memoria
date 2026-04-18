const { app, BrowserWindow, Tray, Menu, nativeImage } = require("electron");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();

let tray = null;
let win = null;

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.VITE_SUPABASE_ANON_KEY || "",
);

async function syncMemoryGraph(patientId) {
  const [patient, contacts, facts] = await Promise.all([
    supabase.from("patient_profiles").select("*").eq("id", patientId).single(),
    supabase.from("contacts").select("*").eq("patient_id", patientId),
    supabase.from("life_facts").select("*").eq("patient_id", patientId),
  ]);
  return {
    patient: patient.data,
    contacts: contacts.data || [],
    lifeFacts: facts.data || [],
  };
}

function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false,
  });
  win.loadFile(path.join(__dirname, "renderer.html"));
}

app.whenReady().then(() => {
  createWindow();
  const trayIcon = nativeImage.createFromPath(path.join(__dirname, "tray.png"));
  tray = new Tray(trayIcon.isEmpty() ? nativeImage.createEmpty() : trayIcon);
  tray.setToolTip("Memoria OS Guardian");
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Open Memoria",
        click: () => win && win.show(),
      },
      {
        label: "Sync Memory Graph",
        click: async () => {
          await syncMemoryGraph("11111111-1111-1111-1111-111111111111");
        },
      },
      { type: "separator" },
      {
        label: "Exit",
        click: () => app.quit(),
      },
    ]),
  );
});
