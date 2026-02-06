import { Metadata } from 'next';
import { Target, Eye, Lightbulb, Users, Award, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'О нас | Alhimik Studio',
  description: 'Команда профессионалов в области VR/AR, 3D-визуализации и BIM',
};

const values = [
  {
    icon: Target,
    title: 'Наша миссия',
    description: 'Сделать цифровые инструменты доступными и эффективными для бизнеса, архитектуры и творчества. Мы верим, что даже самая смелая идея заслуживает идеального воплощения.',
  },
  {
    icon: Eye,
    title: 'Наше видение',
    description: 'Мы видим мир, где технологии стирают границы между воображением и реальностью, а цифровые инструменты становятся неотъемлемой частью прогресса.',
  },
  {
    icon: Lightbulb,
    title: 'Инновации',
    description: 'Мы не просто используем технологии — мы адаптируем их под ваши задачи. Постоянно изучаем новые инструменты и методы для достижения лучших результатов.',
  },
  {
    icon: Users,
    title: 'Командная работа',
    description: 'Наша команда сочетает креативность дизайнеров, точность инженеров и экспертизу IT-специалистов. Каждый проект — это синергия профессионалов.',
  },
  {
    icon: Award,
    title: 'Качество',
    description: 'Мы стремимся к совершенству в каждой детали. Каждый проект проходит строгий контроль качества на всех этапах разработки.',
  },
  {
    icon: TrendingUp,
    title: 'Развитие',
    description: 'Мы растем вместе с нашими клиентами. Обучаемся, совершенствуемся и применяем лучшие практики индустрии.',
  },
];

const stats = [
  { value: '50+', label: 'Завершенных проектов' },
  { value: '30+', label: 'Довольных клиентов' },
  { value: '5+', label: 'Лет на рынке' },
  { value: '15+', label: 'Специалистов в команде' },
];

const expertise = [
  'VR/AR/MR разработка',
  '3D-моделирование и анимация',
  'Архитектурная визуализация',
  'BIM-проектирование',
  'Игровая разработка',
  'Motion design',
  'UI/UX дизайн',
  'Техническая поддержка',
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-display font-bold">
              О <span className="gradient-text">нас</span>
            </h1>
            <p className="text-xl text-gray-300">
              Добро пожаловать в студию, где технологии будущего становятся реальностью
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="glass rounded-3xl p-12 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Наша история</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Мы — команда энтузиастов, объединивших виртуальную реальность (VR), дополненную реальность (AR), 
                3D-анимацию и передовое проектирование для создания решений, которые вдохновляют, упрощают и преображают.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                За годы работы мы реализовали десятки проектов для компаний различного масштаба — 
                от инновационных стартапов до крупных корпораций. Наш опыт охватывает промышленность, 
                недвижимость, образование, ритейл и развлечения.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Сегодня мы продолжаем расти, расширять компетенции и помогать клиентам воплощать 
                самые амбициозные идеи с помощью передовых цифровых технологий.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-4">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Наши <span className="gradient-text">ценности</span>
            </h2>
            <p className="text-xl text-gray-300">
              Принципы, которыми мы руководствуемся в работе
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="glass rounded-2xl p-8 hover:bg-white/10 transition-all"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Наша <span className="gradient-text">экспертиза</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {expertise.map((skill) => (
                <div
                  key={skill}
                  className="glass rounded-xl p-4 text-center hover:bg-white/10 transition-all"
                >
                  <span className="text-gray-300">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center space-y-6">
            <blockquote className="space-y-6">
              <p className="text-2xl md:text-3xl font-display italic text-gray-200">
                Мы не просто адаптируемся к будущему — мы создаем его
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto" />
              <p className="text-gray-400">
                Через инновации, синергию инженерии и искусства, через диалог с теми, кто готов мыслить смело. 
                Наша миссия — превратить ваши идеи в цифровые вселенные, которые делают реальность лучше, умнее и человечнее.
              </p>
              <p className="text-primary-400 font-semibold">— Alhimik Studio</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Готовы работать с нами?
            </h2>
            <p className="text-xl text-gray-300">
              Давайте создадим что-то удивительное вместе
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-white font-medium hover:shadow-lg hover:shadow-primary-500/50 transition-all">
              Связаться с нами
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
