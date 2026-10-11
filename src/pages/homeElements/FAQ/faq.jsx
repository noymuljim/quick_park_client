import { useState } from "react";

const generalQuestions = [
    {
        question: "What is your parking service?",
        answer:
            "Our platform helps drivers find available parking spaces easily and book them conveniently.",
    },
    {
        question: "How can I find a parking space?",
        answer:
            "Search for your preferred location to see available parking spaces and choose the one that suits you.",
    },
    {
        question: "Can I book a parking space in advance?",
        answer:
            "Yes, you can book an available parking space in advance for your preferred time.",
    },
    {
        question: "How do I make a payment?",
        answer:
            "You can securely pay for your parking booking using the available payment methods.",
    },
    {
        question: "Can I cancel my booking?",
        answer:
            "Yes, you can cancel your booking according to our cancellation policy.",
    },
];

const partnerQuestions = [
    {
        question: "How can I become a parking partner?",
        answer:
            "You can register on our platform and submit your parking space information to become a partner.",
    },
    {
        question: "Can I list multiple parking spaces?",
        answer:
            "Yes, partners can add and manage multiple parking spaces from their dashboard.",
    },
    {
        question: "How can I manage my parking spaces?",
        answer:
            "You can manage availability, pricing, bookings, and other information from your partner dashboard.",
    },
    {
        question: "How will I receive my earnings?",
        answer:
            "Your earnings will be processed according to our partner payout policy.",
    },
    {
        question: "What information do I need to become a partner?",
        answer:
            "You will need to provide your basic information and details about your parking space.",
    },
];

const FAQ = () => {
    const [activeTab, setActiveTab] = useState("general");
    const [openIndex, setOpenIndex] = useState(0);

    const questions =
        activeTab === "general" ? generalQuestions : partnerQuestions;

    const changeTab = (tab) => {
        setActiveTab(tab);
        setOpenIndex(0);
    };

    return (
        <section className="py-20">
            <div className="mx-auto max-w-4xl px-5">

           
                <div className="mb-16 space-y-4 text-center">
                    <h1 className="text-3xl font-bold text-orange-400 md:text-5xl">
                        Frequently Asked Questions
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-gray-400">
                        Find answers to common questions about our parking
                        service and partnership.
                    </p>
                </div>

              
                <div className="mb-10 flex justify-center gap-3">
                    <button
                        onClick={() => changeTab("general")}
                        className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${
                            activeTab === "general"
                                ? "bg-orange-400 text-secondary"
                                : "border border-gray-600 text-secondary hover:border-orange-400"
                        }`}
                    >
                        General Questions
                    </button>

                    <button
                        onClick={() => changeTab("partners")}
                        className={`rounded-full px-6 py-2.5 text-sm font-medium transition ${
                            activeTab === "partners"
                                ? "bg-orange-400 text-secondary"
                                : "border border-gray-600 text-secondary hover:border-orange-400"
                        }`}
                    >
                        Partner Questions
                    </button>
                </div>

             
                <div>
                    {questions.map((item, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className="border-b border-gray-700"
                            >
                                <button
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : index)
                                    }
                                    className="flex w-full items-center justify-between gap-5 py-6 text-left"
                                >
                                    <span className="text-base font-semibold text-secondary md:text-lg">
                                        {item.question}
                                    </span>

                                    <span
                                        className={`text-2xl text-orange-400 transition-transform duration-300 ${
                                            isOpen ? "rotate-45" : ""
                                        }`}
                                    >
                                        +
                                    </span>
                                </button>

                                {isOpen && (
                                    <p className="pb-6 pr-10 text-sm leading-7 text-secondary md:text-base">
                                        {item.answer}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default FAQ;