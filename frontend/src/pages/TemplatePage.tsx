import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import moment from "moment";

import FormSection from "@/components/content/FormSection";
import OutputSection from "@/components/content/OutputSection";

import { chatSession } from "../utils/AiModel"; // Adjust the import path
import { db } from "../utils/db"; // Adjust the import path
import { AIOutput } from "../utils/schema"; // Adjust the import path
import Templates from "@/components/aidashboard/Templates"; // Adjust the import path

const TemplatePage = () => {
  const { slug } = useParams(); // React Router replaces Next.js params
  const selectedTemplate = Templates.find((item) => item.slug === slug);

  const [loading, setLoading] = useState(false);
  const [aiOutput, setAIOutput] = useState<string>("");

  const GenerateAicontent = async (formData: any) => {
    setLoading(true);

    const SelectedPrompt = selectedTemplate?.aiprompt;
    const FinalAiprompt = JSON.stringify(formData) + "," + SelectedPrompt;

    try {
      const result = await chatSession.sendMessage(FinalAiprompt);
      const aiResponse = result?.response?.text();

      if (aiResponse) {
        setAIOutput(aiResponse);
        await saveInDb(formData, selectedTemplate?.slug, aiResponse);
      } else {
        console.error("AI response is undefined");
      }
    } catch (error) {
      console.error("Error generating AI content:", error);
    }

    setLoading(false);
  };

  const saveInDb = async (formData: any, slug: string | undefined, aiResponse: string) => {
    console.log("Saving to DB:", { formData, slug, aiResponse });

    try {
      const result = await db.insert(AIOutput).values({
        formData: JSON.stringify(formData),
        templateSlug: slug || "unknown",
        aiResponse: aiResponse,
        createdBy: "anonymous",
        createdAt: moment().toISOString(),
      });
      console.log("Insert successful:", result);
    } catch (error) {
      console.error("Error inserting into DB:", error);
    }
  };

  return (
    <div>
      {/* Back to dashboard */}
      <Link to="/aidashboard">
        <button>
          <ArrowLeft />
        </button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
        {/* Forms section */}
        <div className="col-span-1 md:col-span-1">
          <FormSection
            selectedTemplate={selectedTemplate}
            userFormInput={(v: any) => GenerateAicontent(v)}
            loading={loading}
          />
        </div>

        {/* Output section */}
        <div className="col-span-1 md:grid-cols-2">
          <OutputSection aiOutput={aiOutput} />
        </div>
      </div>
    </div>
  );
};

export default TemplatePage;
