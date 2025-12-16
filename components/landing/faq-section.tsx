import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "./constants";

export function FAQSection() {
  return (
    <section
      className="max-w-5xl mx-auto px-4 lg:px-12 mb-16 lg:mb-32 mt-16 lg:mt-32 scroll-mt-32"
      id="faq"
    >
      <div className="text-center mb-12">
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">よくある質問</h2>
        <p className="text-[var(--text-secondary)]">
          ご不明な点は、こちらをご確認ください。
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-[var(--bg-tertiary)] p-2">
        <Accordion type="multiple" className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
              className={
                index !== faqs.length - 1
                  ? "border-b-[var(--bg-tertiary)]"
                  : "border-none"
              }
            >
              <AccordionTrigger
                className={`px-4 lg:px-6 text-left hover:no-underline text-base lg:text-lg font-bold hover:bg-[var(--bg-secondary)] data-[state=open]:bg-[var(--bg-secondary)] ${
                  index === 0 ? "rounded-t-xl" : ""
                } ${index === faqs.length - 1 ? "rounded-b-xl" : ""}`}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-4 text-[var(--text-secondary)]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

