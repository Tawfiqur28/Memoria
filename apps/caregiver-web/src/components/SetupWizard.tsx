import { useState, useRef } from "react";
import { motion } from "framer-motion";

type PatientData = {
  fullName: string;
  preferredName: string;
  age: number;
  language: string;
  photo: File | null;
  photoPreview: string | null;
};

type Props = {
  onBack: () => void;
  onComplete: (data: PatientData) => void;
};

export default function SetupWizard({ onBack, onComplete }: Props) {
  const [formData, setFormData] = useState<PatientData>({
    fullName: "",
    preferredName: "",
    age: 0,
    language: "",
    photo: null,
    photoPreview: null,
  });
  const [errors, setErrors] = useState<Partial<PatientData>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = ["English", "Spanish", "French", "German", "Italian", "Portuguese", "Japanese", "Korean", "Chinese", "Hindi", "Arabic"];

  const handleChange = (field: keyof PatientData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handlePhotoUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: "Photo must be less than 5MB" }));
      return;
    }
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, photo: file, photoPreview: preview }));
    setErrors(prev => ({ ...prev, photo: undefined }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handlePhotoUpload(file);
  };

  const validate = (): boolean => {
    const newErrors: Partial<PatientData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.preferredName.trim()) newErrors.preferredName = "Preferred name is required";
    if (!formData.age || formData.age < 1) newErrors.age = "Valid age is required";
    if (!formData.language) newErrors.language = "Language is required";
    if (!formData.photo) newErrors.photo = "Photo is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log("Submit button clicked");
    if (validate()) {
      console.log("Validation passed, calling onComplete with:", formData);
      onComplete(formData);
    } else {
      console.log("Validation failed:", errors);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #05050f 0%, #0a0a1a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      fontFamily: "'Inter', sans-serif",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: "680px",
          width: "100%",
          background: "rgba(26, 26, 46, 0.8)",
          backdropFilter: "blur(20px)",
          borderRadius: "48px",
          border: "1px solid rgba(167, 139, 250, 0.2)",
          padding: "2.5rem",
        }}
      >
        <h1 style={{
          fontSize: "32px",
          fontWeight: "700",
          background: "linear-gradient(135deg, #a78bfa, #2dd4bf)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "0.5rem",
        }}>
          Who is this for?
        </h1>

        {/* Full Name */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#cbd5e1", marginBottom: "8px" }}>
            FULL NAME <span style={{ color: "#f43f5e" }}>*</span>
          </label>
          <input
            type="text"
            style={{
              width: "100%",
              background: "rgba(15, 15, 30, 0.8)",
              border: errors.fullName ? "1px solid #f43f5e" : "1px solid #1e1e35",
              borderRadius: "16px",
              padding: "14px 18px",
              fontSize: "15px",
              color: "#f1f5f9",
            }}
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
          {errors.fullName && <div style={{ fontSize: "11px", color: "#f43f5e", marginTop: "4px" }}>{errors.fullName}</div>}
        </div>

        {/* Preferred Name */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#cbd5e1", marginBottom: "8px" }}>
            PREFERRED NAME <span style={{ color: "#f43f5e" }}>*</span>
          </label>
          <input
            type="text"
            style={{
              width: "100%",
              background: "rgba(15, 15, 30, 0.8)",
              border: errors.preferredName ? "1px solid #f43f5e" : "1px solid #1e1e35",
              borderRadius: "16px",
              padding: "14px 18px",
              fontSize: "15px",
              color: "#f1f5f9",
            }}
            placeholder="What they like to be called"
            value={formData.preferredName}
            onChange={(e) => handleChange("preferredName", e.target.value)}
          />
          {errors.preferredName && <div style={{ fontSize: "11px", color: "#f43f5e", marginTop: "4px" }}>{errors.preferredName}</div>}
        </div>

        {/* Age and Language */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#cbd5e1", marginBottom: "8px" }}>
              AGE <span style={{ color: "#f43f5e" }}>*</span>
            </label>
            <input
              type="number"
              style={{
                width: "100%",
                background: "rgba(15, 15, 30, 0.8)",
                border: errors.age ? "1px solid #f43f5e" : "1px solid #1e1e35",
                borderRadius: "16px",
                padding: "14px 18px",
                fontSize: "15px",
                color: "#f1f5f9",
              }}
              placeholder="Age"
              value={formData.age || ""}
              onChange={(e) => handleChange("age", parseInt(e.target.value) || 0)}
            />
            {errors.age && <div style={{ fontSize: "11px", color: "#f43f5e", marginTop: "4px" }}>{errors.age}</div>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#cbd5e1", marginBottom: "8px" }}>
              LANGUAGE <span style={{ color: "#f43f5e" }}>*</span>
            </label>
            <select
              style={{
                width: "100%",
                background: "rgba(15, 15, 30, 0.8)",
                border: errors.language ? "1px solid #f43f5e" : "1px solid #1e1e35",
                borderRadius: "16px",
                padding: "14px 18px",
                fontSize: "15px",
                color: "#f1f5f9",
              }}
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
            >
              <option value="">Select language</option>
              {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
            {errors.language && <div style={{ fontSize: "11px", color: "#f43f5e", marginTop: "4px" }}>{errors.language}</div>}
          </div>
        </div>

        {/* Photo Upload */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#cbd5e1", marginBottom: "8px" }}>
            THEIR PHOTO <span style={{ color: "#f43f5e" }}>*</span>
          </label>
          <div
            style={{
              background: "rgba(15, 15, 30, 0.6)",
              border: errors.photo ? "2px dashed #f43f5e" : "2px dashed #1e1e35",
              borderRadius: "24px",
              padding: "2rem",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {formData.photoPreview ? (
              <>
                <img src={formData.photoPreview} alt="Preview" style={{ width: "120px", height: "120px", borderRadius: "60px", objectFit: "cover", margin: "0 auto 1rem", border: "3px solid #a78bfa" }} />
                <div style={{ fontSize: "13px", color: "#cbd5e1" }}>Click or drag to change</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: "48px", marginBottom: "0.5rem" }}>📸</div>
                <div style={{ fontSize: "14px", color: "#cbd5e1", fontWeight: "500" }}>Click or drag & drop to upload photo</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "0.5rem" }}>Supports: JPG, PNG, GIF (Max 5MB)</div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload(file);
              }}
            />
          </div>
          {errors.photo && <div style={{ fontSize: "11px", color: "#f43f5e", marginTop: "4px" }}>{errors.photo}</div>}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onBack}
            style={{
              flex: 1,
              background: "transparent",
              border: "1px solid #1e1e35",
              borderRadius: "20px",
              padding: "14px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#94a3b8",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
              border: "none",
              borderRadius: "20px",
              padding: "14px",
              fontSize: "14px",
              fontWeight: "600",
              color: "white",
              cursor: "pointer",
            }}
          >
            Add their people →
          </button>
        </div>
      </motion.div>
    </div>
  );
}