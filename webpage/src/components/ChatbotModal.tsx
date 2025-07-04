import React, { useState } from "react";
import CloseIcon from "./CloseIcon";
import { AxiosInstance } from "axios";
import { FormDataStore } from "../types/resumeWithPhoto";
import { FormDataStore as NITFormDataStore } from "../types/nitResume";
import { FormDataStore as JakesFormDataStore } from "../types/jakeResume";
import toast from "react-hot-toast";
interface ChatbotModalProps<T> {
  closeModal: () => void;
  updateFormData: (data: T) => void;
  api: AxiosInstance;
  prompt: string;
  setPrompt: (prompt: string) => void;
  resumeType: string;
  formDataStore: T | undefined;
}

const ChatbotModal = <
  T extends FormDataStore | NITFormDataStore | JakesFormDataStore
>({
  closeModal,
  updateFormData,
  prompt,
  setPrompt,
  api,
  resumeType,
  formDataStore,
}: ChatbotModalProps<T>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      type Payload<T> = {
        prompt: string;
        type: string;
        formDataStore?: T;
      };
      const payload: Payload<typeof formDataStore> = {
        prompt: prompt,
        type: resumeType,
      };
      if (formDataStore && Object.keys(formDataStore).length > 0) {
        payload.formDataStore = formDataStore;
      }

      const response = await api.post("/convert-prompt-to-json", payload);
      updateFormData(response.data);
      toast.success("Ai Data Generated Successfully");

      closeModal();
    } catch (err) {
      setError("Failed to convert prompt. Please try again.");
      console.error("Error converting prompt:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative"
      aria-labelledby="chatbot-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed top-0 left-0 h-200 inset-0 z-50 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed top-0 left-0 h-200 inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full justify-center px-2 py-12 text-center">
          <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-gray-800 text-slate-100 text-left shadow-xl transition-all">
            <div className="px-5 py-4">
              <button
                type="button"
                className="rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
                onClick={closeModal}
              >
                <span className="sr-only">Close menu</span>
                <CloseIcon />
              </button>

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">AI Powered Editing</h2>
                <p className="text-gray-300 mb-6">
                  Be clear about which section do you want your prompt to be applied in
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="prompt"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >

                    </label>
                    <textarea
                      id="prompt"
                      rows={6}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      placeholder="Example: Built a web based video call application as a project where i used react and Socket.io"
                      required
                    />
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Generating..." : "Apply Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;
