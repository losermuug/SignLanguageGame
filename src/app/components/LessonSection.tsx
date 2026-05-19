"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpenText, ChevronRight, Hash } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  hint: string;
};

const LESSONS: Lesson[] = [
  {
    id: "alphabet",
    title: "Цагаан толгой",
    subtitle: "Үсэг бүрийн дохиог нэг нэгээр нь сур",
    hint: "Гарын үндсэн хэлбэр, хурууны байрлалаас эхлээрэй.",
  },
  {
    id: "words",
    title: "Үг",
    subtitle: "Богино өдөр тутмын үгсээр дадлага хий",
    hint: "Үсгүүдийг энгийн, тогтооход амар үг болгон холбоорой.",
  },
  {
    id: "phrases",
    title: "Өгүүлбэр",
    subtitle: "Бүтэн илэрхийллээр өөртөө итгэлтэй бол",
    hint: "Тусдаа дохионоос байгалийн харилцааны урсгал руу шилжинэ.",
  },
];

export default function LessonSection() {
  const [activeLesson, setActiveLesson] = useState(LESSONS[0].id);

  return (
    <motion.section
      className="backdrop-blur-xl bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-2xl p-5 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-cyber-text-muted">
            Хичээлийн зам
          </h2>
          <p className="text-sm text-cyber-text-secondary mt-1">
            Дадлага хийх хэсгээ сонгоно уу.
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center shrink-0">
          <BookOpenText className="w-4.5 h-4.5 text-cyber-cyan" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {LESSONS.map((lesson, index) => {
          const isActive = lesson.id === activeLesson;

          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => setActiveLesson(lesson.id)}
              className={`group w-full text-left rounded-xl border px-4 py-3 transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-cyber-cyan/8 border-cyber-cyan/30 shadow-[0_0_0_1px_rgba(0,240,255,0.08)]"
                  : "bg-cyber-elevated border-[var(--panel-border)] hover:border-[var(--panel-hover-border)] hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    isActive
                      ? "bg-cyber-cyan/15 border-cyber-cyan/30 text-cyber-cyan"
                      : "bg-white/[0.03] border-[var(--panel-border)] text-cyber-text-secondary"
                  }`}
                >
                  <Hash className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-cyber-text">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-cyber-text-secondary mt-0.5">
                        {lesson.subtitle}
                      </p>
                    </div>

                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-cyber-text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-3">
                    <p className="text-[0.72rem] leading-relaxed text-cyber-text-muted max-w-[18rem]">
                      {lesson.hint}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider shrink-0 transition-colors ${
                        isActive
                          ? "text-cyber-cyan"
                          : "text-cyber-text-muted group-hover:text-cyber-text-secondary"
                      }`}
                    >
                      Нээх
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
