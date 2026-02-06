'use client';

import { Target, Eye, Heart, Zap } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Наша миссия',
    description: 'Сделать цифровые инструменты доступными и эффективными для бизнеса, архитектуры и творчества.',
  },
  {
    icon: Eye,
    title: 'Наше видение',
    description: 'Мир, где технологии стирают границы между воображением и реальностью.',
  },
  {
    icon: Heart,
    title: 'Наши ценности',
    description: 'Инновации, качество, внимание к деталям и искренняя забота о результате клиента.',
  },
  {
    icon: Zap,
    title: 'Наш подход',
    description: 'Синергия креативности дизайнеров, точности инженеров и экспертизы IT-специалистов.',
  },
];

export function About() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                О <span className="gradient-text">нас</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Добро пожаловать в студию, где технологии будущего становятся реальностью!
              </p>
            </div>

            <p className="text-gray-300 leading-relaxed">
              Мы — команда энтузиастов, объединивших виртуальную реальность (VR), дополненную реальность (AR), 
              3D-анимацию и передовое проектирование для создания решений, которые вдохновляют, упрощают и преображают.
            </p>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Почему выбирают нас?</h3>
              <ul className="space-y-3">
                {[
                  'Опыт работы с передовыми технологиями',
                  'Индивидуальный подход к каждому проекту',
                  'Полный цикл разработки от идеи до реализации',
                  'Постоянная поддержка и консультации',
                ].map((item) => (
                  <li key={item} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="glass rounded-2xl p-6 hover:bg-white/10 transition-all group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quote Section */}
        <div className="mt-20 glass rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <blockquote className="space-y-6">
            <p className="text-2xl md:text-3xl font-display italic text-gray-200">
              "Мы не просто адаптируемся к будущему — мы создаем его"
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto" />
            <p className="text-gray-400">
              Через инновации, синергию инженерии и искусства, через диалог с теми, кто готов мыслить смело
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
