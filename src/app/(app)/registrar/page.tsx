import Link from "next/link"
import {
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Users,
} from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SCREENS = [
  {
    href: "/registrar/students",
    title: "Students",
    description:
      "Student master records — demographics, PH registrar fields, credentials.",
    icon: Users,
    className: "md:col-span-1 md:row-span-2",
  },
  {
    href: "/registrar/curriculum",
    title: "Curriculum",
    description:
      "Prescribed subjects per program, with prerequisite chains.",
    icon: BookOpen,
    className: "md:col-span-2",
  },
  {
    href: "/registrar/permits",
    title: "Permits to Take Exam",
    description:
      "Track exam eligibility and fee balances per student per term.",
    icon: ClipboardCheck,
    className: "md:col-span-1"
  },
  {
    href: "/registrar/credentials",
    title: "Credentials",
    description:
      "Track Credentiaals of Students",
    icon: GraduationCap,
    className: "md:col-span-1",
  },
  {
    href: "/registrar/enrollment",
    title: "Enrollment & Grades",
    description:
      "Enroll students into classes, view class rosters, compute grades.",
    icon: GraduationCap,
    className: "md:col-span-3",
  },
]

export default function RegistrarPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Registrar
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Student records, curriculum, enrollment, and exam permits.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[180px]">
        {SCREENS.map((screen) => {
          const Icon = screen.icon

          return (
            <Link
              key={screen.href}
              href={screen.href}
              className={screen.className}
            >
              <Card className="group relative h-full overflow-hidden rounded-2xl border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg">
                <CardHeader className="relative z-10 flex h-full flex-col justify-between p-6">
                  {/* Icon + Arrow */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                      <Icon className="h-5 w-5" />
                    </div>

                    <ArrowUpRight
                      className="
                        h-5 w-5
                        text-muted-foreground
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                      "
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <CardTitle className="text-xl">
                      {screen.title}
                    </CardTitle>

                    <CardDescription className="mt-2 max-w-lg leading-relaxed">
                      {screen.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                {/* Decorative background */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-12
                    -top-12
                    h-40
                    w-40
                    rounded-full
                    bg-muted/50
                    blur-3xl
                    transition-transform
                    duration-500
                    group-hover:scale-150
                  "
                />
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}