import React, { useState, useRef } from "react";
import EmailEditor from "react-email-editor";

export default function MassEmailAds() {
  const [emailList, setEmailList] = useState("");
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const emailEditorRef = useRef(null);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://lst-ys3v.onrender.com/api/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );

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
        const response = await fetch(
          "https://lst-ys3v.onrender.com/api/send-mass-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

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

  return (
    <div className="p-6 max-w-5xl mx-auto ">
      <h2 className="text-2xl font-bold mb-4">Mass Email Ads</h2>

      <label className="block mb-2">
        Recipient Emails (comma separated)
        <textarea
          className="w-full border p-2 rounded text-black bg-white placeholder-gray-400"
          rows={4}
          value={emailList}
          onChange={(e) => setEmailList(e.target.value)}
          style={{ color: "black", backgroundColor: "white" }}
        />
      </label>

      <label className="block mb-4">
        Subject
        <input
          className="w-full border p-2 rounded"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>

      <label className="block mb-6 font-semibold">Create Your Flier:</label>
      <div className="h-[700px] w-full max-w-[900px] mx-auto">
        <EmailEditor
          ref={emailEditorRef}
          tools={{
            image: {
              uploadFile: uploadImage,
            },
          }}
        />
      </div>

      <button
        onClick={handleSendEmails}
        disabled={sending}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {sending ? "Sending..." : "Send Emails"}
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
