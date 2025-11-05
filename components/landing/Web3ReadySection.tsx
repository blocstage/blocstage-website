"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Web3ReadySection() {
  const [email, setEmail] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setSubmissionStatus("loading");

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyyq9pElfxTb7v3pkJ2tMdijEqQYne2sIvESgbjSKiyIXdZtymmLL3YI0T215bhApHcZg/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );

      // Check if the response status is within the success range (200-299)
      if (response.ok) {
        setSubmissionStatus("success");
        setEmail("");
      } else {
        // Log the error response body for more detail
        const errorText = await response.text();
        console.error("Failed to submit:", response.status, errorText);
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmissionStatus("error");
    }
  };

  return (
    <section
      className="py-10 sm:py-16 md:py-24 bg-[#476D8F]"
      id="waitlist-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl leading-loose font-bold text-white ">
              Traditional Friendly.
              <br className="hidden md:block" /> Web3 Ready.
            </h2>
          </div>
          <div className="relative lg:mt-0">
            <p
              className="text-xl text-left text-blue-100 mb-8"
              style={{ maxWidth: "500px" }}
            >
              Use only what fits your audience.
              <br /> <br />
              BlocStage works beautifully as a traditional event tool and opens
              up next-gen engagement when you&#39;re ready.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row w-full max-w-md bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border-none focus:outline-none text-gray-900 bg-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  className="bg-[#E04E1E] hover:bg-orange-600 text-white px-2 py-4 sm:py-6 rounded-lg text-base font-semibold shadow-none transition w-full sm:w-auto"
                  type="submit"
                  style={{ minWidth: "auto" }}
                  disabled={submissionStatus === "loading"}
                >
                  {submissionStatus === "loading"
                    ? "Joining..."
                    : "Subscribe for news"}
                </Button>
              </div>
              {submissionStatus === "success" && (
                <p className="mt-4 text-white text-sm">
                  🎉 You&apos;ve successfully joined the waitlist!
                </p>
              )}
              {submissionStatus === "error" && (
                <p className="mt-4 text-red-400 text-sm">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
