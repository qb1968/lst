import { useState } from "react";

const faqs = [
  {
    question: "Veterans and Active Military discount",
    answer: `Call our office at (336)-524-6822 to submit your Veterans/Military ID to receive discount.`,
    isHeading: true,
  },
  {
    question: "Can I get a refund?",
    answer: `NO REFUNDS, EXCHANGES or CREDITS will be given for ANY reason other than an entirely canceled show (rescheduled shows are not considered canceled)...`,
  },
  {
    question: "Will my current tickets work for the rescheduled shows?",
    answer: `Yes. Your current tickets will be honored for the rescheduled show date (with the same seats.)`,
  },
  {
    question: "What are your Covid requirements inside the theater?",
    answer: `We will NOT be requiring patrons or staff to wear a face mask...`,
  },
  {
    question:
      "What do I do if I ordered tickets online but didn't receive them in my email?",
    answer: `The doors will open 1 1/2 hours prior to the show time...`,
  },
  {
    question: "Why am I not receiving emails or phone calls about an update?",
    answer: `We may have incorrect contact information in our system. If you have had a change in your contact information, please contact us...`,
  },
  {
    question: "What are the different pricing tiers?",
    answer: `The ticket prices depend on the location of the seats. Gold Tables are closest to the stage, then VIP Gold, VIP, House...`,
  },
  {
    question:
      "Is Handicapped/Wheelchair Seating available? Is There an Elevator to the Balcony?",
    answer: `We have very limited Handicapped/Wheelchair seating available...`,
  },
  {
    question: "What are the business hours of the Box Office?",
    answer: `We do not have a Box Office location. You may call our office to purchase tickets at (336) 524-6822...`,
  },
  {
    question: "Are food/drinks/alcohol available at the theater?",
    answer: `We have a small concessions area in the theater lobby. We serve candy, popcorn, sodas, coffee, hot chocolate and water...`,
  },
  {
    question: "REFUND POLICY",
    answer: `NO REFUNDS, EXCHANGES or CREDITS will be given for ANY reason other than an entirely canceled show...`,
    isHeading: true,
  },
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="p-8 max-w-5xl mx-auto text-white">
      <h2 className="text-4xl font-bold mb-8 text-center">
        Frequently Asked Questions
      </h2>

      <div className="space-y-6 bg-gray-900 bg-opacity-70 p-6 rounded shadow-lg">
        {faqs.map((faq, index) =>
          faq.isHeading ? (
            <div key={index}>
              <h3 className="text-2xl sm:text-3xl font-bold mt-6 mb-2 text-yellow-400">
                {faq.question}
              </h3>
              <p className="text-gray-300 text-lg">{faq.answer}</p>
            </div>
          ) : (
            <div key={index} className="border-b border-gray-700 pb-4">
              <button
                className="w-full text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggle(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-${index}`}
              >
                <span className="text-xl font-medium">{faq.question}</span>
                <span className="text-xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              <div
                id={`faq-${index}`}
                className={`transition-all duration-300 overflow-hidden ${
                  openIndex === index ? "max-h-96 mt-2" : "max-h-0"
                }`}
              >
                <p className="text-gray-300 text-base whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
