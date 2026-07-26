import {
  BookOpen,
  BrainCircuit,
  ClipboardCheck,
  CreditCard,
} from "lucide-react";

const cards = [
  {
    title: "Mes notes",
    description:
      "Consulter mes résultats et mes notes.",
    icon: BookOpen,
    iconClass:
      "bg-blue-100 text-blue-600",
  },

  {
    title: "Mes présences",
    description:
      "Consulter mes présences et absences.",
    icon: ClipboardCheck,
    iconClass:
      "bg-emerald-100 text-emerald-600",
  },

  {
    title: "Mes paiements",
    description:
      "Consulter mes paiements.",
    icon: CreditCard,
    iconClass:
      "bg-orange-100 text-orange-600",
  },

  {
    title: "Mes prédictions",
    description:
      "Consulter l'analyse de mes performances.",
    icon: BrainCircuit,
    iconClass:
      "bg-violet-100 text-violet-600",
  },
];

export default function StudentDashboard() {
  return (
    <div
      className="
        min-h-screen
        space-y-6
      "
      style={{
        color:
          "var(--text-color)",
      }}
    >
      {/* WELCOME */}

      <section
        className="
          rounded-[1.7rem]
          border
          p-6
          shadow-sm
        "
        style={{
          backgroundColor:
            "var(--card-bg)",

          borderColor:
            "var(--border-color)",
        }}
      >
        <p
          className="text-xs font-bold"
          style={{
            color:
              "var(--muted-text)",
          }}
        >
          Student Dashboard
        </p>

        <h2 className="mt-1 text-2xl font-black">
          Mon espace étudiant
        </h2>

        <p
          className="mt-2 text-sm font-semibold"
          style={{
            color:
              "var(--muted-text)",
          }}
        >
          Consultez vos notes, présences,
          paiements et prédictions.
        </p>
      </section>

      {/* CARDS */}

      <section
        className="
          grid
          gap-5

          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {cards.map(
          ({
            title,
            description,
            icon: Icon,
            iconClass,
          }) => (
            <div
              key={title}
              className="
                rounded-[1.5rem]
                border
                p-5
                shadow-sm
                transition

                hover:-translate-y-1
                hover:shadow-md
              "
              style={{
                backgroundColor:
                  "var(--card-bg)",

                borderColor:
                  "var(--border-color)",
              }}
            >
              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl

                  ${iconClass}
                `}
              >
                <Icon size={22} />
              </div>

              <h3 className="mt-5 text-lg font-black">
                {title}
              </h3>

              <p
                className="mt-2 text-sm font-semibold"
                style={{
                  color:
                    "var(--muted-text)",
                }}
              >
                {description}
              </p>
            </div>
          )
        )}
      </section>
    </div>
  );
}