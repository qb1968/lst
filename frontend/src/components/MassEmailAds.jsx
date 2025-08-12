import React, { useState, useRef, useEffect } from "react";
import EmailEditor from "react-email-editor";

const API_BASE = "https://lst-ys3v.onrender.com/api";

export default function MassEmailAds() {
  const [emailList, setEmailList] = useState("");
  const [emailListName, setEmailListName] = useState("");
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [savedLists, setSavedLists] = useState([]);
  const [templates, setTemplates] = useState([]);
  const emailEditorRef = useRef(null);

  // Fetch saved templates and email lists from backend
  useEffect(() => {
    fetchTemplates();
    fetchEmailLists();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_BASE}/get-templates`);
      const data = await res.json();
      setTemplates(data);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    }
  };

  const fetchEmailLists = async () => {
    try {
      const res = await fetch(`${API_BASE}/get-email-lists`);
      const data = await res.json();
      setSavedLists(data);
    } catch (err) {
      console.error("Failed to fetch email lists:", err);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch(`${API_BASE}/upload-image`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.url) {
        return { data: { link: data.url } };
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      return Promise.reject(error);
    }
  };

  const handleSendEmails = () => {
    setSending(true);
    setMessage("");
    emailEditorRef.current.editor.exportHtml(async (data) => {
      const { html } = data;
      const payload = {
        emails: emailList.split(",").map((e) => e.trim()),
        subject,
        body: html,
      };
      try {
        const response = await fetch(`${API_BASE}/send-mass-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          setMessage("Emails sent successfully!");
        } else {
          setMessage("Failed to send emails.");
        }
      } catch (error) {
        setMessage("Error sending emails.");
      } finally {
        setSending(false);
      }
    });
  };

  // Save email list to backend
  const saveEmailList = async () => {
    if (!emailList.trim() || !emailListName.trim()) {
      setMessage("Please provide a name and emails to save the list.");
      return;
    }
    try {
      const payload = {
        name: emailListName,
        emails: emailList.split(",").map((e) => e.trim()),
      };
      const res = await fetch(`${API_BASE}/save-email-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage("Email list saved!");
        fetchEmailLists();
        setEmailListName("");
      } else {
        setMessage("Failed to save email list.");
      }
    } catch (error) {
      setMessage("Error saving email list.");
    }
  };

  // Save template to backend
  const saveTemplate = () => {
    emailEditorRef.current.editor.exportHtml(async (data) => {
      const { design } = data;
      const name = prompt("Enter a name for this template:");
      if (!name) {
        setMessage("Template save cancelled.");
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/save-template`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, design }),
        });
        if (res.ok) {
          setMessage("Template saved!");
          fetchTemplates();
        } else {
          setMessage("Failed to save template.");
        }
      } catch {
        setMessage("Error saving template.");
      }
    });
  };

  const loadTemplate = (template) => {
    emailEditorRef.current.editor.loadDesign(template.design);
  };

  // Delete template by ID
  const deleteTemplate = async (id) => {
    if (!window.confirm("Delete this template?")) return;
    try {
      const res = await fetch(`${API_BASE}/delete-template/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Template deleted.");
        fetchTemplates();
      } else {
        setMessage("Failed to delete template.");
      }
    } catch {
      setMessage("Error deleting template.");
    }
  };

  // Load email list into textarea and name input
  const loadEmailList = (list) => {
    setEmailList(list.emails.join(", "));
    setEmailListName(list.name);
  };

  // Delete email list by ID
  const deleteEmailList = async (id) => {
    if (!window.confirm("Delete this email list?")) return;
    try {
      const res = await fetch(`${API_BASE}/delete-email-list/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("Email list deleted.");
        fetchEmailLists();
      } else {
        setMessage("Failed to delete email list.");
      }
    } catch {
      setMessage("Error deleting email list.");
    }
  };

  const handleUploadTemplate = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const design = JSON.parse(e.target.result);
        emailEditorRef.current.editor.loadDesign(design);
        setMessage("Template loaded from file!");
      } catch {
        setMessage("Invalid template file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex gap-6">
      {/* Sidebar with saved lists and templates */}
      <aside className="w-64 bg-gray-100 p-4 rounded shadow space-y-8 overflow-y-auto max-h-[700px]">
        <section>
          <h3 className="font-semibold mb-2">Saved Email Lists</h3>
          {savedLists.length === 0 && <p>No saved lists</p>}
          {savedLists.map((list) => (
            <div
              key={list._id}
              className="flex items-center justify-between mb-1"
            >
              <button
                className="text-left text-blue-700 underline"
                onClick={() => loadEmailList(list)}
              >
                {list.name}
              </button>
              <button
                onClick={() => deleteEmailList(list._id)}
                className="text-red-600 ml-2 font-bold"
                title="Delete List"
              >
                &times;
              </button>
            </div>
          ))}
        </section>

        <section>
          <h3 className="font-semibold mb-2">Saved Templates</h3>
          {templates.length === 0 && <p>No saved templates</p>}
          {templates.map((template) => (
            <div
              key={template._id}
              className="flex items-center justify-between mb-1"
            >
              <button
                className="text-left text-green-700 underline"
                onClick={() => loadTemplate(template)}
              >
                {template.name}
              </button>
              <button
                onClick={() => deleteTemplate(template._id)}
                className="text-red-600 ml-2 font-bold"
                title="Delete Template"
              >
                &times;
              </button>
            </div>
          ))}
        </section>
      </aside>

      <main className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Mass Email Ads</h2>

        {/* Email List Input + name */}
        <label className="block mb-1 font-semibold">
          Email List Name
          <input
            type="text"
            value={emailListName}
            onChange={(e) => setEmailListName(e.target.value)}
            className="w-full border p-2 rounded mb-3"
            placeholder="Name your email list"
          />
        </label>

        <label className="block mb-4">
          Recipient Emails (comma separated)
          <textarea
            className="w-full border p-2 rounded text-black bg-white placeholder-gray-400"
            rows={4}
            value={emailList}
            onChange={(e) => setEmailList(e.target.value)}
          />
        </label>

        <div className="flex gap-2 mb-6">
          <button
            onClick={saveEmailList}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Save Email List
          </button>
        </div>

        {/* Subject Input */}
        <label className="block mb-4">
          Subject
          <input
            className="w-full border p-2 rounded"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>

        {/* Email Editor */}
        <label className="block mb-6 font-semibold">Create Your Flier:</label>
        <div className="h-[700px] w-full max-w-[900px] mx-auto">
          <EmailEditor
            ref={emailEditorRef}
            tools={{
              image: { uploadFile: uploadImage },
            }}
          />
        </div>

        {/* Template Buttons */}
        <div className="mt-4 flex gap-2 items-center">
          <button
            onClick={saveTemplate}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Save Template
          </button>

          <input type="file" accept=".json" onChange={handleUploadTemplate} />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendEmails}
          disabled={sending}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send Emails"}
        </button>

        {message && <p className="mt-4">{message}</p>}
      </main>
    </div>
  );
}
